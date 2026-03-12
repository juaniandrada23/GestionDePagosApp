export interface PagosPorMes {
  nombre_mes: string;
  cantidad_pagos: number;
}

export interface PagosPorFecha {
  fecha: string;
  cantidad_pagos: number;
}

export interface TotalPagos {
  total_pagos: number;
}

export interface TotalPagosFiltrado {
  totalPagos: number;
}

export interface CantidadPagosFechas {
  cantidad_pagos: number;
}

export interface PagosMesActual {
  PagosMesActual: number;
}

export interface PagosMesAnterior {
  PagosMesAnterior: number;
}

export interface CantidadUsuarios {
  cantidad: number;
}

export interface IngresosEgresosMes {
  nombre_mes?: string;
  fecha?: string;
  ingresos: number;
  egresos: number;
}

export interface DashboardFilterResult {
  pagos: PagosPorFecha[];
  ingresosEgresos: { fecha: string; ingresos: number; egresos: number }[];
  totalPagos: number;
}

export interface ResumenMes {
  ingresos: number;
  egresos: number;
  balance: number;
}

export interface DashboardData {
  totalPagos: number;
  pagosMesActual: number;
  pagosMesAnterior: number;
  usuarios: number;
  pagosPorAnio: PagosPorMes[];
  ingresosEgresosAnio: IngresosEgresosMes[];
  resumenMes: ResumenMes;
  balancesProveedores: ProveedorBalance[];
  mediosDePago: MedioPagoDistribucion[];
  ultimosPagos: PagoReciente[];
}

export interface ProveedorBalance {
  nombre: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

export interface MedioPagoDistribucion {
  nombre: string;
  cantidad: number;
  total: number;
}

export interface PagoReciente {
  idPago: number;
  nombre: string;
  monto: number;
  nombreMedioPago: string;
  fecha: string;
}
