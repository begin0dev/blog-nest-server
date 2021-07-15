import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { UsersService } from '~app/users/users.service';
import { ICurrentUser } from '~app/decorators/user.decorator';
import { cookieOptions } from '~app/helpers/base';

@Injectable()
export class TokensMiddleware implements NestMiddleware {
  constructor(private readonly tokensService: TokensService, private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.get('authorization') || req.cookies.accessToken;
    if (accessToken) {
      if (accessToken.startsWith('Bearer ')) accessToken = accessToken.slice(7, accessToken.length);
      try {
        const { user } = this.tokensService.decodeAccessToken(accessToken);
        req.user = user;
        return next();
      } catch (err) {
        res.clearCookie('accessToken', cookieOptions);
      }
    }

    const { refreshToken } = req.cookies;
    if (refreshToken) {
      try {
        const user = await this.usersService.findByRefreshToken(refreshToken);
        if (!user) {
          res.clearCookie('refreshToken', cookieOptions);
          return next();
        }

        const { expiredAt } = user.oAuth?.local || {};
        if (dayjs() > dayjs(expiredAt)) {
          await user.updateOne({ $unset: { 'oAuth.local': 1 } });
          res.clearCookie('refreshToken', cookieOptions);
          return next();
        }

        req.user = user.toJSON() as ICurrentUser;
        accessToken = this.tokensService.generateAccessToken({ user: req.user });
        res.cookie('accessToken', accessToken, cookieOptions);

        // extended your refresh token so they do not expire while using your site
        const diffMinute = dayjs(expiredAt).diff(dayjs(), 'minute');
        if (diffMinute <= 30) {
          await this.usersService.updateRefreshToken(user._id, {
            refreshToken,
            expiredAt: dayjs().add(60 + diffMinute, 'minute'),
          });
        }
      } catch (err) {
        res.clearCookie('refreshToken', cookieOptions);
      }
    }

    next();
  }
}
