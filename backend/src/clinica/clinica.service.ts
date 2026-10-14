import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';

@Injectable()
export class ClinicaService {
  constructor(private readonly prisma: PrismaService) { }

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

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
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

    const salt = randomBytes(16).toString('hex');
    const passwordHash = await this.hashPassword(password, salt);

    await this.prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: `scrypt$${salt}$${passwordHash.toString('hex')}`,
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

  private hashPassword(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scryptCallback(password, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      });
    });
  }
}
