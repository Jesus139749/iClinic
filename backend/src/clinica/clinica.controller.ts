import {
  Body,
  Controller,
  Get,
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
import { ChangePasswordDto } from '../paciente/dto/change-password.dto';
import { MAX_IMAGE_SIZE_BYTES } from '../paciente/paciente.service';
import { ClinicaService } from './clinica.service';
import { ClinicaResponse } from './dto/clinica-response.interface';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { UpdateClinicaProfileDto } from './dto/update-clinica-profile.dto';

@ApiTags('Clinica')
@Controller('clinica')
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
    description: 'Recurso criado',
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

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Consultar o perfil da clínica autenticada' })
  @ApiOkResponse({ description: 'Dados da clínica e do seu endereço.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  getMine(@Req() request: AuthenticatedRequest): Promise<ClinicaResponse> {
    return this.clinicaService.getMine(request.user);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Atualizar o perfil da clínica autenticada' })
  @ApiBody({ type: UpdateClinicaProfileDto })
  @ApiOkResponse({ description: 'Perfil atualizado.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiConflictResponse({ description: 'O e-mail já está cadastrado.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  updateMine(
    @Req() request: AuthenticatedRequest,
    @Body() updateClinicaProfileDto: UpdateClinicaProfileDto,
  ): Promise<ClinicaResponse> {
    return this.clinicaService.updateMine(
      request.user,
      updateClinicaProfileDto,
    );
  }

  @Put('me/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
  @ApiOperation({ summary: 'Enviar a foto de perfil da clínica autenticada' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: { image: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOkResponse({ description: 'Perfil com a foto atualizada.' })
  @ApiBadRequestResponse({ description: 'Imagem ausente ou acima de 5 MB.' })
  @ApiUnsupportedMediaTypeResponse({
    description: 'Formato diferente de JPEG, PNG ou WebP.',
  })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: MAX_IMAGE_SIZE_BYTES } }),
  )
  updateImage(
    @Req() request: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<ClinicaResponse> {
    return this.clinicaService.updateImage(request.user, file);
  }

  @Put('me/password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLINICA')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar a senha da clínica autenticada' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: 'Senha atualizada.' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou senhas diferentes.',
  })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para clínicas.',
  })
  @ApiNotFoundResponse({ description: 'Clínica não encontrada.' })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou senha atual incorreta.',
  })
  changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.clinicaService.changePassword(request.user, changePasswordDto);
  }
}
