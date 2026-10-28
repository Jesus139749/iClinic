import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EspecialidadeController } from './especialidade.controller';
import { MedicoController } from './medico.controller';
import { MedicoService } from './medico.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [MedicoController, EspecialidadeController],
  providers: [MedicoService],
})
export class MedicoModule {}
