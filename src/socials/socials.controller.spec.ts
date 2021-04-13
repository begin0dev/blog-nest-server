import * as faker from 'faker';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';

import { SocialsController } from '~app/socials/socials.controller';
import { OAuthService } from '~app/helpers/o-auth-module/o-auth.service';
import { UsersService } from '~app/users/users.service';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { TUserDocument, User, UserSchema } from '~app/schemas/user.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('SocialsController', () => {
  let module: TestingModule;
  let mongoServer: MongoMemoryServer;
  let userModel: Model<TUserDocument>;
  let socialsController: SocialsController;

  const clientUri = faker.internet.url();
  const configService = {
    get(name: string) {
      if (name === 'CLIENT_URI') return clientUri;
    },
  };
  const profile = {
    id: faker.datatype.uuid(),
    name: faker.name.middleName(),
    picture: { data: { url: faker.internet.url() } },
  };
  const oAuthService = {
    getProfile: async () => profile,
  };

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoURI = await mongoServer.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoURI),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [SocialsController],
      providers: [ConfigService, OAuthService, UsersService, TokensService],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .overrideProvider(OAuthService)
      .useValue(oAuthService)
      .compile();

    socialsController = module.get<SocialsController>(SocialsController);
    userModel = module.get<Model<TUserDocument>>(getModelToken(User.name));
  });

  afterEach(async () => {
    await module.close();
    await mongoServer.stop();
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
});
