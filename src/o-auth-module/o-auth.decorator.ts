import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RedirectUrl = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const res = ctx.switchToHttp().getResponse();
  return res.locals.redirectUrl;
});

export const ErrorMessage = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const res = ctx.switchToHttp().getResponse();
  return res.locals.error;
});

export const AccessToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.query.access_token;
});
