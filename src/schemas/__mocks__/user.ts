import * as faker from 'faker';
import * as dayjs from 'dayjs';

export const mockUser = () =>
  ({
    displayName: faker.internet.userName(),
    profileImageUrl: faker.internet.url(),
    isAdmin: false,
    oAuth: {
      local: {
        refreshToken: faker.random.uuid(),
        expiredAt: dayjs().add(1, 'day'),
      },
    },
  } as const);
