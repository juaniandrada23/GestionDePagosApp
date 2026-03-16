export interface Proveedor {
  id: number;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  cuit_dni: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProveedorNombre {
  id: number;
  nombre: string;
}

export interface ProveedorForm {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  cuit_dni?: string;
}
