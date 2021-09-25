import { Expose, Transform } from 'class-transformer';

export class BaseSerializer {
  @Expose()
  @Transform((value) => {
    const { _id } = value.obj;
    if (typeof _id === 'string') return _id;
    return _id.toString();
  })
  _id: string;
}
