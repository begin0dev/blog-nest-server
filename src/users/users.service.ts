import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TUserDocument, User } from '@app/schemas/user.schema';
import { TSocialProvider, CreateUserDto } from '@app/users/dto/create_user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<TUserDocument>) {}

  async create(userDto: CreateUserDto): Promise<TUserDocument> {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async findByRefreshToken(refreshToken: string): Promise<TUserDocument> {
    return this.userModel.findOne({ 'oAuth.local.refreshToken': refreshToken });
  }
}
