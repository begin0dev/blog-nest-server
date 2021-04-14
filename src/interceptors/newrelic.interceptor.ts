import * as newrelic from 'newrelic';
import { Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class NewrelicInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req.query) newrelic.addCustomAttribute('query', JSON.stringify(req.query));
    if (req.body) newrelic.addCustomAttribute('body', JSON.stringify(req.body));
    return next.handle();
  }
}
