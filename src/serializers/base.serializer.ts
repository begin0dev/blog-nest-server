import { Expose, Transform } from 'class-transformer';

export class BaseSerializer {
  @Expose()
  @Transform((value) => value.toString())
  _id: string;
}
