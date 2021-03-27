import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensService } from '@app/middlewares/tokens/tokens.service';
import { UsersService } from '@app/users/users.service';
import { User, UserSchema } from '@app/schemas/user.schema';
import { TokensMiddleware } from '@app/middlewares/tokens/tokens.middleware';

@Module({
  providers: [TokensService, UsersService],
  exports: [TokensService, UsersService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
export class TokensModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TokensMiddleware).forRoutes('*');
  }
}
