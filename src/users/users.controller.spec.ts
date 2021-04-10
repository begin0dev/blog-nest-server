import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '~app/users/users.controller';
import { UsersService } from '~app/users/users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  const usersService = { deleteRefreshToken: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
