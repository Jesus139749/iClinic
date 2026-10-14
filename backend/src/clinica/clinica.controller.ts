import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ClinicaService } from './clinica.service';
import { CreateClinicaDto } from './dto/create-clinica.dto';

@Controller('clinica')
@ApiTags('Clínicas')
export class ClinicaController {
  constructor(private readonly clinicaService: ClinicaService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar uma clínica',
    description:
      'Cria a conta da clínica e seu endereço. CNPJ e CEP devem ser enviados somente com dígitos.',
  })
  @ApiBody({ type: CreateClinicaDto })
  @ApiCreatedResponse({
    description: 'Recurso criado'
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou campos obrigatórios ausentes.',
  })
  @ApiConflictResponse({
    description: 'O e-mail ou CNPJ já está cadastrado.',
  })
  create(@Body() createClinicaDto: CreateClinicaDto) {
    return this.clinicaService.create(createClinicaDto);
  }
}
