import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { MailerService } from 'src/mailer.service';
import { AwsS3Service } from 'src/aws/aws-s3.service';
// import { JwtStrategy } from './jwtStrategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtModule,
    JwtStrategy,
    UserService,
    MailerService,
    AwsS3Service,
  ],
})
export class AuthModule {}
