import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

const estadosBrasileiros = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export class CreateClinicaDto {
  @ApiProperty({ example: 'Clínica São Lucas' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name!: string;

  @ApiProperty({ example: '12345678000195', minLength: 14, maxLength: 14 })
  @IsNumberString()
  @Length(14, 14, { message: 'CNPJ deve conter 14 caracteres' })
  cnpj!: string;

  @ApiProperty({ example: 'contato@clinica.com.br' })
  @IsEmail({}, { message: 'E-mail deve ser válido' })
  email!: string;

  @ApiProperty({ example: '11987654321', minLength: 11, maxLength: 11 })
  @IsNumberString()
  @Length(11, 11, { message: 'Telefone deve conter 11 dígitos' })
  phone!: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsNotEmpty({ message: 'Logradouro é obrigatório' })
  street!: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  number!: string;

  @ApiPropertyOptional({ example: 'Sala 4' })
  @IsOptional()
  complement?: string;

  @ApiProperty({ example: 'Centro' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  neighborhood!: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  city!: string;

  @ApiProperty({ example: 'SP', enum: estadosBrasileiros })
  @IsIn(estadosBrasileiros, {
    message: 'Estado deve ser uma UF brasileira válida',
  })
  state!: string;

  @ApiProperty({ example: '01001000', minLength: 8, maxLength: 8 })
  @IsNumberString()
  @Length(8, 8, { message: 'CEP deve conter 8 dígitos' })
  postalCode!: string;

  @ApiProperty({ example: 'SenhaSegura123', writeOnly: true })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;

  @ApiProperty({ example: 'SenhaSegura123', writeOnly: true })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword!: string;
}
