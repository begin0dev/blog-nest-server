import * as multer from 'multer';
import { Options } from 'multer-storage-cloudinary';

export type TCloudinaryFilesInterceptorOptions = {
  cloudinaryParams?: Options['params'];
  multerOptions?: Omit<multer.Options, 'storage'>;
};
