import { instanceToPlain, plainToInstance, type ClassConstructor } from 'class-transformer';

type ClassToPlainType<P> = Pick<P, keyof P>;

function modelSerializer<J, C>(plain: J, cls: ClassConstructor<C>): ClassToPlainType<J>;
function modelSerializer<J, C>(plain: J[], cls: ClassConstructor<C>): ClassToPlainType<J>[];
function modelSerializer<J, C>(plain: J | J[], cls: ClassConstructor<C>) {
  const modelInstance = plainToInstance(cls, plain, { excludeExtraneousValues: true });
  return instanceToPlain(modelInstance);
}

export default modelSerializer;
