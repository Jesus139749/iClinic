import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { MedicoService } from './medico.service';

const user = { sub: 10, role: 'CLINICA' as const };

describe('MedicoService', () => {
  let service: MedicoService;
  const prisma = {
    clinic: { findUnique: jest.fn() },
    doctor: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    specialty: {
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const doctor = {
    id: 1,
    clinicId: 5,
    name: 'Dra. Camila',
    crm: '123SP',
    phone: null,
    image: null,
    active: true,
    specialties: [{ id: 2, clinicId: 5, name: 'Dermatologia' }],
  };

  const knownError = (code: string) =>
    new Prisma.PrismaClientKnownRequestError('erro', {
      code,
      clientVersion: 'test',
    });

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.clinic.findUnique.mockResolvedValue({ id: 5, userId: 10 });

    const module = await Test.createTestingModule({
      providers: [MedicoService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(MedicoService);
  });

  it('lista apenas os médicos da clínica autenticada', async () => {
    prisma.doctor.findMany.mockResolvedValue([doctor]);

    const result = await service.list(user);

    expect(prisma.clinic.findUnique).toHaveBeenCalledWith({
      where: { userId: 10 },
    });
    expect(prisma.doctor.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { clinicId: 5 } }),
    );
    expect(result).toEqual([
      expect.objectContaining({
        id: 1,
        image: null,
        specialties: [{ id: 2, name: 'Dermatologia' }],
      }),
    ]);
  });

  it('retorna 404 quando o usuário não tem clínica', async () => {
    prisma.clinic.findUnique.mockResolvedValue(null);

    await expect(service.list(user)).rejects.toThrow(NotFoundException);
  });

  it('retorna 404 para médico de outra clínica', async () => {
    prisma.doctor.findFirst.mockResolvedValue(null);

    await expect(service.get(user, 99)).rejects.toThrow(NotFoundException);
    expect(prisma.doctor.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 99, clinicId: 5 } }),
    );
  });

  it('rejeita especialidades que não pertencem à clínica', async () => {
    prisma.specialty.count.mockResolvedValue(1);

    await expect(
      service.create(user, { name: 'X', crm: '1SP', specialtyIds: [2, 3] }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.doctor.create).not.toHaveBeenCalled();
  });

  it('cria o médico normalizando o CRM', async () => {
    prisma.specialty.count.mockResolvedValue(1);
    prisma.doctor.create.mockResolvedValue(doctor);

    await service.create(user, {
      name: ' Dra. Camila ',
      crm: ' 123sp ',
      specialtyIds: [2, 2],
    });

    const [args] = prisma.doctor.create.mock.calls[0] as [
      { data: Record<string, unknown> },
    ];
    expect(args.data).toEqual({
      clinicId: 5,
      name: 'Dra. Camila',
      crm: '123SP',
      phone: null,
      specialties: { connect: [{ id: 2 }] },
    });
  });

  it('retorna 409 quando o CRM já existe', async () => {
    prisma.specialty.count.mockResolvedValue(1);
    prisma.doctor.create.mockRejectedValue(knownError('P2002'));

    await expect(
      service.create(user, { name: 'X', crm: '1SP', specialtyIds: [2] }),
    ).rejects.toThrow(ConflictException);
  });

  it('desativa um médico via update', async () => {
    prisma.doctor.findFirst.mockResolvedValue(doctor);
    prisma.doctor.update.mockResolvedValue({ ...doctor, active: false });

    const result = await service.update(user, 1, { active: false });

    expect(prisma.doctor.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 }, data: { active: false } }),
    );
    expect(result.active).toBe(false);
  });

  it('não remove especialidade em uso por médicos', async () => {
    prisma.specialty.findFirst.mockResolvedValue({
      id: 2,
      _count: { doctors: 1 },
    });

    await expect(service.removeSpecialty(user, 2)).rejects.toThrow(
      ConflictException,
    );
    expect(prisma.specialty.delete).not.toHaveBeenCalled();
  });

  it('retorna 409 ao cadastrar especialidade duplicada', async () => {
    prisma.specialty.create.mockRejectedValue(knownError('P2002'));

    await expect(
      service.createSpecialty(user, { name: 'Cardiologia' }),
    ).rejects.toThrow(ConflictException);
  });
});
