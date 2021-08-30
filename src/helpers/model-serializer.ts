import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';

type ClassToPlainType<T> = Pick<T, keyof T>;

class ModelSerializer<E, J> {
  private readonly model: E;

  constructor(private readonly modelEntity: ClassConstructor<E>, private readonly json: J) {
    this.model = plainToClass(modelEntity, json, { excludeExtraneousValues: true });
  }

  public toJSON() {
    return classToPlain(this.model) as ClassToPlainType<E>;
  }
}

export default ModelSerializer;
