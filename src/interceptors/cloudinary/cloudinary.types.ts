import multer from 'multer';
import { Options } from 'multer-storage-cloudinary';

export type TCloudinaryFilesInterceptor = {
  cloudinaryParams?: Options['params'];
  multerOptions: Omit<multer.Options, 'storage'>;
};
