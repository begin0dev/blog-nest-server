import { CanActivate, Injectable, ExecutionContext, mixin, Inject } from '@nestjs/common';

import { TOAuthProvider } from '@app/o-auth-module/o-auth.types';
import { OAuthService } from '@app/o-auth-module/o-auth.service';

export function OAuthGuard(provider: TOAuthProvider) {
  @Injectable()
  class MixinOAuthGuard implements CanActivate {
    constructor(@Inject(OAuthService.name) private readonly oAuthService: OAuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();

      const { code, error, error_description } = req.query;
      const serverUrl = `${req.protocol}://${req.get('host')}`;
      const currentUrl = `${serverUrl}${req.path}`;

      if (error) res.locals.error = error_description;
      if (!code)
        res.locals.redirectUrl = this.oAuthService.getAuthorizeUrl({ provider, redirectUri: currentUrl });
      if (code) {
        try {
          const accessToken = await this.oAuthService.getAccessToken({
            provider,
            code,
            redirectUri: currentUrl,
          });
          res.locals.redirectUrl = this.oAuthService.getCallbackUrl(provider, serverUrl, accessToken);
        } catch (err) {
          console.error(err.message);
          res.locals.error = err.message;
        }
      }

      return true;
    }
  }
  return mixin(MixinOAuthGuard);
}
