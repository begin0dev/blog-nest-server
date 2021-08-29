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
import ModelSerializer from '~app/helpers/model-serializer';
import { UserEntity } from '~app/entities/user.entity';

@ApiTags('v1/users')
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
    if (!user) throw new HttpException('잘못된 요청입니다.', HttpStatus.FORBIDDEN);
    const userJSON: ICurrentUser = new ModelSerializer(UserEntity, user).asJSON();
    res.cookie('accessToken', this.tokensService.generateAccessToken({ user: userJSON }), cookieOptions);
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
