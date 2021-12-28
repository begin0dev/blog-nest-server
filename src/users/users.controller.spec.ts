import * as faker from 'faker';
import { createResponse } from 'node-mocks-http';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '~app/users/users.controller';
import { UsersService } from '~app/users/users.service';
import { mockUser } from '~app/schemas/__mocks__/user';
import { cookieOptions } from '~app/helpers/constants';
import { TokensService } from '~app/middlewares/tokens/tokens.service';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = {
    deleteRefreshToken: jest.fn(),
    findByVerifyCode: jest.fn(),
    updateRefreshToken: jest.fn(),
  };
  const getCurrentUser = () => {
    const { displayName, profileImageUrl, isAdmin } = mockUser();
    return {
      _id: faker.datatype.uuid(),
      displayName,
      profileImageUrl,
      isAdmin,
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, TokensService, ConfigService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(ConfigService)
      .useValue({
        get(key: string) {
          return {
            JWT_SECRET: 'test_jwt_secret',
          }[key];
        },
      })
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

    jest.spyOn(usersService, 'findByVerifyCode').mockResolvedValueOnce(userAttr);

    expect(usersController.verify(userAttr.oAuth.local.verifyCode, res)).not.toBeNull();
    expect(res.cookie.call.length > 0).toBeTruthy();
  });

  it('#verify: fail', () => {
    const res = createResponse();
    res.cookie = jest.fn().mockReturnValue(res);

    jest.spyOn(usersService, 'findByVerifyCode').mockImplementation(() => {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.FORBIDDEN);
    });

    expect(usersController.verify('', res)).rejects.toThrow(HttpException);
  });

  it('#me', () => {
    expect(usersController.me(null).payload).toBeNull();

    const currentUser = getCurrentUser();
    expect(usersController.me(currentUser).payload).toEqual(currentUser);
  });

  it('#delete', async () => {
    const res = createResponse();
    res.clearCookie = jest.fn().mockReturnThis();

    const currentUser = getCurrentUser();
    await usersController.delete(currentUser, res);
    expect(usersService.deleteRefreshToken).toBeCalledTimes(1);
    expect(res.clearCookie).toBeCalledTimes(2);
    expect(res.clearCookie).toBeCalledWith('accessToken', cookieOptions);
    expect(res.clearCookie).toBeCalledWith('refreshToken', cookieOptions);
  });
});
