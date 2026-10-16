import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'João da Silva' })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'Nome não pode ficar vazio' })
  name?: string;

  @ApiPropertyOptional({ example: 'joao@example.com' })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsEmail({}, { message: 'E-mail deve ser válido' })
  email?: string;

  @ApiPropertyOptional({ example: '11987654321', nullable: true })
  @ValidateIf(
    (_object, value: unknown) => value !== undefined && value !== null,
  )
  @IsNumberString({}, { message: 'Telefone deve conter somente dígitos' })
  @Length(11, 11, { message: 'Telefone deve conter 11 dígitos' })
  phone?: string | null;
}
