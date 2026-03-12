import { apiClient } from './api-client';
import type { Proveedor, ProveedorNombre, ProveedorForm } from '@/types/proveedor';

export const proveedoresService = {
  obtenerTodos(): Promise<Proveedor[]> {
    return apiClient.get<Proveedor[]>('/proveedores');
  },

  obtenerNombres(): Promise<ProveedorNombre[]> {
    return apiClient.get<ProveedorNombre[]>('/proveedores/nombreprov');
  },

  crear(proveedor: ProveedorForm): Promise<Proveedor> {
    return apiClient.post<Proveedor>('/proveedores', proveedor);
  },

  actualizar(id: number, proveedor: ProveedorForm): Promise<void> {
    return apiClient.put(`/proveedores/${id}`, proveedor);
  },

  eliminar(id: number): Promise<void> {
    return apiClient.delete(`/proveedores/${id}`);
  },
};
