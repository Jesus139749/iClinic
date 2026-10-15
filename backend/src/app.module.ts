import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ClinicaModule } from './clinica/clinica.module';
import { AuthModule } from './auth/auth.module';
import { PacienteModule } from './paciente/paciente.module';

@Module({
  imports: [PrismaModule, ClinicaModule, AuthModule, PacienteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
