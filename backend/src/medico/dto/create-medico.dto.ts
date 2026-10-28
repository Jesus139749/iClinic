import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateMedicoDto {
  @ApiProperty({ example: 'Dra. Camila Ferreira' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty({ example: '123456SP' })
  @IsNotEmpty({ message: 'CRM é obrigatório' })
  crm!: string;

  @ApiPropertyOptional({ example: '11987654321' })
  @IsOptional()
  @IsNumberString()
  @Length(11, 11, { message: 'Telefone deve conter 11 dígitos' })
  phone?: string;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs de especialidades cadastradas na própria clínica',
  })
  @IsArray({ message: 'Especialidades devem ser uma lista' })
  @ArrayMinSize(1, { message: 'Selecione ao menos uma especialidade' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Especialidade inválida' })
  specialtyIds!: number[];
}
