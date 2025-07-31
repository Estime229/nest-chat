import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/jwt.strategy';
import { fileSchema } from 'src/file-utils';
import { UserService } from 'src/user/user.service';

@Controller('users')
export class UserController {
  // localhost:3000/users/settings
  constructor(private readonly userService: UserService) {}
  @Get('')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser({
      userId,
    });
  }

  // update user
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('')
  async updateUser(
    @Req() requestWithUser: RequestWithUser,
    @Body() updatedUserData: unknown,
    @UploadedFile() file,
  ) {
    const submittedFile = fileSchema.parse(file);
    // console.log({ submittedFile });
    return this.userService.updateUser({
      userId: requestWithUser.user.userId,
      submittedFile,
    });
  }
}
