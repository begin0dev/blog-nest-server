export const oAuthNames = {
  FACEBOOK: 'facebook',
  GITHUB: 'github',
  GOOGLE: 'google',
  KAKAO: 'kakao',
} as const;

export type TOAuthName = typeof oAuthNames[keyof typeof oAuthNames];

export interface IOptions {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  grantType?: string;
  options?: Record<string, string>;
}

export interface IOAuthOptions extends IOptions {
  name: TOAuthName;
}

export interface IAuthorizeUrl {
  name: TOAuthName;
  redirectUri: string;
}

export interface IAccessToken {
  name: TOAuthName;
  code: string;
  redirectUri: string;
}

export interface IAccessTokenParams {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  grant_type?: string;
}
