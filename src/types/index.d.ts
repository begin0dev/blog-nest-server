import { IUserJson } from '@app/schemas/user.schema';

declare global {
  namespace Express {
    export interface Request {
      user?: IUserJson;
    }
  }
}

export {};
