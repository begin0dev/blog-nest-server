import { Expose, Transform } from 'class-transformer';

export class BaseSerializer {
  @Expose()
  @Transform((value) => {
    return typeof value.obj._id === 'string' ? value.obj._id : value.obj._id.toString();
  })
  _id: string;
}
