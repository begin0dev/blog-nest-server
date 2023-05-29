import { faker } from '@faker-js/faker';
import * as dayjs from 'dayjs';

import { oAuthProviders } from '~app/helpers/o-auth-module/o-auth.types';

export const mockUser = () => ({
  displayName: faker.internet.userName(),
  profileImageUrl: faker.internet.url(),
  isAdmin: false,
  oAuth: {
    local: {
      refreshToken: faker.string.uuid(),
      expiredAt: dayjs().add(1, 'day'),
      verifyCode: faker.string.uuid(),
      verifyCodeSendAt: dayjs(),
    },
    [oAuthProviders.FACEBOOK]: {
      id: faker.string.uuid(),
    },
  },
});
