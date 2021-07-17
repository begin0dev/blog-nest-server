import { Response } from 'express';
import {
  Delete,
  Get,
  Res,
  Param,
  UseGuards,
  Controller,
  HttpException,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, ICurrentUser } from '~app/decorators/user.decorator';
import { AuthGuard, authTarget } from '~app/guards/auth.guard';
import { UsersService } from '~app/users/users.service';
import { cookieOptions } from '~app/helpers/base';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { JsendReturnType } from '~app/types/base.types';

@ApiTags('v1/users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly tokensService: TokensService) {}

  @Get('verify/:code')
  @ApiOperation({ summary: '로그인 정보 인증' })
  async verify(
    @Param('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JsendReturnType<ICurrentUser>> {
    const user = await this.usersService.findByVerifyCode(code);
    if (!user) throw new HttpException('잘못된 요청입니다.', HttpStatus.FORBIDDEN);
    res.cookie(
      'accessToken',
      this.tokensService.generateAccessToken({ user: user.toJSON() as ICurrentUser }),
      cookieOptions,
    );
    res.cookie('refreshToken', user.oAuth.local.refreshToken, cookieOptions);
    return { payload: (user.toJSON() as ICurrentUser) || null };
  }

  @Get('me')
  @Header('content-type', 'application/json')
  @ApiOperation({ summary: '로그인 정보 가져오기' })
  me(@CurrentUser() currentUser: ICurrentUser | null): JsendReturnType<ICurrentUser | null> {
    return { payload: currentUser || null };
  }

  @Delete()
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(AuthGuard(authTarget.USER))
  delete(@CurrentUser() currentUser: ICurrentUser, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return this.usersService.deleteRefreshToken(currentUser._id);
  }
}
