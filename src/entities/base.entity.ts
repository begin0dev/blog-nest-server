import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class BaseEntity {
  @Expose()
  @Transform((value) => value.toString())
  _id: ObjectId;
}
