import * as multer from 'multer';
import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { CLOUDINARY_CONFIG_PROVIDER } from '~app/interceptors/cloudinary/cloudinary.module';
import { TCloudinaryFilesInterceptorOptions } from '~app/interceptors/cloudinary/cloudinary.types';

@Injectable()
export class CloudinaryService {
  private fileName: string;
  private maxCount: number;
  private uploader;

  constructor(@Inject(CLOUDINARY_CONFIG_PROVIDER) private config: ConfigOptions) {}

  setMulter(
    fileName: string,
    maxCount: number,
    { multerOptions = {}, cloudinaryParams = {} }: TCloudinaryFilesInterceptorOptions,
  ) {
    cloudinary.config(this.config);

    this.fileName = fileName;
    this.maxCount = maxCount;

    this.uploader = multer({
      ...multerOptions,
      storage: new CloudinaryStorage({ cloudinary, params: { ...cloudinaryParams } }),
    });
  }

  upload(ctx: HttpArgumentsHost) {
    if (!this.fileName) throw new Error('파일이름이 설정되지 않았습니다.');
    if (!this.maxCount) throw new Error('파일 등록수가 설정되지 않았습니다.');

    return new Promise((resolve, reject) => {
      this.uploader.array(this.fileName, this.maxCount)(
        ctx.getRequest(),
        ctx.getResponse(),
        (err: multer.MulterError | Error) => {
          if (err) reject(err);
          resolve(null);
        },
      );
    });
  }
}
