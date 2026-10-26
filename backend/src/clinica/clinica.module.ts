import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ClinicaService } from './clinica.service';
import { ClinicaController } from './clinica.controller';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ClinicaController],
  providers: [ClinicaService],
})
export class ClinicaModule {}
