import { throwError, Observable, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import {
  Injectable,
  RequestTimeoutException,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { JsendStatus } from '~app/types/base.types';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({ status: JsendStatus.SUCCESS, data })),
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) return throwError(new RequestTimeoutException());
        return throwError(err);
      }),
    );
  }
}
