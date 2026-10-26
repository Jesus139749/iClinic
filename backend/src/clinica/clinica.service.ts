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
import { ChangePasswordDto } from '../paciente/dto/change-password.dto';
import { detectImageMimeType } from '../paciente/paciente.service';
import { ClinicaResponse } from './dto/clinica-response.interface';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { UpdateClinicaProfileDto } from './dto/update-clinica-profile.dto';

@Injectable()
export class ClinicaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClinicaDto: CreateClinicaDto) {
    const {
      name,
      cnpj,
      email,
      phone,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      postalCode,
      password,
      confirmPassword,
    } = createClinicaDto;

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

    const existingClinic = await this.prisma.clinic.findUnique({
      where: { cnpj },
    });

    if (existingClinic) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const passwordHash = await hash(password, 12);

    await this.prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone,
        type: 'CLINICA',
        clinic: {
          create: {
            cnpj,
            street: street.trim(),
            number: number.trim(),
            complement: complement?.trim() || null,
            neighborhood: neighborhood.trim(),
            city: city.trim(),
            state,
            postalCode,
          },
        },
      },
    });
  }

  async getMine(user: AuthenticatedUser): Promise<ClinicaResponse> {
    const clinic = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { clinic: true },
    });

    if (!clinic?.clinic) {
      throw new NotFoundException('Clínica não encontrada');
    }

    return this.toResponse(clinic, clinic.clinic);
  }

  async updateMine(
    user: AuthenticatedUser,
    dto: UpdateClinicaProfileDto,
  ): Promise<ClinicaResponse> {
    const userData: Prisma.UserUpdateInput = {};
    const clinicData: Prisma.ClinicUpdateWithoutUserInput = {};

    if (dto.name !== undefined) userData.name = dto.name.trim();
    if (dto.email !== undefined) {
      userData.email = dto.email.trim().toLowerCase();
    }
    if (dto.phone !== undefined) userData.phone = dto.phone;

    if (dto.street !== undefined) clinicData.street = dto.street.trim();
    if (dto.number !== undefined) clinicData.number = dto.number.trim();
    if (dto.complement !== undefined) {
      clinicData.complement = dto.complement?.trim() || null;
    }
    if (dto.neighborhood !== undefined) {
      clinicData.neighborhood = dto.neighborhood.trim();
    }
    if (dto.city !== undefined) clinicData.city = dto.city.trim();
    if (dto.state !== undefined) clinicData.state = dto.state;
    if (dto.postalCode !== undefined) clinicData.postalCode = dto.postalCode;

    if (Object.keys(clinicData).length > 0) {
      userData.clinic = { update: clinicData };
    }

    if (Object.keys(userData).length === 0) {
      return this.getMine(user);
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id: user.sub },
        data: userData,
        include: { clinic: true },
      });

      if (!updated.clinic) {
        throw new NotFoundException('Clínica não encontrada');
      }

      return this.toResponse(updated, updated.clinic);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('E-mail já cadastrado');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Clínica não encontrada');
        }
      }
      throw error;
    }
  }

  async updateImage(
    user: AuthenticatedUser,
    file: Express.Multer.File | undefined,
  ): Promise<ClinicaResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Envie uma imagem no campo "image"');
    }

    if (!detectImageMimeType(file.buffer)) {
      throw new UnsupportedMediaTypeException(
        'A imagem deve estar no formato JPEG, PNG ou WebP',
      );
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id: user.sub },
        data: { image: new Uint8Array(file.buffer) },
        include: { clinic: true },
      });

      if (!updated.clinic) {
        throw new NotFoundException('Clínica não encontrada');
      }

      return this.toResponse(updated, updated.clinic);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Clínica não encontrada');
      }
      throw error;
    }
  }

  async changePassword(
    user: AuthenticatedUser,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const clinic = await this.prisma.user.findUnique({
      where: { id: user.sub },
    });

    if (!clinic) {
      throw new NotFoundException('Clínica não encontrada');
    }

    if (!(await compare(dto.currentPassword, clinic.passwordHash))) {
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
    });
  }

  private toResponse(
    user: {
      name: string;
      email: string;
      phone: string | null;
      image: Uint8Array | null;
    },
    clinic: {
      cnpj: string;
      street: string;
      number: string;
      complement: string | null;
      neighborhood: string;
      city: string;
      state: string;
      postalCode: string;
    },
  ): ClinicaResponse {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: this.toDataUri(user.image),
      cnpj: clinic.cnpj,
      street: clinic.street,
      number: clinic.number,
      complement: clinic.complement,
      neighborhood: clinic.neighborhood,
      city: clinic.city,
      state: clinic.state,
      postalCode: clinic.postalCode,
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
