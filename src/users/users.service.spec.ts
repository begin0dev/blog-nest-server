import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { UsersService } from '@app/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@app/schemas/user.schema';
import { mockUser } from '@app/schemas/__mocks__/user';

describe('UsersService', () => {
  let service: UsersService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoURI = await mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoURI),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('#findByRefreshToken', async () => {
    const userDto = mockUser();

    let user = await service.findByRefreshToken(userDto.oAuth.local.refreshToken);
    expect(user).toBeNull();

    await service.create(userDto);

    user = await service.findByRefreshToken(userDto.oAuth.local.refreshToken);
    expect(user).not.toBeNull();
  });
});
