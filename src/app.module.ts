import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
