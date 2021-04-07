import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { TokensService } from '@app/middlewares/tokens/tokens.service';
import { UsersService } from '@app/users/users.service';
import { IUser } from '@app/decorators/user.decorator';

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
        res.clearCookie('accessToken');
      }
    }

    const { refreshToken } = req.cookies;
    if (refreshToken) {
      try {
        const user = await this.usersService.findByRefreshToken(refreshToken);
        if (!user) {
          res.clearCookie('refreshToken');
          return next();
        }

        const { expiredAt } = user.oAuth?.local || {};
        if (dayjs() > dayjs(expiredAt)) {
          await user.updateOne({ $unset: { 'oAuth.local': 1 } });
          res.clearCookie('refreshToken');
          return next();
        }

        req.user = user.toJSON() as IUser;
        accessToken = this.tokensService.generateAccessToken({ user: req.user });
        res.cookie('accessToken', accessToken);

        // extended your refresh token so they do not expire while using your site
        const diffMinute = dayjs(expiredAt).diff(dayjs(), 'minute');
        if (diffMinute <= 30) {
          await user.updateOne({ $set: { 'oAuth.local.expiredAt': dayjs().add(60 + diffMinute, 'minute') } });
        }
      } catch (err) {
        res.clearCookie('refreshToken');
      }
    }

    next();
  }
}
