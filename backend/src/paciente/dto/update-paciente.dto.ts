import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdatePacienteDto {
  @ApiPropertyOptional({ example: 'João da Silva' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Nome não pode ficar vazio' })
  name?: string;

  @ApiPropertyOptional({ example: 'joao@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail deve ser válido' })
  email?: string;

  @ApiPropertyOptional({ example: '11987654321', nullable: true })
  @IsOptional()
  @IsNumberString({}, { message: 'Telefone deve conter somente dígitos' })
  @Length(11, 11, { message: 'Telefone deve conter 11 dígitos' })
  phone?: string | null;
}
