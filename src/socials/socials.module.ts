import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SocialsController } from '@app/socials/socials.controller';
import { OAuthModule } from '@app/o-auth-module/o-auth.module';
import { oAuthProviders, TOAuthProvider } from '@app/o-auth-module/o-auth.types';
import { UsersService } from '@app/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/schemas/user.schema';
import { TokensService } from '@app/middlewares/tokens/tokens.service';

const callbackUrl = (provider: TOAuthProvider) => `/api/v1/socials/${provider}/callback`;

@Module({
  imports: [
    ConfigModule.forRoot(),
    OAuthModule.register([
      {
        provider: oAuthProviders.FACEBOOK,
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackUrl: callbackUrl(oAuthProviders.FACEBOOK),
        // options: { auth_type: 'reauthenticate' },
      },
      {
        provider: oAuthProviders.KAKAO,
        clientId: process.env.KAKAO_APP_ID,
        clientSecret: process.env.KAKAO_APP_SECRET,
        callbackUrl: callbackUrl(oAuthProviders.KAKAO),
        // options: { auth_type: 'reauthenticate' },
        grantType: 'authorization_code',
      },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, TokensService],
  controllers: [SocialsController],
})
export class SocialsModule {}
