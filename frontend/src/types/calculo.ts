export interface CalculoTotal {
  Ingresos: number;
  IngresosUSD: number;
  Egresos: number;
  EgresosUSD: number;
  MontoTotal: number;
  MontoTotalUSD: number;
}

export interface CalculoProveedor {
  NombreProveedor: string;
  tipo: 'compra' | 'venta';
  entidad: 'proveedor' | 'cliente';
  Ingresos: number;
  IngresosUSD: number;
  Egresos: number;
  EgresosUSD: number;
  MontoTotal: number;
  MontoTotalUSD: number;
}

export interface IngresosEgresos {
  Ingresos: number;
  Egresos: number;
}
