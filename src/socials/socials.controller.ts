import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';

import { OAuthService } from '@app/o-auth-module/o-auth.service';
import { OAuthGuard } from '@app/o-auth-module/o-auth.guard';
import { oAuthNames } from '@app/o-auth-module/o-auth.types';
import { AccessToken, ErrorMessage, RedirectUrl } from '@app/o-auth-module/o-auth.decorator';

@Controller('v1/socials')
export class SocialsController {
  constructor(private readonly oAuthService: OAuthService) {}

  @Get(oAuthNames.FACEBOOK)
  @Redirect()
  @UseGuards(OAuthGuard(oAuthNames.FACEBOOK))
  facebook(@RedirectUrl() redirectUrl?: string, @ErrorMessage() error?: string) {
    if (error) return { url: `http://localhost:3000?message=${error}` };
    return { url: redirectUrl };
  }

  @Get(`${oAuthNames.FACEBOOK}/callback`)
  @Redirect()
  facebookCallback(@AccessToken() accessToken: string) {
    console.log(accessToken);
    return { url: 'http://localhost:3000' };
  }
}
