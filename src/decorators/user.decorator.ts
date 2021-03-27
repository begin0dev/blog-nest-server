import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  _id: string;
  displayName: string;
  profileImageURL?: string;
  isAdmin: boolean;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
