import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/log-user.dto';
// import passport from 'passport';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';

// @UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  // localhost/3000/auth/login
  // 1 envoie un mdp et un email
  // l'api te renvoie un token securise ("abc123")
  @Post('login')
  async login(@Body() authBody: LogUserDto) {
    // console.log({ authBody });
    return await this.authService.login({
      authBody,
    });
  }
  // 3  Tu renvoie ton token securise
  // localhost/3000/auth/
  //ici nous voulons utiliser jwt
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAuthenticatedUser(@Request() request: RequestWithUser) {
    // console.log(request.user.userId);
    //4 jointure entre abcd123 =>"abcd"
    return await this.userService.getUser({
      userId: request.user.userId,
    });
  }

  // register user
  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    // console.log({ authBody });
    return await this.authService.register({
      registerBody,
    });
  }

  // request reset password user
  @Post('request-reset-password')
  async requestResetPassword(@Body('email') email: string) {
    return await this.authService.resetUserPasswordRequest({
      email,
    });
  }

  //  reset password user
  @Post('reset-password')
  async resetUserPassword(@Body() resetPasswordDto: ResetUserPasswordDto) {
    return await this.authService.resetUserPassword({
      resetPasswordDto,
    });
  }

  // verifie reset password token
  @Get('verify-reset-password-token')
  async verifyResetPasswordToken(@Query('token') token: string) {
    return await this.authService.verifyResetPasswordToken({
      token,
    });
  }
}
