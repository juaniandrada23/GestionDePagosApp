import { z } from 'zod';

export const registerStep1Schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').trim(),
  apellido: z.string().min(1, 'El apellido es requerido').trim(),
  email: z.string().default(''),
  telefono: z.string().default(''),
  dni: z.string().default(''),
  fecha_nacimiento: z.string().default(''),
});

export const registerStep2Schema = z.object({
  empresa_nombre: z.string().min(1, 'El nombre de la empresa es requerido').trim(),
  empresa_direccion: z.string().default(''),
  empresa_telefono: z.string().default(''),
  empresa_email: z.string().default(''),
  empresa_cuit: z.string().default(''),
  empresa_rubro: z.string().default(''),
});

export const registerStep3Schema = z
  .object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').trim(),
    password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme la contrasena'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  });

export const registerSchema = registerStep1Schema.merge(registerStep2Schema).merge(
  z.object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres').trim(),
    password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme la contrasena'),
  }),
);

export type RegisterFormData = z.infer<typeof registerSchema>;
