import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';

type ClassToPlainType<T> = Pick<T, keyof T>;

class ModelSerializer<E> {
  constructor(private readonly modelEntity: ClassConstructor<E>, private readonly json: Partial<E>) {}

  public asJSON() {
    const model: E = plainToClass(this.modelEntity, this.json, { excludeExtraneousValues: true });
    return classToPlain(model) as ClassToPlainType<E>;
  }
}

export default ModelSerializer;
