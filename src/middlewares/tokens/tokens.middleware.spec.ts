import { Test, TestingModule } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Model } from 'mongoose';

import { TokensModule } from '@app/middlewares/tokens/tokens.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { IUser, CurrentUser } from '@app/decorators/user.decorator';
import { User } from '@app/schemas/user.schema';
import { mockUser } from '@app/schemas/__mocks__/user';
import { TUserDocument, UserSchema } from '@app/schemas/user.schema';

describe('Token middleware test', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let userModel: Model<TUserDocument>;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoURI = await mongoServer.getUri();

    @Controller()
    class TestsController {
      @Get()
      user(@CurrentUser() user: IUser): IUser | undefined {
        return user;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoURI), TokensModule],
      controllers: [TestsController],
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    await app.init();

    userModel = module.get<Model<TUserDocument>>(getModelToken(User.name));
  });

  afterEach(async () => {
    await app.close();
    await mongoServer.stop();
  });

  it('not exist access token', async () => {
    await request(app.getHttpServer()).get('/').expect(200, {});
  });

  it('exist access token', async () => {
    const user = await userModel.create(mockUser());
    console.log(user);

    await request(app.getHttpServer()).get('/').expect(200, {});
  });
});
