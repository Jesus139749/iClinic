import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthenticatedUser {
  sub: number;
  role: 'PACIENTE' | 'CLINICA';
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const [scheme, token, ...extraParts] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token || extraParts.length > 0) {
      throw new UnauthorizedException('Token JWT ausente ou inválido');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<Record<string, unknown>>(token);
      if (
        typeof payload.sub !== 'number' ||
        !Number.isInteger(payload.sub) ||
        payload.sub <= 0 ||
        (payload.role !== 'PACIENTE' && payload.role !== 'CLINICA')
      ) {
        throw new UnauthorizedException('Token JWT inválido');
      }

      request.user = {
        sub: payload.sub,
        role: payload.role,
      };
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token JWT inválido ou expirado');
    }
  }
}
