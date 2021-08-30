import { Expose, Transform } from 'class-transformer';

export class BaseEntity {
  @Expose()
  @Transform(
    ({ obj }) => {
      if (!obj._id) return undefined;
      return typeof obj._id !== 'string' && obj._id.toHexString ? obj._id.toHexString() : obj._id;
    },
    { toClassOnly: true },
  )
  _id: string;
}
