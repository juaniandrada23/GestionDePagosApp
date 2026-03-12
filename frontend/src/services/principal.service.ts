import { apiClient } from './api-client';
import type {
  PagosPorMes,
  PagosPorFecha,
  TotalPagos,
  TotalPagosFiltrado,
  CantidadPagosFechas,
  PagosMesActual,
  PagosMesAnterior,
  CantidadUsuarios,
  IngresosEgresosMes,
  DashboardFilterResult,
  DashboardData,
  ResumenMes,
  MedioPagoDistribucion,
  PagoReciente,
} from '@/types/principal';

export const principalService = {
  obtenerDashboard(): Promise<DashboardData> {
    return apiClient.get<DashboardData>('/principal/dashboard');
  },

  obtenerContando(): Promise<TotalPagos[]> {
    return apiClient.get<TotalPagos[]>('/principal/contando');
  },

  obtenerPagosPorAnio(): Promise<PagosPorMes[]> {
    return apiClient.get<PagosPorMes[]>('/principal/pagosporanio');
  },

  obtenerPagosPorAnioFiltrado(año: string): Promise<PagosPorMes[]> {
    return apiClient.get<PagosPorMes[]>(`/principal/pagosporaniofiltrado?añoFiltrado=${año}`);
  },

  obtenerTotalPagoFiltradoPorAnio(año: string): Promise<TotalPagosFiltrado[]> {
    return apiClient.get<TotalPagosFiltrado[]>(
      `/principal/totalpagofiltradoporanio?añoFiltrado=${año}`,
    );
  },

  obtenerFiltrando(fechadesde: string, fechahasta: string): Promise<PagosPorFecha[]> {
    return apiClient.get<PagosPorFecha[]>(
      `/principal/filtrando?fechadesde=${fechadesde}&fechahasta=${fechahasta}`,
    );
  },

  obtenerFiltrandoCantidad(fechadesde: string, fechahasta: string): Promise<CantidadPagosFechas[]> {
    return apiClient.get<CantidadPagosFechas[]>(
      `/principal/filtrandocantidad?fechadesde=${fechadesde}&fechahasta=${fechahasta}`,
    );
  },

  obtenerMesActual(): Promise<PagosMesActual[]> {
    return apiClient.get<PagosMesActual[]>('/principal/mesactual');
  },

  obtenerMesAnterior(): Promise<PagosMesAnterior[]> {
    return apiClient.get<PagosMesAnterior[]>('/principal/mesanterior');
  },

  obtenerUsuarios(): Promise<CantidadUsuarios[]> {
    return apiClient.get<CantidadUsuarios[]>('/principal/usuarios');
  },

  obtenerIngresosEgresosAnioActual(): Promise<IngresosEgresosMes[]> {
    return apiClient.get<IngresosEgresosMes[]>('/principal/ingresosegresosanioactual');
  },

  obtenerIngresosEgresosGrafico(
    fechadesde: string,
    fechahasta: string,
  ): Promise<IngresosEgresosMes[]> {
    return apiClient.get<IngresosEgresosMes[]>(
      `/principal/ingresosegresosgrafico?fechadesde=${fechadesde}&fechahasta=${fechahasta}`,
    );
  },

  obtenerIngresosEgresosPorAnioFiltrado(año: string): Promise<IngresosEgresosMes[]> {
    return apiClient.get<IngresosEgresosMes[]>(
      `/principal/ingresosegresostotalpagofiltradoporanio?añoFiltrado=${año}`,
    );
  },

  filtrarDashboard(desde: string, hasta: string): Promise<DashboardFilterResult> {
    return apiClient.get<DashboardFilterResult>(`/principal/filtrar?desde=${desde}&hasta=${hasta}`);
  },

  obtenerResumenMes(): Promise<ResumenMes> {
    return apiClient.get<ResumenMes>('/principal/resumenmes');
  },

  obtenerMediosDePago(): Promise<MedioPagoDistribucion[]> {
    return apiClient.get<MedioPagoDistribucion[]>('/principal/mediosdepago');
  },

  obtenerUltimosPagos(): Promise<PagoReciente[]> {
    return apiClient.get<PagoReciente[]>('/principal/ultimospagos');
  },
};
