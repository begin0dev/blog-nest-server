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
  let mongoServer: MongoMemoryServer;
  let userModel: Model<TUserDocument>;
  let socialsController: SocialsController;
  const configService = {
    get(name: string) {
      if (name === 'CLIENT_URI') return faker.internet.url();
    },
  };
  const oAuthService = {
    getProfile: async () => ({
      id: faker.datatype.uuid(),
      name: faker.name.middleName(),
      picture: { data: { url: faker.internet.url() } },
    }),
  };

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoURI = await mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
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
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(socialsController).toBeDefined();
  });
});
