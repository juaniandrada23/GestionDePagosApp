import { apiClient } from './apiClient';
import type { Cliente, ClienteNombre } from '@/types/cliente';

export const clientesService = {
  obtenerTodos(filters?: { activo?: boolean; busqueda?: string }): Promise<Cliente[]> {
    const query = new URLSearchParams();
    if (filters?.activo !== undefined) query.set('activo', String(filters.activo));
    if (filters?.busqueda) query.set('busqueda', filters.busqueda);
    const qs = query.toString();
    return apiClient.get<Cliente[]>(`/clientes${qs ? `?${qs}` : ''}`);
  },

  obtenerPorId(id: number): Promise<Cliente> {
    return apiClient.get<Cliente>(`/clientes/${id}`);
  },

  obtenerNombres(): Promise<ClienteNombre[]> {
    return apiClient.get<ClienteNombre[]>('/clientes/nombres');
  },

  crear(data: Record<string, unknown>): Promise<Cliente> {
    return apiClient.post<Cliente>('/clientes', data);
  },

  actualizar(id: number, data: Record<string, unknown>): Promise<Cliente> {
    return apiClient.put<Cliente>(`/clientes/${id}`, data);
  },

  eliminar(id: number): Promise<void> {
    return apiClient.delete(`/clientes/${id}`);
  },
};
