import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { IUserJson } from '@app/schemas/user.schema';

const refreshTokenSize = 24;

export interface IJwtPayload {
  user: IUserJson;
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
