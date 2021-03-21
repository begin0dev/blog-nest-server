import * as faker from 'faker';
import * as dayjs from 'dayjs';

import { CreateUserDto } from '@app/users/dto/create_user.dto';

export const mockUser = (): CreateUserDto => ({
  displayName: faker.internet.userName(),
  profileImageURL: faker.internet.url(),
  isAdmin: false,
  oAuth: {
    local: {
      refreshToken: faker.random.uuid(),
      expiredAt: dayjs().add(1, 'day').toDate(),
    },
  },
});
