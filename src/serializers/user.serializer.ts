import { Expose } from 'class-transformer';

import { BaseSerializer } from '~app/serializers/base.serializer';

export class UserSerializer extends BaseSerializer {
  @Expose()
  displayName: string;

  @Expose()
  profileImageUrl?: string;

  @Expose()
  isAdmin: boolean;
}
