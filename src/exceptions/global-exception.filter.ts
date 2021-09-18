import { Response } from 'express';
import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

import { JsendStatus } from '~app/types/base.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({ status: JsendStatus.ERROR, message: exception.message });
  }
}
