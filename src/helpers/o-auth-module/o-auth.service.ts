import * as qs from 'qs';
import axios from 'axios';
import { Injectable, Inject } from '@nestjs/common';

import {
  oAuthProviders,
  IAuthorizeUrl,
  IAccessToken,
  IAccessTokenParams,
  TOAuthProvider,
  IOptions,
  IProfile,
} from '~app/helpers/o-auth-module/o-auth.types';

@Injectable()
export class OAuthService {
  private oAuthOptions: Partial<Record<TOAuthProvider, IOptions>> = {};
  private SOCIAL_BASE = {
    [oAuthProviders.FACEBOOK]: {
      authorizationUrl: 'https://www.facebook.com/v10.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v10.0/oauth/access_token',
      profileUrl: 'https://graph.facebook.com/v10.0/me',
      defaultScope: ['public_profile'],
      defaultProfile: ['name', 'email', 'picture'],
    },
    [oAuthProviders.KAKAO]: {
      authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
      tokenUrl: 'https://kauth.kakao.com/oauth/token',
      profileUrl: 'https://kapi.kakao.com/v2/user/me',
      defaultScope: [],
      defaultProfile: [],
    },
    [oAuthProviders.GITHUB]: {
      authorizationUrl: '',
      tokenUrl: '',
      profileUrl: '',
      defaultScope: [],
      defaultProfile: [],
    },
    [oAuthProviders.GOOGLE]: {
      authorizationUrl: '',
      tokenUrl: '',
      profileUrl: '',
      defaultScope: [],
      defaultProfile: [],
    },
  };

  constructor(@Inject('OAUTH_OPTIONS') private options) {
    options.forEach(({ provider, ...options }) => {
      this.oAuthOptions[provider] = options;
    });
  }

  getCallbackUrl(provider: TOAuthProvider, serverUrl: string, accessToken: string) {
    const { callbackUrl } = this.oAuthOptions[provider];
    return `${serverUrl}${callbackUrl}?${qs.stringify({ access_token: accessToken })}`;
  }

  getAuthorizeUrl({ provider, redirectUri }: IAuthorizeUrl): string {
    const { clientId, scope, options } = this.oAuthOptions[provider];
    const { authorizationUrl, defaultScope } = this.SOCIAL_BASE[provider];
    const query = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: [...new Set(defaultScope.concat(scope || []))].join(','),
      ...(options || {}),
    };

    const queryString = qs.stringify(query);
    return `${authorizationUrl}?${queryString}`;
  }

  async getAccessToken({ provider, code, redirectUri }: IAccessToken): Promise<string> {
    const { clientId, clientSecret, grantType } = this.oAuthOptions[provider];
    const { tokenUrl } = this.SOCIAL_BASE[provider];
    const params: IAccessTokenParams = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: grantType,
    };

    const {
      data: { access_token },
    } = await axios.post(tokenUrl, qs.stringify(params), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    });

    return access_token;
  }

  async getProfile<T>({ provider, accessToken }: IProfile): Promise<T> {
    const { profileUrl, defaultProfile } = this.SOCIAL_BASE[provider];
    const { profileFields } = this.oAuthOptions[provider];
    const params = {
      access_token: accessToken,
      fields: [...new Set(defaultProfile.concat(profileFields || []))].join(','),
    };

    const { data } = await axios.get(profileUrl, { params });
    return data;
  }
}
