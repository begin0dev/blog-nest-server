import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { IUserJson } from '@app/schemas/user.schema';
import { User } from '@app/decorators/user.decorator';

@ApiTags('v1/users')
@Controller('v1/users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: '로그인 정보 가져오기' })
  me(@User() user: IUserJson): IUserJson {
    return user;
  }
}
