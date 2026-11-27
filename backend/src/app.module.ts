import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ClinicaModule } from './clinica/clinica.module';
import { AuthModule } from './auth/auth.module';
import { PacienteModule } from './paciente/paciente.module';
import { MedicoModule } from './medico/medico.module';

@Module({
  imports: [
    PrismaModule,
    MedicoModule,
    ClinicaModule,
    AuthModule,
    PacienteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
