import faker from 'faker';

export const mockUser = (): {
  displayName: string;
  profileImageURL: string;
  isAdmin: boolean;
} => ({
  displayName: faker.internet.userName(),
  profileImageURL: faker.internet.url(),
  isAdmin: false,
});
