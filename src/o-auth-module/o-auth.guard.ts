import { CanActivate, Injectable, ExecutionContext, mixin, Inject } from '@nestjs/common';

import { TOAuthName } from '@app/o-auth-module/o-auth.types';
import { OAuthService } from '@app/o-auth-module/o-auth.service';

export function OAuthGuard(name: TOAuthName) {
  @Injectable()
  class MixinOAuthGuard implements CanActivate {
    constructor(@Inject(OAuthService.name) private readonly oAuthService: OAuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();

      const { code, error, error_description } = req.query;
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      const currentUrl = `${serverUrl}${req.originalUrl}`;

      if (error) res.locals.error = error_description;
      if (!code)
        res.locals.redirectUrl = this.oAuthService.getAuthorizeUrl({ name, redirectUri: currentUrl });
      if (code) {
        try {
          const accessToken = await this.oAuthService.getAccessToken({
            name,
            code,
            redirectUri: currentUrl,
          });
          res.locals.redirectUrl = this.oAuthService.getCallbackUrl(name, serverUrl, accessToken);
        } catch (err) {
          res.locals.error = err.message;
        }
      }

      return true;
    }
  }
  return mixin(MixinOAuthGuard);
}
