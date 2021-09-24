import { ClassConstructor, plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

export async function validateAndTransformRequest<T>(data: any, cls: ClassConstructor<T>): Promise<{ data: T, error: any }> {
  const classData = plainToClass(cls, data);
  try {
    await validateOrReject(classData as any);
    return { data: classData, error: null }
  } catch (error) {
    return { data: null, error: error }
  }
}