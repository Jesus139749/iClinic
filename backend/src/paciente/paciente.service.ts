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

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = createPacienteDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('As senhas não conferem');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail }
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
}
