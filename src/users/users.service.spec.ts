import * as dayjs from 'dayjs';
import * as faker from 'faker';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
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

  const JWT_SECRET = faker.datatype.uuid();
  const configService = {
    get(key: string) {
      if (key === 'JWT_SECRET') return JWT_SECRET;
    },
  };

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoURI = await mongoServer.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoURI),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [ConfigService, TokensService, UsersService],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();

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

  it('#createVerifyCode', async () => {
    const userAttr = mockUser();
    delete userAttr.oAuth.local.verifyCode;
    delete userAttr.oAuth.local.verifyCodeSendAt;

    const user = await userModel.create(userAttr);
    expect(user.oAuth.local.verifyCode).toBeUndefined();

    const verifyCode = await usersService.createVerifyCode(user._id);
    const expectUser = await userModel.findOne({ 'oAuth.local.verifyCode': verifyCode });
    expect(expectUser).not.toBeNull();
    expect(expectUser._id).toEqual(user._id);
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

  it('#findByVerifyCode: not expired', async () => {
    const user = await userModel.create(mockUser());

    const { verifyCode } = user.oAuth.local;

    const findUser = await usersService.findByVerifyCode(verifyCode);
    expect(findUser).not.toBeNull();
  });

  it('#findByVerifyCode: not expired', async () => {
    const mockUserData = mockUser();
    mockUserData.oAuth.local.verifyCodeSendAt = dayjs().subtract(3, 'minute');

    await userModel.create(mockUserData);

    const { verifyCode } = mockUserData.oAuth.local;

    const findUser = await usersService.findByVerifyCode(verifyCode);
    expect(findUser).toBeNull();
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
