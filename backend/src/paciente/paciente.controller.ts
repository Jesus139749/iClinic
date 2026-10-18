import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Consultar o perfil do paciente autenticado' })
  @ApiOkResponse({ description: 'Nome, e-mail e telefone do paciente.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para pacientes.',
  })
  @ApiNotFoundResponse({ description: 'Paciente não encontrado.' })
  getMine(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ name: string; email: string; phone: string | null }> {
    return this.pacienteService.getMine(request.user);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Atualizar o perfil do paciente autenticado' })
  @ApiBody({ type: UpdatePacienteDto })
  @ApiOkResponse({ description: 'Perfil atualizado.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiConflictResponse({ description: 'O e-mail já está cadastrado.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para pacientes.',
  })
  @ApiNotFoundResponse({ description: 'Paciente não encontrado.' })
  updateMine(
    @Req() request: AuthenticatedRequest,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ): Promise<{ name: string; email: string; phone: string | null }> {
    return this.pacienteService.updateMine(request.user, updatePacienteDto);
  }
}
