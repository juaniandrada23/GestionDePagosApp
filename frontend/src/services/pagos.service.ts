import { apiClient } from './apiClient';
import type { Pago, PagoForm, CompraForm, VentaForm } from '@/types/pago';

export const pagosService = {
  obtenerTodos(filters?: { tipo?: string }): Promise<Pago[]> {
    const query = new URLSearchParams();
    if (filters?.tipo) query.set('tipo', filters.tipo);
    const qs = query.toString();
    return apiClient.get<Pago[]>(`/pagos${qs ? `?${qs}` : ''}`);
  },

  obtenerPorUsuario(userId: string): Promise<Pago[]> {
    return apiClient.get<Pago[]>(`/pagos/${userId}`);
  },

  crearCompra(userId: string, compra: CompraForm): Promise<void> {
    return apiClient.post(`/pagos/compras/${userId}`, compra);
  },

  crearVenta(userId: string, venta: VentaForm): Promise<void> {
    return apiClient.post(`/pagos/ventas/${userId}`, venta);
  },

  actualizar(idPago: number, pago: PagoForm): Promise<void> {
    return apiClient.put(`/pagos/${idPago}`, pago);
  },

  eliminar(idPago: number): Promise<void> {
    return apiClient.delete(`/pagos/${idPago}`);
  },

  filtrar(params: {
    fechadesde?: string;
    fechahasta?: string;
    nombreProveedor?: string;
    usuarioFiltrado?: string;
    tipo?: string;
  }): Promise<Pago[]> {
    const query = new URLSearchParams();
    if (params.fechadesde) query.set('fechadesde', params.fechadesde);
    if (params.fechahasta) query.set('fechahasta', params.fechahasta);
    if (params.nombreProveedor) query.set('nombreProveedor', params.nombreProveedor);
    if (params.usuarioFiltrado) query.set('usuarioFiltrado', params.usuarioFiltrado);
    if (params.tipo) query.set('tipo', params.tipo);
    return apiClient.get<Pago[]>(`/pagos/filtrando?${query.toString()}`);
  },
};
