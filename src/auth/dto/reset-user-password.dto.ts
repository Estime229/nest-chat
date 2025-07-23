import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetUserPasswordDto {
  @IsNotEmpty()
  @MinLength(6, { message: 'votre mot de pass doit faire 8 caractères' })
  password: string;

  @IsString({ message: 'vous devez fournir un token' })
  token: string;
}
