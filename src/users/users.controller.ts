import { Response } from 'express';
import { Delete, Get, Res, Param, UseGuards, Controller, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser, ICurrentUser } from '~app/decorators/user.decorator';
import { AuthGuard, authTarget } from '~app/guards/auth.guard';
import { UsersService } from '~app/users/users.service';
import { cookieOptions } from '~app/helpers/constants';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { JsendReturnType } from '~app/types/jsend.types';
import { UserSerializer } from '~app/serializers/user.serializer';
import modelSerializer from '~app/helpers/model-serializer';

@ApiTags('users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly tokensService: TokensService) {}

  @Get('me')
  @Header('content-type', 'application/json')
  @ApiOperation({ summary: '로그인 정보 가져오기' })
  me(@CurrentUser() currentUser: ICurrentUser | null): JsendReturnType<ICurrentUser | null> {
    return { payload: currentUser || null };
  }

  @Get('verify/:code')
  @ApiOperation({ summary: '로그인 정보 인증' })
  async verify(
    @Param('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JsendReturnType<ICurrentUser>> {
    const user = await this.usersService.findByVerifyCode(code);
    const userJSON = modelSerializer(user, UserSerializer);
    const accessToken = this.tokensService.generateAccessToken({ user: userJSON });
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', user.oAuth.local.refreshToken, cookieOptions);
    return { payload: userJSON };
  }

  @Delete()
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(AuthGuard(authTarget.USER))
  async delete(
    @CurrentUser() currentUser: ICurrentUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JsendReturnType<null>> {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    await this.usersService.deleteRefreshToken(currentUser._id);
    return { payload: null };
  }
}
