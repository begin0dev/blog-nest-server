import * as faker from 'faker';
import { createResponse } from 'node-mocks-http';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Mongoose, { ObjectId } from 'mongoose';

import { UsersController } from '~app/users/users.controller';
import { UsersService } from '~app/users/users.service';
import { mockUser } from '~app/schemas/__mocks__/user';
import { cookieOptions } from '~app/helpers/base';
import { TokensService } from '~app/middlewares/tokens/tokens.service';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = {
    deleteRefreshToken: jest.fn(),
    findByVerifyCode: jest.fn(),
  };

  beforeEach(async () => {
    const configService = {
      get(key: string) {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, TokensService, ConfigService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('#verify: success', () => {
    const res = createResponse();
    res.cookie = jest.fn().mockReturnValue(res);

    const userAttr = mockUser();
    const mockReturnUser = {
      ...userAttr,
      toJSON() {
        return {
          _id: faker.datatype.uuid(),
          displayName: userAttr.displayName,
          profileImageUrl: userAttr.profileImageUrl,
          isAdmin: userAttr.isAdmin,
        };
      },
    };

    jest.spyOn(usersService, 'findByVerifyCode').mockResolvedValueOnce(mockReturnUser);

    expect(usersController.verify(userAttr.oAuth.local.verifyCode, res)).not.toBeNull();
    expect(res.cookie.call.length > 0).toBeTruthy();
  });

  it('#verify: fail', () => {
    const res = createResponse();
    res.cookie = jest.fn().mockReturnValue(res);

    jest.spyOn(usersService, 'findByVerifyCode').mockResolvedValueOnce(null);

    expect(usersController.verify('', res)).rejects.toThrow(HttpException);
  });

  it('#me', () => {
    expect(usersController.me(null).payload).toBeNull();

    const { displayName, profileImageUrl, isAdmin } = mockUser();
    const currentUser = {
      _id: faker.datatype.uuid(),
      displayName,
      profileImageUrl,
      isAdmin,
    };

    expect(usersController.me(currentUser).payload).toEqual(currentUser);
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
