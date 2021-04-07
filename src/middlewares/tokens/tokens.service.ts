import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

import { IUser } from '@app/decorators/user.decorator';

const refreshTokenSize = 24;

export interface IJwtPayload {
  user: IUser;
}

@Injectable()
export class TokensService {
  generateAccessToken(payload: IJwtPayload, expiresIn?: string): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { issuer: 'beginner', expiresIn: expiresIn || '1h' });
  }

  decodeAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(refreshTokenSize).toString('hex');
  }
}
