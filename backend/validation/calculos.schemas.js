const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 365;

const isValidDate = (str) => {
  if (!DATE_REGEX.test(str)) return false;
  const d = new Date(str + 'T00:00:00');
  return !isNaN(d.getTime()) && d.toISOString().startsWith(str);
};

const validateDateRange = (desde, hasta) => {
  if (!isValidDate(desde)) return 'fechaDesde tiene formato inválido (YYYY-MM-DD)';
  if (!isValidDate(hasta)) return 'fechaHasta tiene formato inválido (YYYY-MM-DD)';
  if (desde > hasta) return 'La fecha desde no puede ser mayor que la fecha hasta';
  const diffMs = new Date(hasta) - new Date(desde);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > MAX_RANGE_DAYS)
    return `El rango de fechas no puede superar los ${MAX_RANGE_DAYS} días`;
  return null;
};

const filtrarCalculos = (data) => {
  const { fechaDesde, fechaHasta, nombreProveedor, nombreCliente } = data || {};
  if (!fechaDesde && !fechaHasta && !nombreProveedor && !nombreCliente) {
    return {
      error:
        'Debes proporcionar al menos uno de los parámetros: fechadesde, fechahasta, nombreProveedor o nombreCliente',
    };
  }
  if (fechaDesde && !isValidDate(fechaDesde)) {
    return { error: 'fechaDesde tiene formato inválido (YYYY-MM-DD)' };
  }
  if (fechaHasta && !isValidDate(fechaHasta)) {
    return { error: 'fechaHasta tiene formato inválido (YYYY-MM-DD)' };
  }
  if (fechaDesde && fechaHasta) {
    const rangeError = validateDateRange(fechaDesde, fechaHasta);
    if (rangeError) return { error: rangeError };
  }
  return { value: { fechaDesde, fechaHasta, nombreProveedor, nombreCliente } };
};

const ingresosYEgresos = (data) => {
  const { fechadesde, fechahasta, nombreProveedor, nombreCliente } = data || {};
  if (!fechadesde || !fechahasta) {
    return { error: 'Debes proporcionar los parámetros fechadesde y fechahasta.' };
  }
  const rangeError = validateDateRange(fechadesde, fechahasta);
  if (rangeError) return { error: rangeError };
  return { value: { fechadesde, fechahasta, nombreProveedor, nombreCliente } };
};

module.exports = { filtrarCalculos, ingresosYEgresos };
