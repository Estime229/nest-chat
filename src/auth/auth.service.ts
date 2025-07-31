import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
import { MailerService } from 'src/mailer.service';
import { createId } from '@paralleldrive/cuid2';
import { error } from 'console';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}
  async login({ authBody }: { authBody: LogUserDto }) {
    const { email, password } = authBody;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: authBody.email,
      },
    });
    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas");
    }

    //   verfification supplementaire
    const isPasswordValid = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new Error('Le mot de passe est erroné');
    }
    return this.authenticateUser({
      userId: existingUser.id,
    });
  }

  //   script hash password
  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
  }

  //   compare if userPassword === hashedPassword
  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }

  //   authentification jwt
  private async authenticateUser({ userId }: UserPayload) {
    const payload: UserPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // register user
  async register({ registerBody }: { registerBody: CreateUserDto }) {
    try {
      const { email, firstName, password } = registerBody;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        throw new Error(
          "L'utilisateur a déjà un compte a cette addresse email",
        );
      }

      const hashedPassword = await this.hashPassword({ password });

      const CreateUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
        },
      });

      await this.mailerService.sendEmail({
        firstName,
        recipient: email,
      });

      return this.authenticateUser({
        userId: CreateUser.id,
      });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  //resetUserPasswordequest
  async resetUserPasswordRequest({ email }: { email: string }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (existingUser.isResettingPassword == true) {
        throw new Error('Une demande de réinitialisation est déjà en cours');
      }

      const createdId = createId();
      await this.prisma.user.update({
        where: {
          email,
        },
        data: {
          isResettingPassword: true,
          resetPasswordToken: createdId,
        },
      });

      await this.mailerService.sendCreatedAccountEmail({
        firstName: existingUser.firstName,
        recipient: existingUser.email,
        token: createdId,
      });
      return {
        error: false,
        message: 'Un email de réinitialisation a été envoyé',
      };
      // return this.authenticateUser({
      //   userId: existingUser.id,
      // });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  //verifyResetPasswordToken

  async verifyResetPasswordToken({ token }: { token: string }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          resetPasswordToken: token,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (existingUser.isResettingPassword == false) {
        throw new Error("Aucune demande de réinitialisation n'est en cours");
      }

      return {
        error: false,
        message: 'Le token est valide et peut etre utilisé',
      };
      // return this.authenticateUser({
      //   userId: existingUser.id,
      // });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  //reset password
  async resetUserPassword({
    resetPasswordDto,
  }: {
    resetPasswordDto: ResetUserPasswordDto;
  }) {
    try {
      const { password, token } = resetPasswordDto;
      const existingUser = await this.prisma.user.findUnique({
        where: {
          resetPasswordToken: token,
        },
      });

      if (!existingUser) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (existingUser.isResettingPassword == false) {
        throw new Error("Aucune demande de réinitialisation n'est en cours");
      }

      const hashedPassword = await this.hashPassword({ password });
      await this.prisma.user.update({
        where: {
          resetPasswordToken: token,
        },
        data: {
          isResettingPassword: false,
          password: hashedPassword,
        },
      });
      return {
        error: false,
        message: 'Votre mot de passe a bien ete renitialisé',
      };
      // return this.authenticateUser({
      //   userId: existingUser.id,
      // });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
