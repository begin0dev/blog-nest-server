import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';

import { CloudinaryFilesInterceptor } from '~app/interceptors/cloudinary/cloudinary-files.interceptor';
import { AuthGuard, authTarget } from '~app/guards/auth.guard';

@ApiTags('v1/commons')
@Controller('v1/commons')
export class CommonsController {
  @Get('health')
  health() {
    return { status: 'running' };
  }

  @Post('images')
  @UseGuards(AuthGuard(authTarget.USER))
  @UseInterceptors(
    CloudinaryFilesInterceptor('images', 3, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cloudinaryParams: { folder: 'images', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
      multerOptions: { limits: { fileSize: 1024 * 1024 * 3 } },
    }),
  )
  images(@UploadedFiles() files: Array<Express.Multer.File>) {
    return { imageUrls: files.map((file) => file.path) };
  }
}
