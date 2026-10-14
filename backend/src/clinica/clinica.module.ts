import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ClinicaService } from './clinica.service';
import { ClinicaController } from './clinica.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicaController],
  providers: [ClinicaService],
})
export class ClinicaModule {}
