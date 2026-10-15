import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPacienteDto: CreatePacienteDto) {
    const { name, email, phone, password, confirmPassword } = createPacienteDto;
    const normalizedEmail = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não conferem');
    }

    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new BadRequestException('Senha não pode exceder 72 bytes em UTF-8');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await hash(password, 12);

    try {
      return await this.prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          phone,
          type: 'PACIENTE',
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          type: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado');
      }

      throw error;
    }
  }
}
