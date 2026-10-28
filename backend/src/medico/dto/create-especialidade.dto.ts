import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEspecialidadeDto {
  @ApiProperty({ example: 'Dermatologia' })
  @IsNotEmpty({ message: 'Nome da especialidade é obrigatório' })
  name!: string;
}
