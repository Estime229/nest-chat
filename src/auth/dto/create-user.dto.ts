import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'vous devez fournir un email valide' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'votre mot de pass doit faire 8 caractères' })
  password: string;

  @IsString({ message: 'vous devez fournir un prenom' })
  firstName: string;
}
