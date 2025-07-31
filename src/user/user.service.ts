import { Injectable } from '@nestjs/common';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { fileSchema } from 'src/file-utils';
import { PrismaService } from 'src/prisma.service';
import z from 'zod';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
      },
    });
    return users;
  }
  // get unique user
  async getUser({ userId }: { userId: string }) {
    const users = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return users;
  }

  // update user
  async updateUser({
    userId,
    submittedFile,
  }: {
    userId: string;
    submittedFile: z.infer<typeof fileSchema>;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        avatarFilekey: true,
      },
    });
    if (!existingUser) {
      throw new Error('User not found');
    }

    const { fileKey } = await this.awsS3Service.uploadFile({
      file: submittedFile,
    });
    const users = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarFilekey: fileKey,
      },
    });
    if (existingUser.avatarFilekey) {
      await this.awsS3Service.deleteFile({
        fileKey: existingUser.avatarFilekey,
      });
    }
    return users;
  }
}
