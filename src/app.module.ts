import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TokensModule } from '~app/middlewares/tokens/tokens.module';
import { UsersModule } from '~app/users/users.module';
import { SocialsModule } from '~app/socials/socials.module';
import { NewrelicInterceptor } from '~app/interceptors/newrelic.interceptor';
import { CommonsController } from './commons/commons.controller';
import { CommonsModule } from './commons/commons.module';

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
    CommonsModule,
  ],
  providers: [
    {
      provide: 'NEWRELIC_INTERCEPTOR',
      useClass: NewrelicInterceptor,
    },
  ],
  controllers: [CommonsController],
})
export class AppModule {}
