import * as faker from 'faker';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { SocialsController } from '~app/socials/socials.controller';
import { OAuthService } from '~app/helpers/o-auth-module/o-auth.service';
import { UsersService } from '~app/users/users.service';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { mockUser } from '~app/schemas/__mocks__/user';

describe('SocialsController', () => {
  let module: TestingModule;
  let socialsController: SocialsController;

  const clientUri = faker.internet.url();
  const configService = {
    get(key: string) {
      if (key === 'CLIENT_URI') return clientUri;
    },
  };
  const userAttr = mockUser();
  const profile = {
    id: faker.datatype.uuid(),
    name: userAttr.displayName,
    picture: { data: { url: userAttr.profileImageUrl } },
  };
  const oAuthService = {
    getProfile: async () => profile,
  };
  let usersService;

  beforeEach(async () => {
    usersService = {
      findBySocialId: jest.fn(),
      create: jest.fn(),
    };

    module = await Test.createTestingModule({
      controllers: [SocialsController],
      providers: [ConfigService, OAuthService, UsersService, TokensService],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(OAuthService)
      .useValue(oAuthService)
      .compile();

    socialsController = module.get<SocialsController>(SocialsController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(socialsController).toBeDefined();
  });

  it('#facebook', () => {
    expect(socialsController.facebook(undefined, 'error test').url).toEqual(
      `${clientUri}?status=error&message=error test`,
    );

    const redirectUrl = 'test.com/callback';
    expect(socialsController.facebook(redirectUrl, undefined).url).toEqual(redirectUrl);
  });

  it('#facebookCallback - findBySocialId', async () => {
    const userBase = {
      _id: faker.datatype.uuid(),
      displayName: userAttr.displayName,
      profileImageUrl: userAttr.profileImageUrl,
      isAdmin: userAttr.isAdmin,
    };
    const mockReturnUser = {
      ...userBase,
      oAuth: userAttr.oAuth,
      toJSON() {
        return userBase;
      },
    };

    jest.spyOn(usersService, 'findBySocialId').mockResolvedValueOnce(mockReturnUser);

    await socialsController.facebookCallback('test_token');

    expect(usersService.findBySocialId.mock.calls.length).toEqual(1);
    expect(usersService.create.mock.calls.length).toEqual(0);
  });

  it('#facebookCallback', async () => {
    const userBase = {
      _id: faker.datatype.uuid(),
      displayName: userAttr.displayName,
      profileImageUrl: userAttr.profileImageUrl,
      isAdmin: userAttr.isAdmin,
    };
    const mockReturnUser = {
      ...userBase,
      oAuth: userAttr.oAuth,
      toJSON() {
        return userBase;
      },
    };

    jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockReturnUser);

    await socialsController.facebookCallback('test_token');

    expect(usersService.findBySocialId.mock.calls.length).toEqual(1);
    expect(usersService.create.mock.calls.length).toEqual(1);
  });
});
