import { apiClient } from './api-client';
import type { CalculoTotal, CalculoProveedor, IngresosEgresos } from '@/types/calculo';

export const calculosService = {
  obtenerTotales(): Promise<CalculoProveedor[]> {
    return apiClient.get<CalculoProveedor[]>('/calculos/total');
  },

  obtenerTotalGeneral(
    fechaDesde: string,
    fechaHasta: string,
    nombreProveedor?: string,
    nombreCliente?: string,
  ): Promise<CalculoTotal[]> {
    let url = `/calculos/totalgeneral?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
    if (nombreProveedor) url += `&nombreProveedor=${nombreProveedor}`;
    if (nombreCliente) url += `&nombreCliente=${nombreCliente}`;
    return apiClient.get<CalculoTotal[]>(url);
  },

  obtenerTotalesPorPeriodo(
    fechaDesde: string,
    fechaHasta: string,
    nombreProveedor?: string,
    nombreCliente?: string,
  ): Promise<CalculoProveedor[]> {
    let url = `/calculos/filtrando?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
    if (nombreProveedor) url += `&nombreProveedor=${nombreProveedor}`;
    if (nombreCliente) url += `&nombreCliente=${nombreCliente}`;
    return apiClient.get<CalculoProveedor[]>(url);
  },

  obtenerIngresosEgresos(
    fechaDesde: string,
    fechaHasta: string,
    nombreProveedor?: string,
    nombreCliente?: string,
  ): Promise<IngresosEgresos> {
    let url = `/calculos/ingresosyegresos?fechadesde=${fechaDesde}&fechahasta=${fechaHasta}`;
    if (nombreProveedor) url += `&nombreProveedor=${nombreProveedor}`;
    if (nombreCliente) url += `&nombreCliente=${nombreCliente}`;
    return apiClient.get<IngresosEgresos>(url);
  },
};
