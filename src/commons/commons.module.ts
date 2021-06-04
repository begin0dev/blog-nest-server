import { Module } from '@nestjs/common';

import { CommonsController } from '~app/commons/commons.controller';
import { CloudinaryModule } from '~app/interceptors/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule.register({
      cloud_name: 'begin0dev-static',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }),
  ],
  controllers: [CommonsController],
})
export class CommonsModule {}
