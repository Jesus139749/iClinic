import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { Prisma } from '../generated/prisma/client';
import { detectImageMimeType } from '../paciente/paciente.service';
import { CreateEspecialidadeDto } from './dto/create-especialidade.dto';
import { CreateMedicoDto } from './dto/create-medico.dto';
import {
  EspecialidadeComContagemResponse,
  MedicoResponse,
} from './dto/medico-response.interface';
import { UpdateMedicoDto } from './dto/update-medico.dto';

const medicoInclude = {
  specialties: { orderBy: { name: 'asc' } },
} satisfies Prisma.DoctorInclude;

type MedicoWithSpecialties = Prisma.DoctorGetPayload<{
  include: typeof medicoInclude;
}>;

@Injectable()
export class MedicoService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser): Promise<MedicoResponse[]> {
    const clinic = await this.resolveClinic(user);

    const doctors = await this.prisma.doctor.findMany({
      where: { clinicId: clinic.id },
      include: medicoInclude,
      orderBy: { name: 'asc' },
    });

    return doctors.map((doctor) => this.toResponse(doctor));
  }

  async get(user: AuthenticatedUser, id: number): Promise<MedicoResponse> {
    const clinic = await this.resolveClinic(user);
    return this.toResponse(await this.findOwned(clinic.id, id));
  }

  async create(
    user: AuthenticatedUser,
    dto: CreateMedicoDto,
  ): Promise<MedicoResponse> {
    const clinic = await this.resolveClinic(user);
    const specialtyIds = await this.validateSpecialties(
      clinic.id,
      dto.specialtyIds,
    );

    try {
      const doctor = await this.prisma.doctor.create({
        data: {
          clinicId: clinic.id,
          name: dto.name.trim(),
          crm: dto.crm.trim().toUpperCase(),
          phone: dto.phone ?? null,
          specialties: { connect: specialtyIds.map((id) => ({ id })) },
        },
        include: medicoInclude,
      });

      return this.toResponse(doctor);
    } catch (error) {
      this.rethrowCrmConflict(error);
      throw error;
    }
  }

  async update(
    user: AuthenticatedUser,
    id: number,
    dto: UpdateMedicoDto,
  ): Promise<MedicoResponse> {
    const clinic = await this.resolveClinic(user);
    await this.findOwned(clinic.id, id);

    const data: Prisma.DoctorUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.crm !== undefined) data.crm = dto.crm.trim().toUpperCase();
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.active !== undefined) data.active = dto.active;
    if (dto.specialtyIds !== undefined) {
      const specialtyIds = await this.validateSpecialties(
        clinic.id,
        dto.specialtyIds,
      );
      data.specialties = { set: specialtyIds.map((sid) => ({ id: sid })) };
    }

    try {
      const doctor = await this.prisma.doctor.update({
        where: { id },
        data,
        include: medicoInclude,
      });

      return this.toResponse(doctor);
    } catch (error) {
      this.rethrowCrmConflict(error);
      if (this.isRecordNotFound(error)) {
        throw new NotFoundException('Médico não encontrado');
      }
      throw error;
    }
  }

  async updateImage(
    user: AuthenticatedUser,
    id: number,
    file: Express.Multer.File | undefined,
  ): Promise<MedicoResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Envie uma imagem no campo "image"');
    }

    if (!detectImageMimeType(file.buffer)) {
      throw new UnsupportedMediaTypeException(
        'A imagem deve estar no formato JPEG, PNG ou WebP',
      );
    }

    const clinic = await this.resolveClinic(user);
    await this.findOwned(clinic.id, id);

    try {
      const doctor = await this.prisma.doctor.update({
        where: { id },
        data: { image: new Uint8Array(file.buffer) },
        include: medicoInclude,
      });

      return this.toResponse(doctor);
    } catch (error) {
      if (this.isRecordNotFound(error)) {
        throw new NotFoundException('Médico não encontrado');
      }
      throw error;
    }
  }

  async listSpecialties(
    user: AuthenticatedUser,
  ): Promise<EspecialidadeComContagemResponse[]> {
    const clinic = await this.resolveClinic(user);

    const specialties = await this.prisma.specialty.findMany({
      where: { clinicId: clinic.id },
      include: { _count: { select: { doctors: true } } },
      orderBy: { name: 'asc' },
    });

    return specialties.map((specialty) => ({
      id: specialty.id,
      name: specialty.name,
      doctorsCount: specialty._count.doctors,
    }));
  }

  async createSpecialty(
    user: AuthenticatedUser,
    dto: CreateEspecialidadeDto,
  ): Promise<EspecialidadeComContagemResponse> {
    const clinic = await this.resolveClinic(user);

    try {
      const specialty = await this.prisma.specialty.create({
        data: { clinicId: clinic.id, name: dto.name.trim() },
      });

      return { id: specialty.id, name: specialty.name, doctorsCount: 0 };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Especialidade já cadastrada');
      }
      throw error;
    }
  }

  async removeSpecialty(user: AuthenticatedUser, id: number): Promise<void> {
    const clinic = await this.resolveClinic(user);

    const specialty = await this.prisma.specialty.findFirst({
      where: { id, clinicId: clinic.id },
      include: { _count: { select: { doctors: true } } },
    });

    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada');
    }

    if (specialty._count.doctors > 0) {
      throw new ConflictException(
        'Não é possível remover uma especialidade em uso por médicos',
      );
    }

    await this.prisma.specialty.delete({ where: { id } });
  }

  private async resolveClinic(user: AuthenticatedUser) {
    const clinic = await this.prisma.clinic.findUnique({
      where: { userId: user.sub },
    });

    if (!clinic) {
      throw new NotFoundException('Clínica não encontrada');
    }

    return clinic;
  }

  private async findOwned(clinicId: number, id: number) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { id, clinicId },
      include: medicoInclude,
    });

    if (!doctor) {
      throw new NotFoundException('Médico não encontrado');
    }

    return doctor;
  }

  private async validateSpecialties(
    clinicId: number,
    specialtyIds: number[],
  ): Promise<number[]> {
    const uniqueIds = [...new Set(specialtyIds)];

    const count = await this.prisma.specialty.count({
      where: { clinicId, id: { in: uniqueIds } },
    });

    if (count !== uniqueIds.length) {
      throw new BadRequestException(
        'Uma ou mais especialidades não pertencem à clínica',
      );
    }

    return uniqueIds;
  }

  private rethrowCrmConflict(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('CRM já cadastrado');
    }
  }

  private isRecordNotFound(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    );
  }

  private toResponse(doctor: MedicoWithSpecialties): MedicoResponse {
    return {
      id: doctor.id,
      name: doctor.name,
      crm: doctor.crm,
      phone: doctor.phone,
      image: this.toDataUri(doctor.image),
      active: doctor.active,
      specialties: doctor.specialties.map(({ id, name }) => ({ id, name })),
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
