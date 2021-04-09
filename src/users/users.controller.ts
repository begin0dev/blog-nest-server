import { Response } from 'express';
import { Controller, Delete, Get, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, ICurrentUser } from '~app/decorators/user.decorator';
import { AuthGuard, authTarget } from '~app/guards/auth.guard';
import { UsersService } from '~app/users/users.service';

@ApiTags('v1/users')
@Controller('v1/users')
export class UsersController {
  private readonly cookieOption = { httpOnly: true };

  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '로그인 정보 가져오기' })
  me(@CurrentUser() currentUser: ICurrentUser): ICurrentUser | null {
    return currentUser;
  }

  @Delete()
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(AuthGuard([authTarget.USER]))
  async delete(
    @CurrentUser() currentUser: ICurrentUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<undefined> {
    const user = await this.usersService.findById(currentUser._id);
    res.clearCookie('accessToken', this.cookieOption);
    res.clearCookie('refreshToken', this.cookieOption);
    return undefined;
  }
}
