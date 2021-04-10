import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as newrelic from 'newrelic';

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest();
    newrelic.addCustomAttribute('query', JSON.stringify(req.query || {}));
    newrelic.addCustomAttribute('body', JSON.stringify(req.body || {}));
    return next.handle();
  }
}
