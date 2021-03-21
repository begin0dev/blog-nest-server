import * as dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

import { TokensService } from '@app/middlewares/tokens/tokens.service';
import { UsersService } from '@app/users/users.service';
import { IUserJson } from '@app/schemas/user.schema';

@Injectable()
export class TokensMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokensService, private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.get('authorization') || req.cookies.accessToken;
    if (accessToken) {
      if (accessToken.startsWith('Bearer ')) accessToken = accessToken.slice(7, accessToken.length);
      try {
        const { user } = this.tokenService.decodeAccessToken(accessToken);
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

        const { expiredAt } = user?.oAuth?.local || {};
        if (dayjs() > dayjs(expiredAt)) {
          await user.updateOne({ $unset: { 'oAuth.local': 1 } });
          res.clearCookie('refreshToken');
          return next();
        }

        req.user = user.toJSON() as IUserJson;
        accessToken = this.tokenService.generateAccessToken({ user: req.user });
        res.cookie('accessToken', accessToken);

        // extended your refresh token so they do not expire while using your site
        if (dayjs(expiredAt).diff(dayjs(), 'minute') <= 10) {
          await user.updateOne({ $set: { 'oAuth.local.expiredAt': dayjs().add(1, 'hour') } });
        }
      } catch (err) {
        res.clearCookie('refreshToken');
      }
    }

    next();
  }
}
