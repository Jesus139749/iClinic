import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Perfil')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido.' })
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Consultar o perfil do paciente autenticado' })
  @ApiOkResponse({ description: 'Nome, e-mail e telefone do paciente.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para pacientes.',
  })
  @ApiNotFoundResponse({ description: 'Paciente não encontrado.' })
  getMine(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ name: string; email: string; phone: string | null }> {
    return this.profileService.getMine(request.user);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar o perfil do paciente autenticado' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ description: 'Perfil atualizado.' })
  @ApiBadRequestResponse({ description: 'Dados inválidos.' })
  @ApiConflictResponse({ description: 'O e-mail já está cadastrado.' })
  @ApiForbiddenResponse({
    description: 'Acesso permitido somente para pacientes.',
  })
  @ApiNotFoundResponse({ description: 'Paciente não encontrado.' })
  updateMine(
    @Req() request: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<{ name: string; email: string; phone: string | null }> {
    return this.profileService.updateMine(request.user, updateProfileDto);
  }
}
