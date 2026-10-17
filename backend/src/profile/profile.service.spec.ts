import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileService } from './profile.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));
jest.mock('../generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {},
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
  },
}));

describe('ProfileService', () => {
  let service: ProfileService;
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
  const mockedCompare = jest.mocked(compare);
  const mockedHash = jest.mocked(hash);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    service = new ProfileService(prisma as unknown as PrismaService);
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

  it('changes only the authenticated patient password hash', async () => {
    prisma.user.findUnique.mockResolvedValue(patient);
    mockedCompare.mockResolvedValue(true);
    mockedHash.mockResolvedValue('new-hash');
    prisma.user.update.mockResolvedValue({ id: patient.id });

    await expect(
      service.changePassword(
        { sub: patient.id, role: 'PACIENTE' },
        {
          currentPassword: 'Current123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        },
      ),
    ).resolves.toBeUndefined();

    expect(mockedCompare).toHaveBeenCalledWith(
      'Current123',
      patient.passwordHash,
    );
    expect(mockedHash).toHaveBeenCalledWith('NewPassword123', 12);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: patient.id },
      data: { passwordHash: 'new-hash' },
      select: { id: true },
    });
  });

  it('rejects an incorrect current password without updating the user', async () => {
    prisma.user.findUnique.mockResolvedValue(patient);
    mockedCompare.mockResolvedValue(false);

    await expect(
      service.changePassword(
        { sub: patient.id, role: 'PACIENTE' },
        {
          currentPassword: 'Incorrect123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        },
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(mockedHash).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects a mismatched password confirmation without updating the user', async () => {
    prisma.user.findUnique.mockResolvedValue(patient);
    mockedCompare.mockResolvedValue(true);

    await expect(
      service.changePassword(
        { sub: patient.id, role: 'PACIENTE' },
        {
          currentPassword: 'Current123',
          newPassword: 'NewPassword123',
          confirmPassword: 'Different123',
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mockedHash).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects a patient that does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.changePassword(
        { sub: patient.id, role: 'PACIENTE' },
        {
          currentPassword: 'Current123',
          newPassword: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        },
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(mockedCompare).not.toHaveBeenCalled();
    expect(mockedHash).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
