export interface IFacebookAccount {
  id: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export interface IKakaoAccount {
  id: number;
  properties: {
    nickname: string;
    profile_image: string;
  };
}
