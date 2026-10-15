import { ConflictException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { compare } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { PacienteService } from './paciente.service';

jest.mock('../../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

type FindUserArgs = {
  where: { email: string };
  select: { id: true };
};

type CreateUserArgs = {
  data: {
    name: string;
    email: string;
    passwordHash: string;
    phone: string;
    type: 'PACIENTE';
  };
  select: {
    id: true;
    name: true;
    email: true;
    phone: true;
    type: true;
    createdAt: true;
  };
};

type CreatedUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'PACIENTE';
  createdAt: Date;
};

describe('PacienteService', () => {
  let service: PacienteService;
  let prisma: {
    user: {
      findUnique: jest.Mock<Promise<{ id: number } | null>, [FindUserArgs]>;
      create: jest.Mock<Promise<CreatedUser>, [CreateUserArgs]>;
    };
  };
  let module: TestingModule;
  let createdPasswordHash: string;

  beforeEach(async () => {
    createdPasswordHash = '';
    prisma = {
      user: {
        findUnique: jest.fn<Promise<{ id: number } | null>, [FindUserArgs]>(),
        create: jest.fn<Promise<CreatedUser>, [CreateUserArgs]>(),
      },
    };

    module = await Test.createTestingModule({
      providers: [
        PacienteService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(PacienteService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('creates a patient with a bcrypt hash and returns no password hash', async () => {
    let createUserArgs: CreateUserArgs | undefined;
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation((args) => {
      createUserArgs = args;
      const { data } = args;
      createdPasswordHash = data.passwordHash;
      return Promise.resolve({
        id: 1,
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    const result = await service.create({
      name: '  João da Silva  ',
      email: ' JOAO@EXAMPLE.COM ',
      phone: '11987654321',
      password: 'SenhaSegura123',
      confirmPassword: 'SenhaSegura123',
    });

    expect(result).toEqual({
      id: 1,
      name: 'João da Silva',
      email: 'joao@example.com',
      phone: '11987654321',
      type: 'PACIENTE',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    expect(result).not.toHaveProperty('passwordHash');
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
    expect(createUserArgs?.data).toEqual({
      name: 'João da Silva',
      email: 'joao@example.com',
      passwordHash: createdPasswordHash,
      phone: '11987654321',
      type: 'PACIENTE',
    });
    expect(createUserArgs?.select).toEqual({
      id: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      createdAt: true,
    });

    expect(await compare('SenhaSegura123', createdPasswordHash)).toBe(true);
  });

  it('rejects an email that is already registered', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });

    await expect(
      service.create({
        name: 'João da Silva',
        email: 'joao@example.com',
        phone: '11987654321',
        password: 'SenhaSegura123',
        confirmPassword: 'SenhaSegura123',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('returns a conflict if a duplicate email is detected during creation', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockRejectedValue(
      Object.assign(new Error('Unique constraint failed'), { code: 'P2002' }),
    );

    await expect(
      service.create({
        name: 'João da Silva',
        email: 'joao@example.com',
        phone: '11987654321',
        password: 'SenhaSegura123',
        confirmPassword: 'SenhaSegura123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('rejects different passwords', async () => {
    await expect(
      service.create({
        name: 'João da Silva',
        email: 'joao@example.com',
        phone: '11987654321',
        password: 'SenhaSegura123',
        confirmPassword: 'SenhaDiferente123',
      }),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });
});
