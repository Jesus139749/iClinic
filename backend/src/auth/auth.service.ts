import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.trim().toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    if (!(await compare(loginDto.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      type: user.type,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
