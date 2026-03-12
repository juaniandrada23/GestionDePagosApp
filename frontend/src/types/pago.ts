export interface Pago {
  idPago: number;
  nombre: string;
  proveedor_nombre?: string;
  cliente_nombre?: string;
  monto: number;
  montoUSD: number;
  usdDelDia: number;
  nombreMedioPago: string;
  fecha: string;
  descripcion?: string;
  username?: string;
  tipo?: 'compra' | 'venta';
}

export type { CompraFormData as CompraForm } from '@/schemas';
export type { VentaFormData as VentaForm } from '@/schemas';

export interface PagoForm {
  nombre?: string;
  cliente?: string;
  monto: string;
  medioPago: string;
  fecha: string;
  usdDelDia: string;
  descripcion?: string;
}
