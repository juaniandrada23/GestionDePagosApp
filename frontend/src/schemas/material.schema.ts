import { z } from 'zod';

export const materialSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').trim(),
  descripcion: z.string().default(''),
  codigo: z.string().default(''),
  categoria_id: z.string().default(''),
  precio_venta: z.string().min(1, 'El precio de venta es requerido'),
  precio_costo: z.string().default(''),
  stock_actual: z.string().default('0'),
  stock_minimo: z.string().default('0'),
  unidad_id: z.string().min(1, 'La unidad es requerida'),
});

export type MaterialFormData = z.infer<typeof materialSchema>;

export const movimientoSchema = z.object({
  cantidad: z
    .string()
    .min(1, 'La cantidad es requerida')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'La cantidad debe ser mayor a 0'),
  tipo: z.enum(['entrada', 'salida', 'ajuste']),
  motivo: z.string().default(''),
});

export type MovimientoFormData = z.infer<typeof movimientoSchema>;
