import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LogUserDto {
  @IsEmail({}, { message: 'vous devez fournir un email valide' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'votre mot de pass doit faire 8 caractères' })
  password: string;
}
