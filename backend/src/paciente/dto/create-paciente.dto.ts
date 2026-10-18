import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class CreatePacienteDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty({ example: 'joao@example.com' })
  @IsEmail({}, { message: 'E-mail deve ser válido' })
  email!: string;

  @ApiProperty({ example: '11987654321', minLength: 11, maxLength: 11 })
  @IsNumberString()
  @Length(11, 11, { message: 'Telefone deve conter 11 dígitos' })
  phone!: string;

  @ApiProperty({
    example: 'SenhaSegura123',
    minLength: 8,
    writeOnly: true,
  })
  @IsString()
  @Length(8, 72, { message: 'Senha deve conter entre 8 e 72 caracteres' })
  password!: string;

  @ApiProperty({ example: 'SenhaSegura123', writeOnly: true })
  @IsString()
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword!: string;
}
