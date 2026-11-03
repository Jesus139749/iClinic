import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchClinicaQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra por nome da clínica ou especialidade.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
