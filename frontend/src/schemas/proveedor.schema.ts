import { z } from 'zod';

export const proveedorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').trim(),
});

export type ProveedorFormData = z.infer<typeof proveedorSchema>;
