import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensService } from '~app/tokens/tokens.service';
import { UsersService } from '~app/users/users.service';
import { User, UserSchema } from '~app/schemas/user.schema';
import { TokensMiddleware } from '~app/tokens/tokens.middleware';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [ConfigService, TokensService, UsersService],
  exports: [TokensService, UsersService],
})
export class TokensModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TokensMiddleware).forRoutes('*');
  }
}
