import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, IUser } from '@app/decorators/user.decorator';

@ApiTags('v1/users')
@Controller('v1/users')
export class UsersController {
  @Get('me')
  @ApiOperation({ summary: '로그인 정보 가져오기' })
  me(@CurrentUser() user: IUser): IUser | null {
    return user;
  }
}
