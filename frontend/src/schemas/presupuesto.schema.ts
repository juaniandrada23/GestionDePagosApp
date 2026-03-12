import { z } from 'zod';

const presupuestoItemSchema = z.object({
  material_id: z.string().min(1, 'Seleccione un material'),
  cantidad: z
    .string()
    .min(1, 'La cantidad es requerida')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'La cantidad debe ser mayor a 0'),
  precio_unitario: z
    .string()
    .min(1, 'El precio es requerido')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'El precio debe ser mayor a 0'),
});

export type PresupuestoItemFormData = z.infer<typeof presupuestoItemSchema>;

export const presupuestoSchema = z.object({
  cliente_id: z.string().min(1, 'Seleccione un cliente'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  fecha_validez: z.string().default(''),
  observaciones: z.string().default(''),
  descuento_porcentaje: z.string().default('0'),
  items: z.array(presupuestoItemSchema).min(1, 'Debe agregar al menos un item'),
});

export type PresupuestoFormData = z.infer<typeof presupuestoSchema>;

export const aceptarPresupuestoSchema = z.object({
  medioPago: z.string().min(1, 'El medio de pago es requerido'),
  usdDelDia: z.string().min(1, 'El dolar del dia es requerido'),
});

export type AceptarPresupuestoFormData = z.infer<typeof aceptarPresupuestoSchema>;
