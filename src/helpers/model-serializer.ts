import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';

type ClassToPlainType<T> = Pick<T, keyof T>;

class ModelSerializer<S> {
  private readonly serializer: S;

  constructor(
    private readonly modelEntity: ClassConstructor<S>,
    private readonly json: Partial<ClassToPlainType<S>>,
  ) {
    this.serializer = plainToClass(modelEntity, json, { excludeExtraneousValues: true });
  }

  public toJSON() {
    return classToPlain(this.serializer) as ClassToPlainType<S>;
  }
}

export default ModelSerializer;
