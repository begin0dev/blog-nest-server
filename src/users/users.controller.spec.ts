import * as faker from 'faker';
import { createResponse } from 'node-mocks-http';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '~app/users/users.controller';
import { UsersService } from '~app/users/users.service';
import { mockUser } from '~app/schemas/__mocks__/user';
import { cookieOptions } from '~app/helpers/base';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = { deleteRefreshToken: jest.fn(async () => undefined) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('#me', () => {
    expect(usersController.me(null)).toBeNull();

    const { displayName, profileImageUrl, isAdmin } = mockUser();
    const currentUser = {
      _id: faker.datatype.uuid(),
      displayName,
      profileImageUrl,
      isAdmin,
    };

    expect(usersController.me(currentUser)).toEqual(currentUser);
  });

  it('#delete', async () => {
    const { displayName, profileImageUrl, isAdmin } = mockUser();
    const currentUser = {
      _id: faker.datatype.uuid(),
      displayName,
      profileImageUrl,
      isAdmin,
    };

    const res = createResponse();
    res.clearCookie = jest.fn().mockReturnThis();

    await usersController.delete(currentUser, res);
    expect(usersService.deleteRefreshToken).toBeCalledTimes(1);
    expect(res.clearCookie).toBeCalledTimes(2);
    expect(res.clearCookie).toBeCalledWith('accessToken', cookieOptions);
    expect(res.clearCookie).toBeCalledWith('refreshToken', cookieOptions);
  });
});
