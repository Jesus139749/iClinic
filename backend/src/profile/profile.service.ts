import {
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface PatientProfileResponse {
  name: string;
  email: string;
  phone: string | null;
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getMine(user: AuthenticatedUser): Promise<PatientProfileResponse> {
    const patient = await this.findPatient(user);
    return this.toResponse(patient);
  }

  async updateMine(
    user: AuthenticatedUser,
    dto: UpdateProfileDto,
  ): Promise<PatientProfileResponse> {
    const patient = await this.findPatient(user);

    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.email !== undefined) {
      data.email = dto.email.trim().toLowerCase();
    }
    if (dto.phone !== undefined) {
      data.phone = dto.phone?.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      return patient;
    }

    try {
      const updatedPatient = await this.prisma.user.update({
        where: { id: user.sub },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });
      return this.toResponse(updatedPatient);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  async changePassword(
    user: AuthenticatedUser,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const patient = await this.findPatientCredentials(user);

    if (!(await compare(dto.currentPassword, patient.passwordHash))) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'A nova senha e a confirmação não coincidem',
      );
    }

    const passwordHash = await hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.sub },
      data: { passwordHash },
      select: { id: true },
    });
  }

  private async findPatientCredentials(
    user: AuthenticatedUser,
  ): Promise<{ id: number; passwordHash: string }> {
    if (user.role !== 'PACIENTE') {
      throw new ForbiddenException('Acesso permitido somente para pacientes');
    }

    const patient = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        type: true,
        passwordHash: true,
      },
    });

    if (!patient || patient.type !== 'PACIENTE') {
      throw new NotFoundException('Paciente não encontrado');
    }

    return {
      id: patient.id,
      passwordHash: patient.passwordHash,
    };
  }

  private async findPatient(
    user: AuthenticatedUser,
  ): Promise<PatientProfileResponse> {
    if (user.role !== 'PACIENTE') {
      throw new ForbiddenException('Acesso permitido somente para pacientes');
    }

    const patient = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
      },
    });

    if (!patient || patient.type !== 'PACIENTE') {
      throw new NotFoundException('Paciente não encontrado');
    }

    return {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    };
  }

  private toResponse(patient: PatientProfileResponse): PatientProfileResponse {
    return {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    };
  }
}
