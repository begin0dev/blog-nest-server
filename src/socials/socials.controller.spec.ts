import { Test, TestingModule } from '@nestjs/testing';

import { SocialsController } from '~app/socials/socials.controller';

describe('OAuthsController', () => {
  let controller: SocialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialsController],
    }).compile();

    controller = module.get<SocialsController>(SocialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
