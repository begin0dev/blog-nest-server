import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class BaseSerializer {
  @Expose()
  @Transform((value) => value.toString())
  _id: ObjectId;
}
