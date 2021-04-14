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
  private readonly REFRESH_TOKEN_SIZE = 22;

  constructor(private readonly configService: ConfigService) {
    this.JWT_SECRET = configService.get<string>('JWT_SECRET');
  }

  generateAccessToken(payload: IJwtPayload, expiresIn?: string): string {
    return jwt.sign(payload, this.JWT_SECRET, { issuer: 'beginner', expiresIn: expiresIn || '1h' });
  }

  decodeAccessToken(token: string): IJwtPayload {
    return jwt.verify(token, this.JWT_SECRET);
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(this.REFRESH_TOKEN_SIZE).toString('hex');
  }
}
