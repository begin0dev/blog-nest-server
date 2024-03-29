import * as dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';

import { TokensModule } from '~app/tokens/tokens.module';
import { ICurrentUser, CurrentUser } from '~app/decorators/user.decorator';
import { User } from '~app/schemas/user.schema';
import { mockUser } from '~app/schemas/__mocks__/user';
import { TUserDocument } from '~app/schemas/user.schema';
import { UserSerializer } from '~app/serializers/user.serializer';
import modelSerializer from '~app/helpers/model-serializer';

describe('Token middleware test', () => {
  let app: INestApplication;
  let userModel: Model<TUserDocument>;

  const JWT_SECRET = faker.string.uuid();

  const extractCookies = (cookies: string[]): Record<string, string> =>
    cookies.reduce((acc, cur) => {
      const [cookie] = cur.split('; ');
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});

  beforeEach(async () => {
    @Controller()
    class TestsController {
      @Get()
      user(@CurrentUser() user: ICurrentUser): ICurrentUser | undefined {
        return user;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(global.mongoURI), TokensModule],
      providers: [ConfigService],
      controllers: [TestsController],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get(key: string) {
          return {
            JWT_SECRET,
          }[key];
        },
      })
      .compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    userModel = module.get<Model<TUserDocument>>(getModelToken(User.name));
  });

  afterEach(async () => {
    await app.close();
  });

  it('Not exist token', async () => {
    await request(app.getHttpServer()).get('/').expect(200, {});
  });

  it('Exist verified access token', async () => {
    const user = await userModel.create(mockUser());
    const userJSON = modelSerializer(user, UserSerializer);
    const accessToken = jwt.sign({ user: userJSON }, JWT_SECRET);

    await request(app.getHttpServer())
      .get('/')
      .set('Cookie', [`accessToken=${accessToken}`])
      .expect(200, userJSON);
  });

  it('Refresh token is verified and Access token is expired', async () => {
    const user = await userModel.create(mockUser());
    const userJSON = modelSerializer(user, UserSerializer);
    const accessToken = jwt.sign({ user: userJSON, exp: dayjs().subtract(1, 'hour').unix() }, JWT_SECRET);

    const res = await request(app.getHttpServer())
      .get('/')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${user.oAuth.local.refreshToken}`])
      .expect(200, userJSON);

    const cookies = extractCookies(res.header['set-cookie']);
    expect(cookies.accessToken).not.toEqual(accessToken);
  });

  it('Refresh token is verified expired diff less then 30 minute and Access token is expired', async () => {
    const userAttr = mockUser();
    userAttr.oAuth.local.expiredAt = dayjs().add(20, 'minute');
    let user = await userModel.create(userAttr);
    const userJSON = modelSerializer(user, UserSerializer);
    const accessToken = jwt.sign({ user: userJSON, exp: dayjs().subtract(1, 'hour').unix() }, JWT_SECRET);

    const res = await request(app.getHttpServer())
      .get('/')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${user.oAuth.local.refreshToken}`])
      .expect(200, userJSON);

    const cookies = extractCookies(res.header['set-cookie']);
    expect(cookies.accessToken).not.toEqual(accessToken);

    user = await userModel.findOne(user._id);
    const diffMinute = dayjs(user.oAuth.local.expiredAt).diff(dayjs(), 'minute');
    expect(diffMinute).toBeGreaterThan(60);
  });

  it('Refresh token is expired and Access token is expired', async () => {
    const userAttr = mockUser();
    userAttr.oAuth.local.expiredAt = dayjs().subtract(1, 'hour');
    const user = await userModel.create(userAttr);
    const userJSON = modelSerializer(user, UserSerializer);
    const accessToken = jwt.sign({ user: userJSON, exp: dayjs().subtract(1, 'hour').unix() }, JWT_SECRET);

    const res = await request(app.getHttpServer())
      .get('/')
      .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${user.oAuth.local.refreshToken}`])
      .expect(200, {});

    const cookies = extractCookies(res.header['set-cookie']);
    expect(cookies.accessToken).toEqual('');
    expect(cookies.refreshToken).toEqual('');
  });
});
