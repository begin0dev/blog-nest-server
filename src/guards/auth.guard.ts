import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';

export const authTarget = {
  VISITOR: 'visitor',
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type TAuthTarget = typeof authTarget[keyof typeof authTarget];

export function AuthGuard(target: TAuthTarget): Type<CanActivate> {
  @Injectable()
  class MixinAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const { user } = context.switchToHttp().getRequest();
      if (target === authTarget.VISITOR && user) return false;
      if (target === authTarget.USER && !user) return false;
      if (target === authTarget.ADMIN && !user?.isAdmin) return false;
      return true;
    }
  }
  return mixin(MixinAuthGuard);
}
