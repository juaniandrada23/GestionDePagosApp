import { apiClient } from './api-client';
import type { Presupuesto, PdfData } from '@/types/presupuesto';

export const presupuestosService = {
  obtenerTodos(filters?: {
    estado?: string;
    cliente_id?: string;
    fechadesde?: string;
    fechahasta?: string;
  }): Promise<Presupuesto[]> {
    const query = new URLSearchParams();
    if (filters?.estado) query.set('estado', filters.estado);
    if (filters?.cliente_id) query.set('cliente_id', filters.cliente_id);
    if (filters?.fechadesde) query.set('fechadesde', filters.fechadesde);
    if (filters?.fechahasta) query.set('fechahasta', filters.fechahasta);
    const qs = query.toString();
    return apiClient.get<Presupuesto[]>(`/presupuestos${qs ? `?${qs}` : ''}`);
  },

  obtenerPorId(id: number): Promise<Presupuesto> {
    return apiClient.get<Presupuesto>(`/presupuestos/${id}`);
  },

  crear(data: Record<string, unknown>): Promise<Presupuesto> {
    return apiClient.post<Presupuesto>('/presupuestos', data);
  },

  actualizar(id: number, data: Record<string, unknown>): Promise<Presupuesto> {
    return apiClient.put<Presupuesto>(`/presupuestos/${id}`, data);
  },

  eliminar(id: number): Promise<void> {
    return apiClient.delete(`/presupuestos/${id}`);
  },

  cambiarEstado(id: number, estado: string): Promise<Presupuesto> {
    return apiClient.patch<Presupuesto>(`/presupuestos/${id}/estado`, { estado });
  },

  aceptar(
    id: number,
    data: { medioPago: string; usdDelDia: number },
  ): Promise<{ presupuestoId: number; pagoId: number }> {
    return apiClient.post(`/presupuestos/${id}/aceptar`, data);
  },

  obtenerDatosPdf(id: number): Promise<PdfData> {
    return apiClient.get<PdfData>(`/presupuestos/${id}/pdf-data`);
  },

  obtenerEstadisticas(): Promise<{ estado: string; cantidad: number }[]> {
    return apiClient.get(`/presupuestos/stats`);
  },
};
