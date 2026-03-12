export interface Cliente {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  cuit_dni?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export type { ClienteFormData as ClienteForm } from '@/schemas';

export interface ClienteNombre {
  id: number;
  nombre: string;
}
