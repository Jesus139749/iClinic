import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MAX_IMAGE_SIZE_BYTES } from '../paciente/paciente.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { MedicoResponse } from './dto/medico-response.interface';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { MedicoService } from './medico.service';

@ApiTags('Medico')
@Controller('clinica/medicos')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Listar os médicos da clínica autenticada' })
  @ApiOkResponse({ description: 'Médicos com suas especialidades.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  list(@Req() request: AuthenticatedRequest): Promise<MedicoResponse[]> {
    return this.medicoService.list(request.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Consultar um médico da clínica autenticada' })
  @ApiOkResponse({ description: 'Dados do médico.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica ou médico não encontrado.' })
  get(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MedicoResponse> {
    return this.medicoService.get(request.user, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Cadastrar um médico na clínica autenticada' })
  @ApiBody({ type: CreateMedicoDto })
  @ApiCreatedResponse({ description: 'Médico cadastrado.' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou especialidade de outra clínica.',
  })
  @ApiConflictResponse({ description: 'O CRM já está cadastrado.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createMedicoDto: CreateMedicoDto,
  ): Promise<MedicoResponse> {
    return this.medicoService.create(request.user, createMedicoDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({
    summary: 'Atualizar, desativar ou reativar um médico',
    description: 'Envie `active: false` para desativar e `true` para reativar.',
  })
  @ApiBody({ type: UpdateMedicoDto })
  @ApiOkResponse({ description: 'Médico atualizado.' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou especialidade de outra clínica.',
  })
  @ApiConflictResponse({ description: 'O CRM já está cadastrado.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica ou médico não encontrado.' })
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicoDto: UpdateMedicoDto,
  ): Promise<MedicoResponse> {
    return this.medicoService.update(request.user, id, updateMedicoDto);
  }

  @Put(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Enviar a foto de um médico' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: { image: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOkResponse({ description: 'Médico com a foto atualizada.' })
  @ApiBadRequestResponse({ description: 'Imagem ausente ou acima de 5 MB.' })
  @ApiUnsupportedMediaTypeResponse({
    description: 'Formato diferente de JPEG, PNG ou WebP.',
  })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica ou médico não encontrado.' })
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: MAX_IMAGE_SIZE_BYTES } }),
  )
  updateImage(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<MedicoResponse> {
    return this.medicoService.updateImage(request.user, id, file);
  }
}
