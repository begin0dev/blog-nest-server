import { DynamicModule, Module } from '@nestjs/common';

import { OAuthService } from '~app/helpers/o-auth-module/o-auth.service';
import { IOAuthOptions } from '~app/helpers/o-auth-module/o-auth.types';

@Module({})
export class OAuthModule {
  static register(options: IOAuthOptions[]): DynamicModule {
    return {
      module: OAuthModule,
      providers: [{ provide: 'OAUTH_OPTIONS', useValue: options }, OAuthService],
      exports: [OAuthService],
    };
  }
}
