import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TUserDocument, User } from '@app/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<TUserDocument>) {}

  async findByRefreshToken(refreshToken: string): Promise<TUserDocument> {
    return this.userModel.findOne({ 'oAuth.local.refreshToken': refreshToken });
  }
}
