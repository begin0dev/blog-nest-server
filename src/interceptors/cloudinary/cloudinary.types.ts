import * as multer from 'multer';
import { UploadApiOptions } from 'cloudinary';

export type TCloudinaryFilesInterceptorOptions = {
  cloudinaryParams?: UploadApiOptions;
  multerOptions?: Omit<multer.Options, 'storage'>;
};
