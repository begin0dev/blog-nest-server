import { Dayjs } from 'dayjs';

export type TSocialProvider = 'facebook' | 'kakao' | 'google' | 'github';
type TSocial = Partial<Record<TSocialProvider, { id: string }>>;

export class CreateUserDto {
  public displayName: string;
  public profileImageURL?: string;
  public isAdmin: boolean;
  public oAuth: {
    local: {
      refreshToken: string;
      expiredAt: Date | Dayjs;
    };
  } & TSocial;
}
