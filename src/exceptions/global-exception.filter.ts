import * as newrelic from 'newrelic';
import { Response } from 'express';
import { Catch, HttpException, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';

import { JsendStatus } from '~app/types/jsend.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === 500 && exception.stack) newrelic.noticeError(exception);

    res.status(status).json({ status: JsendStatus.ERROR, message: exception.message });
  }
}
