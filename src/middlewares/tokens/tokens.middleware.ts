import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { UsersService } from '~app/users/users.service';
import { cookieOptions } from '~app/helpers/constants';
import { UserSerializer } from '~app/serializers/user.serializer';
import modelSerializer from '~app/helpers/model-serializer';

@Injectable()
export class TokensMiddleware implements NestMiddleware {
  private readonly ACCESS_TOKEN_COOKIE_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';

  constructor(private readonly tokensService: TokensService, private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.get('authorization') || req.cookies[this.ACCESS_TOKEN_COOKIE_KEY];
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_KEY];

    if (accessToken) {
      if (accessToken.startsWith('Bearer ')) accessToken = accessToken.slice(7, accessToken.length);
      try {
        const { user } = this.tokensService.decodeAccessToken(accessToken);
        req.user = user;
        return next();
      } catch (err) {
        res.clearCookie(this.ACCESS_TOKEN_COOKIE_KEY, cookieOptions);
      }
    }

    if (refreshToken) {
      try {
        const user = await this.usersService.findByRefreshToken(refreshToken);
        if (!user) {
          res.clearCookie(this.REFRESH_TOKEN_COOKIE_KEY, cookieOptions);
          return next();
        }

        const { expiredAt } = user.oAuth.local;
        if (dayjs() > dayjs(expiredAt)) {
          await this.usersService.deleteRefreshToken(user._id);
          res.clearCookie(this.REFRESH_TOKEN_COOKIE_KEY, cookieOptions);
          return next();
        }

        req.user = modelSerializer(user, UserSerializer);
        res.cookie(
          this.ACCESS_TOKEN_COOKIE_KEY,
          this.tokensService.generateAccessToken({ user: req.user }),
          cookieOptions,
        );

        // extended your refresh token so they do not expire while using your site
        if (dayjs(expiredAt).diff(dayjs(), 'minute') <= 30) {
          await this.usersService.updateRefreshToken(user._id, {
            refreshToken,
            expiredAt: dayjs().add(90, 'minute'),
          });
        }
      } catch (err) {
        res.clearCookie(this.REFRESH_TOKEN_COOKIE_KEY, cookieOptions);
      }
    }

    next();
  }
}
