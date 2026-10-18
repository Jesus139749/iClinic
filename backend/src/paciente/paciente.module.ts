import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}
