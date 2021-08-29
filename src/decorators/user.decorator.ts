import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ICurrentUser {
  _id: string;
  displayName: string;
  profileImageUrl?: string;
  isAdmin: boolean;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
