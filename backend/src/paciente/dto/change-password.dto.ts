import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'SenhaAtual123', writeOnly: true })
  @IsString()
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  currentPassword!: string;

  @ApiProperty({
    example: 'NovaSenha123',
    minLength: 8,
    maxLength: 72,
    writeOnly: true,
  })
  @IsString()
  @Length(8, 72, { message: 'Senha deve conter entre 8 e 72 caracteres' })
  newPassword!: string;

  @ApiProperty({ example: 'NovaSenha123', writeOnly: true })
  @IsString()
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  confirmPassword!: string;
}
