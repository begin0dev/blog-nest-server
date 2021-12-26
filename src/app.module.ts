import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensModule } from '~app/middlewares/tokens/tokens.module';
import { UsersModule } from '~app/users/users.module';
import { SocialsModule } from '~app/socials/socials.module';
import { CommonsModule } from './commons/commons.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TokensModule,
    CommonsModule,
    UsersModule,
    SocialsModule,
    PostsModule,
  ],
})
export class AppModule {}
