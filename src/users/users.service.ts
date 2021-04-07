import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';

import { TUserDocument, User } from '@app/schemas/user.schema';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { TokensService } from '@app/middlewares/tokens/tokens.service';
import { TOAuthProvider } from '@app/o-auth-module/o-auth.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly tokensService: TokensService,
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
  ) {}

  async create(userDto: CreateUserDto): Promise<TUserDocument> {
    const user = new this.userModel(userDto);
    user.isAdmin = false;
    user.oAuth.local = {
      refreshToken: this.tokensService.generateRefreshToken(),
      expiredAt: dayjs().add(12, 'hour'),
    };
    return user.save();
  }

  async findBySocialId(provider: TOAuthProvider, id: string): Promise<TUserDocument | null> {
    return this.userModel.findOne({ [`oAuth.${provider}.id`]: id });
  }

  async findByRefreshToken(refreshToken: string): Promise<TUserDocument | null> {
    return this.userModel.findOne({ 'oAuth.local.refreshToken': refreshToken });
  }
}
