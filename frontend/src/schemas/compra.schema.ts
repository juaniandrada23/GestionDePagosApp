import { z } from 'zod';

export const compraSchema = z.object({
  nombre: z.string().default(''),
  cliente: z.string().default(''),
  monto: z.string().min(1, 'El monto es requerido'),
  medioPago: z.string().min(1, 'El medio de pago es requerido'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  usdDelDia: z.string().min(1, 'El dolar del dia es requerido'),
  descripcion: z.string().default(''),
});

export type CompraFormData = z.infer<typeof compraSchema>;
