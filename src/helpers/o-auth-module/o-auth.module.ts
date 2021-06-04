import { DynamicModule, Module } from '@nestjs/common';

import { OAuthService } from '~app/helpers/o-auth-module/o-auth.service';
import { IOAuthOptions } from '~app/helpers/o-auth-module/o-auth.types';

export const OAUTH_OPTION_PROVIDER = 'OAUTH_OPTIONS' as const;

@Module({})
export class OAuthModule {
  public static register(options: IOAuthOptions[]): DynamicModule {
    return {
      module: OAuthModule,
      providers: [{ provide: OAUTH_OPTION_PROVIDER, useValue: options }, OAuthService],
      exports: [OAuthService],
    };
  }
}
