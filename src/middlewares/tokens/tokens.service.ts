import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { ICurrentUser } from '~app/decorators/user.decorator';

export interface IJwtPayload {
  user: ICurrentUser;
}

@Injectable()
export class TokensService {
  private readonly REFRESH_TOKEN_SIZE = 22;

  generateAccessToken(payload: IJwtPayload, expiresIn?: string): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { issuer: 'beginner', expiresIn: expiresIn || '1h' });
  }

  decodeAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(this.REFRESH_TOKEN_SIZE).toString('hex');
  }
}
