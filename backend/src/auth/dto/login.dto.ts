import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'contato@clinica.com.br' })
    @IsNotEmpty({ message: 'E-mail é obrigatório' })
    @IsEmail({}, { message: 'E-mail inválido' })
    email!: string;

    @ApiProperty({ example: 'SenhaSegura123' })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    password!: string;
}
