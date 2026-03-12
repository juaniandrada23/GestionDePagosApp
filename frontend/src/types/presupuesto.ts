export type EstadoPresupuesto = 'borrador' | 'enviado' | 'aceptado' | 'rechazado';

export interface Presupuesto {
  id: number;
  numero: number;
  cliente_id: number;
  cliente_nombre: string;
  cliente_direccion?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  cliente_cuit_dni?: string;
  fecha: string;
  fecha_validez?: string;
  estado: EstadoPresupuesto;
  observaciones?: string;
  subtotal: number;
  descuento_porcentaje: number;
  total: number;
  pago_id?: number;
  usuario_id: number;
  items?: PresupuestoItem[];
  created_at: string;
  updated_at: string;
}

export interface PresupuestoItem {
  id?: number;
  presupuesto_id?: number;
  material_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  material_nombre: string;
  material_codigo?: string;
  material_unidad: string;
}

export type { PresupuestoFormData as PresupuestoForm } from '@/schemas';
export type { PresupuestoItemFormData as PresupuestoItemForm } from '@/schemas';
export type { AceptarPresupuestoFormData as AceptarPresupuestoForm } from '@/schemas';

export interface PdfData {
  presupuesto: Presupuesto;
  empresa: {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    logo?: string;
    cuit?: string;
    rubro?: string;
  };
}
