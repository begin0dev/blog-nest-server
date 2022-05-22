import { ICurrentUser } from '~app/decorators/user.decorator';

declare global {
  namespace Express {
    export interface Request {
      user?: ICurrentUser;
    }
  }
}
