import {
  Type,
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { TCloudinaryFilesInterceptorOptions } from '~app/interceptors/cloudinary/cloudinary.types';
import { CloudinaryService } from '~app/interceptors/cloudinary/cloudinary.service';

export function CloudinaryFilesInterceptor(
  fileName: string,
  maxCount: number,
  options: TCloudinaryFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(@Inject(CloudinaryService.name) private readonly cloudinaryService: CloudinaryService) {
      this.cloudinaryService.setMulter(fileName, maxCount, options);
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      await this.cloudinaryService.upload(ctx);
      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
