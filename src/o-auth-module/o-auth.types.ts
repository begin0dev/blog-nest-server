export const oAuthProviders = {
  FACEBOOK: 'facebook',
  GITHUB: 'github',
  GOOGLE: 'google',
  KAKAO: 'kakao',
} as const;

export type TOAuthProvider = typeof oAuthProviders[keyof typeof oAuthProviders];

export interface IOptions {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope?: string[];
  profileFields?: string[];
  grantType?: string;
  options?: Record<string, string>;
}

export interface IOAuthOptions extends IOptions {
  provider: TOAuthProvider;
}

export interface IAuthorizeUrl {
  provider: TOAuthProvider;
  redirectUri: string;
}

export interface IAccessToken {
  provider: TOAuthProvider;
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

export interface IProfile {
  provider: TOAuthProvider;
  accessToken: string;
}
