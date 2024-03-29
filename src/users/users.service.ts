import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TUserDocument, User } from '~app/schemas/user.schema';
import { CreateUserDto } from '~app/users/dto/create-user.dto';
import { TokensService } from '~app/tokens/tokens.service';
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

  async createVerifyCode(_id: string): Promise<string> {
    const verifyCode = this.tokensService.generateVerifyCode();
    await this.userModel.updateOne(
      { _id },
      {
        $set: {
          'oAuth.local.verifyCode': verifyCode,
          'oAuth.local.verifyCodeSendAt': dayjs(),
        },
      },
    );
    return verifyCode;
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

  async findByVerifyCode(verifyCode: string) {
    const user = await this.userModel.findOne({ 'oAuth.local.verifyCode': verifyCode });
    if (!user) throw new HttpException('잘못된 요청입니다.', HttpStatus.FORBIDDEN);

    await this.userModel.updateOne(
      { _id: user._id },
      { $unset: { 'oAuth.local.verifyCode': '', 'oAuth.local.verifyCodeSendAt': '' } },
    );
    if (dayjs().diff(dayjs(user.oAuth.local.verifyCodeSendAt), 'minute') > 2) return null;
    return user;
  }

  updateRefreshToken(_id: string, local: { refreshToken: string; expiredAt?: Dayjs | Date }) {
    return this.userModel.updateOne(
      { _id },
      {
        $set: {
          'oAuth.local.refreshToken': local.refreshToken,
          'oAuth.local.expiredAt': local.expiredAt ?? dayjs().add(12, 'hour'),
        },
      },
    );
  }

  deleteRefreshToken(_id: string) {
    return this.userModel.updateOne(
      { _id },
      { $unset: { 'oAuth.local.refreshToken': '', 'oAuth.local.expiredAt': '' } },
    );
  }
}
