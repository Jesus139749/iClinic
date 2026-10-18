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
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacienteService } from './paciente.service';
import { PacienteResponse } from './dto/paciente-response.interface';

@ApiTags('Paciente')
@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) { }

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
  create(@Body() createPacienteDto: CreatePacienteDto): Promise<void> {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PACIENTE')
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
  ): Promise<PacienteResponse> {
    return this.pacienteService.getMine(request.user);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @Roles('PACIENTE')
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
  ): Promise<PacienteResponse> {
    return this.pacienteService.updateMine(request.user, updatePacienteDto);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  @Roles('PACIENTE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar a senha do paciente autenticado' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: 'Senha atualizada.' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou senhas diferentes.',
  })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para pacientes.',
  })
  @ApiNotFoundResponse({ description: 'Paciente não encontrado.' })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou senha atual incorreta.',
  })
  changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.pacienteService.changePassword(request.user, changePasswordDto);
  }
}
