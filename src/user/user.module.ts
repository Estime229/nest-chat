import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { AwsS3Service } from 'src/aws/aws-s3.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AwsS3Service],
})
export class UserModule {}
