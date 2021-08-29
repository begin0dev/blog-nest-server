import { Expose } from 'class-transformer';

import { BaseEntity } from '~app/entities/base.entity';

export class UserEntity extends BaseEntity {
  @Expose()
  displayName: string;

  @Expose()
  profileImageUrl?: string;

  @Expose()
  isAdmin: boolean;
}
