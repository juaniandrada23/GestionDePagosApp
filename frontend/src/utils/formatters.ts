const MESES_CORTOS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export const formatMonto = (value: number): string => {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('es-AR');
  return value < 0 ? `-$ ${formatted}` : `$ ${formatted}`;
};

export const formatFecha = (fecha: string): string => {
  const [y, m, d] = fecha.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
};

export const formatFechaCorta = (fecha: string): string => {
  const parts = fecha.split('T')[0].split('-');
  if (parts.length !== 3) return fecha;
  return `${parts[2]} ${MESES_CORTOS[parseInt(parts[1], 10) - 1]}`;
};
