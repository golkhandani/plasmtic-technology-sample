import { ClassConstructor, plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

export async function validateAndTransformRequest<T>(data: any, cls: ClassConstructor<T>): Promise<{ data: T }> {
  const classData = plainToClass(cls, data);
  await validateOrReject(classData as any);
  return { data: classData };
  // try {

  //   return { data: classData, error: null }
  // } catch (error) {
  //   return { data: null, error: error }
  // }
}