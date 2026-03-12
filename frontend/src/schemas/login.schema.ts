import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contrasena es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
