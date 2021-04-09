import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from '~app/users/users.controller';
import { UsersService } from '~app/users/users.service';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { User, UserSchema } from '~app/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, TokensService],
  controllers: [UsersController],
})
export class UsersModule {}
