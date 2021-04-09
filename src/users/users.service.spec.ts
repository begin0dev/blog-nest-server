import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { mockUser } from '~app/schemas/__mocks__/user';
import { UsersService } from '~app/users/users.service';
import { TUserDocument, User, UserSchema } from '~app/schemas/user.schema';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { oAuthProviders } from '~app/helpers/o-auth-module/o-auth.types';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let usersService: UsersService;
  let mongoServer: MongoMemoryServer;
  let userModel: Model<TUserDocument>;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoURI = await mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoURI),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [TokensService, UsersService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<TUserDocument>>(getModelToken(User.name));
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('#findByRefreshToken', async () => {
    const mockData = mockUser();

    let findUser = await usersService.findByRefreshToken(mockData.oAuth.local.refreshToken);
    expect(findUser).toBeNull();

    await userModel.create(mockData);

    findUser = await usersService.findByRefreshToken(mockData.oAuth.local.refreshToken);
    expect(findUser).not.toBeNull();
  });

  it('#findBySocialId', async () => {
    const mockData = mockUser();

    let findUser = await usersService.findBySocialId(
      oAuthProviders.FACEBOOK,
      mockData.oAuth[oAuthProviders.FACEBOOK].id,
    );
    expect(findUser).toBeNull();

    await userModel.create(mockData);

    findUser = await usersService.findBySocialId(
      oAuthProviders.FACEBOOK,
      mockData.oAuth[oAuthProviders.FACEBOOK].id,
    );
    expect(findUser).not.toBeNull();
  });
});
