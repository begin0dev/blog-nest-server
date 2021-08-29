import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ObjectId } from 'mongoose';

export interface ICurrentUser {
  _id: ObjectId | string;
  displayName: string;
  profileImageUrl?: string;
  isAdmin: boolean;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
