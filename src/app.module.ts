import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensMiddleware } from '@app/middlewares/tokens/tokens.middleware';
import { TokensModule } from '@app/middlewares/tokens/tokens.module';
import { UsersController } from '@app/users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PWD,
      dbName: process.env.MONGO_DB_NAME,
      useCreateIndex: true,
    }),
    TokensModule,
    UsersModule,
  ],
  controllers: [UsersController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TokensMiddleware).forRoutes('*');
  }
}
