import { apiClient } from './api-client';
import type { MedioPago } from '@/types/medioPago';

export const mediosPagoService = {
  obtenerTodos(): Promise<MedioPago[]> {
    return apiClient.get<MedioPago[]>('/mediodepago/nombremediopago');
  },

  crear(nombreMedioPago: string): Promise<MedioPago> {
    return apiClient.post<MedioPago>('/mediodepago/agregarmediopago', { nombreMedioPago });
  },

  actualizar(nombre: string, nuevoNombre: string): Promise<void> {
    return apiClient.put(`/mediodepago/actualizarmediopago/${nombre}`, {
      nuevoNombreMedioPago: nuevoNombre,
    });
  },

  eliminar(nombre: string): Promise<void> {
    return apiClient.delete(`/mediodepago/borrarmediopago/${nombre}`);
  },
};
