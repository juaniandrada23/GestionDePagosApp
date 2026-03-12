import type { ZodSchema } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

type ValidationSuccess<T> = { success: true; data: T; errors?: undefined };
type ValidationFailure<T> = { success: false; data?: undefined; errors: FieldErrors<T> };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure<T>;

export function validateForm<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };

  const errors: FieldErrors<T> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof T;
    if (!errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}
