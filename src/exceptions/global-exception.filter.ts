import { Response } from 'express';
import { Catch, HttpException, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

import { JsendStatus } from '~app/types/base.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({ status: JsendStatus.ERROR, message: exception.message });
  }
}
