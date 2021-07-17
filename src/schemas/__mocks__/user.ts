import * as faker from 'faker';
import * as dayjs from 'dayjs';

import { oAuthProviders } from '~app/helpers/o-auth-module/o-auth.types';

export const mockUser = () => ({
  displayName: faker.internet.userName(),
  profileImageUrl: faker.internet.url(),
  isAdmin: false,
  oAuth: {
    local: {
      refreshToken: faker.datatype.uuid(),
      expiredAt: dayjs().add(1, 'day'),
      verifyCode: faker.datatype.uuid(),
      verifyCodeSendAt: dayjs(),
    },
    [oAuthProviders.FACEBOOK]: {
      id: faker.datatype.uuid(),
    },
  },
});
