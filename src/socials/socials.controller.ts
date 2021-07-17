import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';

import { OAuthService } from '~app/helpers/o-auth-module/o-auth.service';
import { OAuthGuard } from '~app/helpers/o-auth-module/o-auth.guard';
import { oAuthProviders } from '~app/helpers/o-auth-module/o-auth.types';
import { UsersService } from '~app/users/users.service';
import { AccessToken, ErrorMessage, RedirectUrl } from '~app/helpers/o-auth-module/o-auth.decorator';
import { IFacebookAccount, IKakaoAccount } from '~app/socials/socials.types';
import { AuthGuard, authTarget } from '~app/guards/auth.guard';

@ApiTags('v1/socials')
@Controller('v1/socials')
@UseGuards(AuthGuard(authTarget.VISITOR))
export class SocialsController {
  private readonly clientUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly oAuthService: OAuthService,
    private readonly usersService: UsersService,
  ) {
    this.clientUri = configService.get<string>('CLIENT_URI');
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
      const verifyCode = await this.usersService.createVerifyCode(user);
      return { url: `${this.clientUri}?verify_code=${verifyCode}` };
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
      const verifyCode = await this.usersService.createVerifyCode(user);
      return { url: `${this.clientUri}?verify_code=${verifyCode}` };
    } catch (err) {
      return { url: `${this.clientUri}?status=error&message=${err.message}` };
    }
  }
}
