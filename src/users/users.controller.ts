import { Controller } from '@nestjs/common';

import { UsersService } from '@app/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
}
