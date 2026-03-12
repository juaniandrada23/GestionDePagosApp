export type { RegisterFormData as RegisterForm } from '@/schemas';

export interface Empresa {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo?: string;
  cuit?: string;
  rubro?: string;
}
