import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
@ApiTags('Aplicação')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consulta os dados de teste do banco de dados' })
  @ApiOkResponse({
    description: 'Nome do usuário encontrado',
    schema: { type: 'string' },
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente, inválido ou expirado',
  })
  async testDataBase(): Promise<string> {
    return await this.appService.testDataBase();
  }
}
