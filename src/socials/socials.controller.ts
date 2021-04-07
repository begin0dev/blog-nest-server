import { ConfigService } from '@nestjs/config';
import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';

import { OAuthService } from '@app/o-auth-module/o-auth.service';
import { OAuthGuard } from '@app/o-auth-module/o-auth.guard';
import { oAuthProviders } from '@app/o-auth-module/o-auth.types';
import { UsersService } from '@app/users/users.service';
import { AccessToken, ErrorMessage, RedirectUrl } from '@app/o-auth-module/o-auth.decorator';
import { IFacebookAccount, IKakaoAccount } from '@app/socials/socials.types';

@Controller('v1/socials')
export class SocialsController {
  private readonly clientUri: string;

  constructor(
    private readonly oAuthService: OAuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.clientUri = this.configService.get<string>('CLIENT_URI');
  }

  @Get(oAuthProviders.FACEBOOK)
  @Redirect()
  @UseGuards(OAuthGuard(oAuthProviders.FACEBOOK))
  facebook(@RedirectUrl() redirectUrl?: string, @ErrorMessage() err?: string) {
    if (err) return { url: `${this.clientUri}?status=error&message=${err}` };
    return { url: redirectUrl };
  }

  @Get(`${oAuthProviders.FACEBOOK}/callback`)
  @Redirect()
  async facebookCallback(@AccessToken() accessToken: string) {
    try {
      const { id, name, picture } = await this.oAuthService.getProfile<IFacebookAccount>({
        provider: oAuthProviders.FACEBOOK,
        accessToken,
      });
      let user = await this.usersService.findBySocialId(oAuthProviders.FACEBOOK, id);
      if (!user) {
        user = await this.usersService.create({
          displayName: name,
          profileImageUrl: picture?.data?.url,
          oAuth: { [oAuthProviders.FACEBOOK]: { id } },
        });
      }
      return { url: this.clientUri };
    } catch (err) {
      return { url: `${this.clientUri}?status=error&message=${err.message}` };
    }
  }

  @Get(oAuthProviders.KAKAO)
  @Redirect()
  @UseGuards(OAuthGuard(oAuthProviders.KAKAO))
  kakao(@RedirectUrl() redirectUrl?: string, @ErrorMessage() err?: string) {
    if (err) return { url: `${this.clientUri}?status=error&message=${err}` };
    return { url: redirectUrl };
  }

  @Get(`${oAuthProviders.KAKAO}/callback`)
  @Redirect()
  async kakaoCallback(@AccessToken() accessToken: string) {
    try {
      const {
        id,
        properties: { nickname, profile_image },
      } = await this.oAuthService.getProfile<IKakaoAccount>({ provider: oAuthProviders.KAKAO, accessToken });
      let user = await this.usersService.findBySocialId(oAuthProviders.KAKAO, id.toString());
      if (!user) {
        user = await this.usersService.create({
          displayName: nickname,
          profileImageUrl: profile_image,
          oAuth: { [oAuthProviders.KAKAO]: { id: id.toString() } },
        });
      }
      return { url: this.clientUri };
    } catch (err) {
      return { url: `${this.clientUri}?status=error&message=${err.message}` };
    }
  }
}
