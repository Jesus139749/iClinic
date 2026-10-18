import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PacienteService } from './paciente.service';

describe('PacienteService profile operations', () => {
  let service: PacienteService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  const patient = {
    id: 42,
    name: 'João da Silva',
    email: 'joao@example.com',
    phone: '11987654321',
    type: 'PACIENTE',
    passwordHash: 'must-not-be-returned',
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    service = new PacienteService(prisma as unknown as PrismaService);
  });

  it('returns only public profile fields for the authenticated patient', async () => {
    prisma.user.findUnique.mockResolvedValue(patient);

    await expect(
      service.getMine({ sub: patient.id, role: 'PACIENTE' }),
    ).resolves.toEqual({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: patient.id } }),
    );
  });

  it('updates only allowed fields for the authenticated patient ID', async () => {
    prisma.user.findUnique.mockResolvedValue(patient);
    prisma.user.update.mockResolvedValue({
      ...patient,
      name: 'João Atualizado',
      email: 'novo@example.com',
    });

    await expect(
      service.updateMine(
        { sub: patient.id, role: 'PACIENTE' },
        {
          name: '  João Atualizado  ',
          email: ' Novo@Example.com ',
        },
      ),
    ).resolves.toEqual({
      name: 'João Atualizado',
      email: 'novo@example.com',
      phone: patient.phone,
    });
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: patient.id },
        data: {
          name: 'João Atualizado',
          email: 'novo@example.com',
        },
      }),
    );
  });

  it('rejects clinic accounts without querying or changing user data', async () => {
    await expect(
      service.getMine({ sub: patient.id, role: 'CLINICA' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    await expect(
      service.updateMine(
        { sub: patient.id, role: 'CLINICA' },
        { name: 'Tentativa de alteração' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
