import { Controller, Get, Param } from '@nestjs/common';
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
}
