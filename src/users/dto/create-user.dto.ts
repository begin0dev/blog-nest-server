import { PickType, PartialType } from '@nestjs/swagger';
import { User } from '~app/schemas/user.schema';

export type TSocialProvider = 'facebook' | 'kakao' | 'google' | 'github';
type TSocial = Partial<Record<TSocialProvider, { id: string }>>;

export class CreateUserDto extends PartialType(PickType(User, ['displayName', 'profileImageUrl'] as const)) {
  public oAuth: TSocial;
}
