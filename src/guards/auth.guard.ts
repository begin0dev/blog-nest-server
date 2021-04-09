import { CanActivate, ExecutionContext, Injectable, mixin } from '@nestjs/common';

export const authTarget = {
  VISITOR: 'visitor',
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type TAuthTarget = typeof authTarget[keyof typeof authTarget];

export function AuthGuard(targets: TAuthTarget[]) {
  @Injectable()
  class MixinAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const { user } = req;
      if (targets.includes(authTarget.VISITOR) && user) return false;
      if (targets.includes(authTarget.USER) && !user) return false;
      if (targets.includes(authTarget.ADMIN) && !user?.isAdmin) return false;
      return true;
    }
  }
  return mixin(MixinAuthGuard);
}
