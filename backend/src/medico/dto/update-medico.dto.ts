import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateMedicoDto } from './create-medico.dto';

export class UpdateMedicoDto extends PartialType(CreateMedicoDto) {
  @ApiPropertyOptional({ example: false, description: 'Desativa ou reativa' })
  @IsOptional()
  @IsBoolean({ message: 'Situação inválida' })
  active?: boolean;
}
