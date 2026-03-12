import { apiClient } from './api-client';
import type { Material, MovimientoStock, CategoriaMaterial, Unidad } from '@/types/material';

export const materialesService = {
  obtenerTodos(filters?: {
    activo?: boolean;
    categoria_id?: string;
    busqueda?: string;
  }): Promise<Material[]> {
    const query = new URLSearchParams();
    if (filters?.activo !== undefined) query.set('activo', String(filters.activo));
    if (filters?.categoria_id) query.set('categoria_id', filters.categoria_id);
    if (filters?.busqueda) query.set('busqueda', filters.busqueda);
    const qs = query.toString();
    return apiClient.get<Material[]>(`/materiales${qs ? `?${qs}` : ''}`);
  },

  obtenerPorId(id: number): Promise<Material> {
    return apiClient.get<Material>(`/materiales/${id}`);
  },

  crear(data: Record<string, unknown>): Promise<Material> {
    return apiClient.post<Material>('/materiales', data);
  },

  actualizar(id: number, data: Record<string, unknown>): Promise<Material> {
    return apiClient.put<Material>(`/materiales/${id}`, data);
  },

  eliminar(id: number): Promise<void> {
    return apiClient.delete(`/materiales/${id}`);
  },

  obtenerMovimientos(materialId: number): Promise<MovimientoStock[]> {
    return apiClient.get<MovimientoStock[]>(`/materiales/${materialId}/movimientos`);
  },

  registrarMovimiento(
    materialId: number,
    data: { cantidad: number; tipo: string; motivo?: string },
  ): Promise<MovimientoStock> {
    return apiClient.post<MovimientoStock>(`/materiales/${materialId}/movimientos`, data);
  },

  obtenerStockBajo(): Promise<Material[]> {
    return apiClient.get<Material[]>('/materiales/alertas/stock-bajo');
  },

  obtenerCategorias(): Promise<CategoriaMaterial[]> {
    return apiClient.get<CategoriaMaterial[]>('/materiales/categorias');
  },

  crearCategoria(nombre: string): Promise<CategoriaMaterial> {
    return apiClient.post<CategoriaMaterial>('/materiales/categorias', { nombre });
  },

  obtenerUnidades(): Promise<Unidad[]> {
    return apiClient.get<Unidad[]>('/materiales/unidades');
  },
};
