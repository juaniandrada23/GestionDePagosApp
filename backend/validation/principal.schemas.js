const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 365;

const isValidDate = (str) => {
  if (!DATE_REGEX.test(str)) return false;
  const d = new Date(str + 'T00:00:00');
  return !isNaN(d.getTime()) && d.toISOString().startsWith(str);
};

const validateDateRange = (desde, hasta) => {
  if (!isValidDate(desde)) return 'fechadesde tiene formato inválido (YYYY-MM-DD)';
  if (!isValidDate(hasta)) return 'fechahasta tiene formato inválido (YYYY-MM-DD)';
  if (desde > hasta) return 'La fecha desde no puede ser mayor que la fecha hasta';
  const diffMs = new Date(hasta) - new Date(desde);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > MAX_RANGE_DAYS)
    return `El rango de fechas no puede superar los ${MAX_RANGE_DAYS} días`;
  return null;
};

const fechaRange = (data) => {
  const { fechadesde, fechahasta } = data || {};
  if (!fechadesde && !fechahasta) {
    return { error: 'Debes proporcionar al menos uno de los parámetros: fechadesde o fechahasta' };
  }
  if (fechadesde && !isValidDate(fechadesde)) {
    return { error: 'fechadesde tiene formato inválido (YYYY-MM-DD)' };
  }
  if (fechahasta && !isValidDate(fechahasta)) {
    return { error: 'fechahasta tiene formato inválido (YYYY-MM-DD)' };
  }
  if (fechadesde && fechahasta) {
    const rangeError = validateDateRange(fechadesde, fechahasta);
    if (rangeError) return { error: rangeError };
  }
  return { value: { fechadesde, fechahasta } };
};

const anioFiltrado = (data) => {
  const añoFiltrado = data?.['añoFiltrado'];
  if (!añoFiltrado) {
    return { error: 'Debes proporcionar el año de filtrado' };
  }
  const year = parseInt(añoFiltrado, 10);
  if (isNaN(year) || year < 2000 || year > 2100) {
    return { error: 'El año de filtrado debe estar entre 2000 y 2100' };
  }
  return { value: { añoFiltrado } };
};

const filtrarDashboard = (data) => {
  const { desde, hasta } = data || {};
  if (!desde || !hasta) {
    return { error: 'Los parámetros desde y hasta son requeridos' };
  }
  const rangeError = validateDateRange(desde, hasta);
  if (rangeError) return { error: rangeError };
  return { value: { desde, hasta } };
};

module.exports = { fechaRange, anioFiltrado, filtrarDashboard };
