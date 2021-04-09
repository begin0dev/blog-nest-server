import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensModule } from '~app/middlewares/tokens/tokens.module';
import { UsersModule } from '~app/users/users.module';
import { SocialsModule } from '~app/socials/socials.module';

@Global()
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
    SocialsModule,
  ],
})
export class AppModule {}
