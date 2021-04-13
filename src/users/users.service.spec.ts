import * as faker from 'faker';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { mockUser } from '~app/schemas/__mocks__/user';
import { UsersService } from '~app/users/users.service';
import { TUserDocument, User, UserSchema } from '~app/schemas/user.schema';
import { TokensService } from '~app/middlewares/tokens/tokens.service';
import { oAuthProviders } from '~app/helpers/o-auth-module/o-auth.types';

describe('UsersService', () => {
  let module: TestingModule;
  let usersService: UsersService;
  let mongoServer: MongoMemoryServer;
  let userModel: Model<TUserDocument>;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoURI = await mongoServer.getUri();

    module = await Test.createTestingModule({
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
    await module.close();
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('#findByRefreshToken', async () => {
    const userAttr = mockUser();

    let findUser = await usersService.findByRefreshToken(userAttr.oAuth.local.refreshToken);
    expect(findUser).toBeNull();

    await userModel.create(userAttr);

    findUser = await usersService.findByRefreshToken(userAttr.oAuth.local.refreshToken);
    expect(findUser).not.toBeNull();
  });

  it('#findBySocialId', async () => {
    const userAttr = mockUser();

    let findUser = await usersService.findBySocialId(
      oAuthProviders.FACEBOOK,
      userAttr.oAuth[oAuthProviders.FACEBOOK].id,
    );
    expect(findUser).toBeNull();

    await userModel.create(userAttr);

    findUser = await usersService.findBySocialId(
      oAuthProviders.FACEBOOK,
      userAttr.oAuth[oAuthProviders.FACEBOOK].id,
    );
    expect(findUser).not.toBeNull();
  });

  it('#updateRefreshToken', async () => {
    const refreshToken = faker.datatype.uuid();
    let user = await userModel.create(mockUser());
    expect(user.oAuth.local.refreshToken).not.toEqual(refreshToken);

    await usersService.updateRefreshToken(user._id, { ...user.oAuth.local, refreshToken });
    user = await usersService.findById(user._id);
    expect(user.oAuth.local.refreshToken).toEqual(refreshToken);
  });

  it('#deleteRefreshToken', async () => {
    let user = await userModel.create(mockUser());
    expect(user.oAuth.local).not.toBeUndefined();

    await usersService.deleteRefreshToken(user._id);
    user = await usersService.findById(user._id);
    expect(user.oAuth.local).toBeUndefined();
  });
});
