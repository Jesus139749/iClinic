import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacienteResponse } from './dto/paciente-response.interface';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type ImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export function detectImageMimeType(bytes: Uint8Array): ImageMimeType | null {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, index) => bytes[offset + index] === byte);

  if (startsWith([0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }
  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return 'image/webp';
  }
  return null;
}

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPacienteDto: CreatePacienteDto): Promise<void> {
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
    const patient = await this.prisma.user.findUnique({
      where: { id: user.sub }
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return this.toResponse(patient);
  }

  async updateMine(
    user: AuthenticatedUser,
    dto: UpdatePacienteDto,
  ): Promise<PacienteResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { id: user.sub }
    });

    if (!existing) {
      throw new NotFoundException('Paciente não encontrado');
    }

    const patient = this.toResponse(existing);

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
          image: true,
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

  async updateImage(
    user: AuthenticatedUser,
    file: Express.Multer.File | undefined,
  ): Promise<PacienteResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Envie uma imagem no campo "image"');
    }

    if (!detectImageMimeType(file.buffer)) {
      throw new UnsupportedMediaTypeException(
        'A imagem deve estar no formato JPEG, PNG ou WebP',
      );
    }

    try {
      const updatedPatient = await this.prisma.user.update({
        where: { id: user.sub },
        data: { image: new Uint8Array(file.buffer) },
      });
      return this.toResponse(updatedPatient);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Paciente não encontrado');
      }
      throw error;
    }
  }

  async changePassword(
    user: AuthenticatedUser,
    dto: ChangePasswordDto,
  ): Promise<void> {

    const patient = await this.prisma.user.findUnique({
      where: { id: user.sub }
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

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
      data: { passwordHash }
    });
  }

  private toResponse(patient: {
    name: string;
    email: string;
    phone: string | null;
    image: Uint8Array | null;
  }): PacienteResponse {
    return {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      image: this.toDataUri(patient.image),
    };
  }

  private toDataUri(image: Uint8Array | null): string | null {
    if (!image?.length) {
      return null;
    }

    const mimeType = detectImageMimeType(image) ?? 'image/jpeg';
    return `data:${mimeType};base64,${Buffer.from(image).toString('base64')}`;
  }
}
