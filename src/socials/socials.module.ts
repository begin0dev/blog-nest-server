import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SocialsController } from '@app/socials/socials.controller';
import { OAuthModule } from '@app/o-auth-module/o-auth.module';
import { oAuthNames } from '@app/o-auth-module/o-auth.types';

@Module({
  imports: [
    ConfigModule.forRoot(),
    OAuthModule.register([
      {
        name: oAuthNames.FACEBOOK,
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackUrl: '/api/v1/socials/facebook/callback',
      },
    ]),
  ],
  controllers: [SocialsController],
})
export class SocialsModule {}
