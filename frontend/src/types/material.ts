export interface Material {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  categoria_id?: number;
  categoria_nombre?: string;
  precio_venta: number;
  precio_costo: number;
  stock_actual: number;
  stock_minimo: number;
  unidad_id: number;
  unidad_nombre: string;
  unidad_abreviatura: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export type { MaterialFormData as MaterialForm } from '@/schemas';

export interface MovimientoStock {
  id: number;
  material_id: number;
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  motivo?: string;
  fecha: string;
  usuario_id: number;
  username: string;
  stock_resultante: number;
}

export type { MovimientoFormData as MovimientoForm } from '@/schemas';

export interface CategoriaMaterial {
  id: number;
  nombre: string;
}

export interface Unidad {
  id: number;
  nombre: string;
  abreviatura: string;
}
