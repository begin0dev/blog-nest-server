import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { ICurrentUser } from '~app/decorators/user.decorator';

export interface IJwtPayload {
  user: ICurrentUser;
}

@Injectable()
export class TokensService {
  private readonly JWT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.JWT_SECRET = configService.get<string>('JWT_SECRET');
  }

  generateAccessToken(payload: IJwtPayload, expiresIn?: string): string {
    return jwt.sign(payload, this.JWT_SECRET, { issuer: 'beginner', expiresIn: expiresIn || '1h' });
  }

  decodeAccessToken(token: string) {
    return jwt.verify(token, this.JWT_SECRET) as IJwtPayload;
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(12).toString('hex');
  }

  generateVerifyCode(): string {
    return crypto.randomBytes(8).toString('hex');
  }
}
