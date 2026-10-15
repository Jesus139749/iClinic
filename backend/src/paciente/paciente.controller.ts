import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PacienteService } from './paciente.service';

@ApiTags('Paciente')
@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um paciente' })
  @ApiBody({ type: CreatePacienteDto })
  @ApiCreatedResponse({
    description: 'Paciente cadastrado sem expor dados de autenticação.',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou senhas diferentes.',
  })
  @ApiConflictResponse({ description: 'O e-mail já está cadastrado.' })
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacienteService.create(createPacienteDto);
  }
}
