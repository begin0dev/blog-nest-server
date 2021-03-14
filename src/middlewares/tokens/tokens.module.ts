import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensService } from '@app/middlewares/tokens/tokens.service';
import { UsersService } from '@app/users/users.service';
import { User, UserSchema } from '@app/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [TokensService, UsersService],
  exports: [TokensService, UsersService],
})
export class TokensModule {}
