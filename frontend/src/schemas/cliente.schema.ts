import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').trim(),
  direccion: z.string().default(''),
  telefono: z.string().default(''),
  email: z
    .string()
    .default('')
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'El email no es valido'),
  cuit_dni: z.string().default(''),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
