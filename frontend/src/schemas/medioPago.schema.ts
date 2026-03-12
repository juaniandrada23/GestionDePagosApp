import { z } from 'zod';

export const medioPagoSchema = z.object({
  nombre: z.string().min(1, 'El nombre del medio de pago es requerido').trim(),
});

export type MedioPagoFormData = z.infer<typeof medioPagoSchema>;
