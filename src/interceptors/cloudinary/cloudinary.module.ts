import { DynamicModule, Module } from '@nestjs/common';
import { ConfigOptions } from 'cloudinary';

import { CloudinaryService } from '~app/interceptors/cloudinary/cloudinary.service';

export const CLOUDINARY_CONFIG_PROVIDER = 'CLOUDINARY_CONFIG' as const;

@Module({})
export class CloudinaryModule {
  public static register(options: ConfigOptions): DynamicModule {
    return {
      module: CloudinaryModule,
      providers: [{ provide: CLOUDINARY_CONFIG_PROVIDER, useValue: options }, CloudinaryService],
      exports: [CloudinaryService],
    };
  }
}
