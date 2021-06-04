import { Test, TestingModule } from '@nestjs/testing';

import { CommonsController } from './commons.controller';
import { CloudinaryModule } from '~app/interceptors/cloudinary/cloudinary.module';

describe('CommonsController', () => {
  let controller: CommonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CloudinaryModule.register({
          cloud_name: 'test',
          api_key: 'test_api_key',
          api_secret: 'test_api_secret',
        }),
      ],
      controllers: [CommonsController],
    }).compile();

    controller = module.get<CommonsController>(CommonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
