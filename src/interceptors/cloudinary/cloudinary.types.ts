import * as multer from 'multer';
import { Options } from 'multer-storage-cloudinary';

// TODO 임시...
interface CloudinaryInterface extends Options {
  params: {
    folder?: string;
    allowed_formats?: string[];
  };
}

export type TCloudinaryFilesInterceptorOptions = {
  cloudinaryParams?: CloudinaryInterface['params'];
  multerOptions?: Omit<multer.Options, 'storage'>;
};
