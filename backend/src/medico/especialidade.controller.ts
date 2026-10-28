import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
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
  ApiNoContentResponse,
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
import { CreateEspecialidadeDto } from './dto/create-especialidade.dto';
import { EspecialidadeComContagemResponse } from './dto/medico-response.interface';
import { MedicoService } from './medico.service';

@ApiTags('Especialidade')
@Controller('clinica/especialidades')
export class EspecialidadeController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Listar as especialidades da clínica' })
  @ApiOkResponse({ description: 'Especialidades com a contagem de médicos.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  list(
    @Req() request: AuthenticatedRequest,
  ): Promise<EspecialidadeComContagemResponse[]> {
    return this.medicoService.listSpecialties(request.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Cadastrar uma especialidade na clínica' })
  @ApiBody({ type: CreateEspecialidadeDto })
  @ApiCreatedResponse({ description: 'Especialidade cadastrada.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiConflictResponse({ description: 'A especialidade já está cadastrada.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createEspecialidadeDto: CreateEspecialidadeDto,
  ): Promise<EspecialidadeComContagemResponse> {
    return this.medicoService.createSpecialty(
      request.user,
      createEspecialidadeDto,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Remover uma especialidade sem médicos vinculados' })
  @ApiNoContentResponse({ description: 'Especialidade removida.' })
  @ApiConflictResponse({ description: 'A especialidade está em uso.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({
    description: 'Clínica ou especialidade não encontrada.',
  })
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.medicoService.removeSpecialty(request.user, id);
  }
}
