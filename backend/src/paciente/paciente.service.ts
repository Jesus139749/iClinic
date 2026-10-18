import {
  BadRequestException,
  ConflictException,
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
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

interface PacienteResponse {
  name: string;
  email: string;
  phone: string | null;
}

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    const { name, email, phone, password, confirmPassword } = createPacienteDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não conferem');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await hash(password, 12);

    await this.prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone,
        type: 'PACIENTE',
      },
    });
  }

  async getMine(user: AuthenticatedUser): Promise<PacienteResponse> {
    return this.findPatient(user);
  }

  async updateMine(
    user: AuthenticatedUser,
    dto: UpdatePacienteDto,
  ): Promise<PacienteResponse> {
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

    return { id: patient.id, passwordHash: patient.passwordHash };
  }

  private async findPatient(
    user: AuthenticatedUser,
  ): Promise<PacienteResponse> {
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

    return this.toResponse(patient);
  }

  private toResponse(patient: PacienteResponse): PacienteResponse {
    return {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    };
  }
}
