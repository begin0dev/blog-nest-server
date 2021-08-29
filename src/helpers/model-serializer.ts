import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';

type ClassToPlainType<T> = Pick<T, keyof T>;

class ModelSerializer<E, J> {
  constructor(private readonly modelEntity: ClassConstructor<E>, private readonly json: J) {}

  public asJSON() {
    const model: E = plainToClass(this.modelEntity, this.json, { excludeExtraneousValues: true });
    return classToPlain(model) as ClassToPlainType<E>;
  }
}

export default ModelSerializer;
