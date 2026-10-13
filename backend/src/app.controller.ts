import { Controller, Get } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Aplicação')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Consulta os dados de teste do banco de dados' })
  @ApiOkResponse({
    description: 'Nome do usuário encontrado',
    schema: { type: 'string' },
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async testDataBase(): Promise<string> {
    return await this.appService.testDataBase();
  }
}
