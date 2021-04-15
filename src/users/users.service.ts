import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TUserDocument, User } from '~app/schemas/user.schema';
import { CreateUserDto } from '~app/users/dto/create-user.dto';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { TOAuthProvider } from '~app/helpers/o-auth-module/o-auth.types';

@Injectable()
export class UsersService {
  constructor(
    private readonly tokensService: TokensService,
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
  ) {}

  create(userDto: CreateUserDto) {
    const user = new this.userModel(userDto);
    user.isAdmin = false;
    user.oAuth.local = {
      refreshToken: this.tokensService.generateRefreshToken(),
      expiredAt: dayjs().add(12, 'hour'),
    };
    return user.save();
  }

  findById(_id: string) {
    return this.userModel.findOne({ _id });
  }

  findBySocialId(provider: TOAuthProvider, id: string) {
    return this.userModel.findOne({ [`oAuth.${provider}.id`]: id });
  }

  findByRefreshToken(refreshToken: string) {
    return this.userModel.findOne({ 'oAuth.local.refreshToken': refreshToken });
  }

  updateRefreshToken(_id: string, local: { refreshToken: string; expiredAt: Dayjs | Date }) {
    return this.userModel.updateOne({ _id }, { $set: { 'oAuth.local': local } });
  }

  deleteRefreshToken(_id: string) {
    return this.userModel.updateOne({ _id }, { $unset: { 'oAuth.local': 1 } });
  }
}
