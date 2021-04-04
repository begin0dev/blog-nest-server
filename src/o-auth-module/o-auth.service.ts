import { Injectable, Inject } from '@nestjs/common';
import * as qs from 'qs';

import {
  oAuthNames,
  IAuthorizeUrl,
  IAccessToken,
  IAccessTokenParams,
  TOAuthName,
  IOptions,
} from '@app/o-auth-module/o-auth.types';
import axios from 'axios';

@Injectable()
export class OAuthService {
  private oAuthOptions: Partial<Record<TOAuthName, IOptions>> = {};
  private SOCIAL_BASE = {
    [oAuthNames.FACEBOOK]: {
      authorizationUrl: 'https://www.facebook.com/v10.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v10.0/oauth/access_token',
      profileUrl: 'https://graph.facebook.com/v10.0/me',
      defaultScope: ['name', 'email'],
    },
    [oAuthNames.KAKAO]: {
      authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
      tokenUrl: 'https://kauth.kakao.com/oauth/token',
      profileUrl: 'https://kapi.kakao.com/v2/user/me',
      defaultScope: [],
    },
    [oAuthNames.GITHUB]: {
      authorizationUrl: '',
      tokenUrl: '',
      profileUrl: '',
      defaultScope: [],
    },
    [oAuthNames.GOOGLE]: {
      authorizationUrl: '',
      tokenUrl: '',
      profileUrl: '',
      defaultScope: [],
    },
  };

  constructor(@Inject('OAUTH_OPTIONS') private options) {
    options.forEach(({ name, ...options }) => {
      this.oAuthOptions[name] = options;
    });
  }

  getCallbackUrl(name: TOAuthName, serverUrl: string, accessToken: string) {
    const { callbackUrl } = this.oAuthOptions[name];
    return `${serverUrl}${callbackUrl}?${qs.stringify({ access_token: accessToken })}`;
  }

  getAuthorizeUrl({ name, redirectUri }: IAuthorizeUrl): string {
    const { clientId, options } = this.oAuthOptions[name];
    const { authorizationUrl } = this.SOCIAL_BASE[name];
    const query = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      ...(options || {}),
    };
    const queryString = qs.stringify(query);
    return `${authorizationUrl}?${queryString}`;
  }

  async getAccessToken({ name, code, redirectUri }: IAccessToken) {
    const { clientId, clientSecret, grantType } = this.oAuthOptions[name];
    const { tokenUrl } = this.SOCIAL_BASE[name];
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
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return access_token;
  }
}
