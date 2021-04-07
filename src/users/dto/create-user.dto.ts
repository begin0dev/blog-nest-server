export type TSocialProvider = 'facebook' | 'kakao' | 'google' | 'github';
type TSocial = Partial<Record<TSocialProvider, { id: string }>>;

export class CreateUserDto {
  public displayName: string;
  public profileImageUrl?: string;
  public oAuth: TSocial;
}
