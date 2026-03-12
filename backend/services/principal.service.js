const pagosRepo = require('../repositories/pagos.repository');
const usuariosRepo = require('../repositories/usuarios.repository');

const obtenerPagosPorRangoFechas = (empresaId, fechadesde, fechahasta) =>
  pagosRepo.contarPorRangoFechas(empresaId, fechadesde, fechahasta);

const obtenerConteoPagosEnRango = (empresaId, fechadesde, fechahasta) =>
  pagosRepo.contarTotalEnRango(empresaId, fechadesde, fechahasta);

const obtenerConteoTotal = (empresaId) => pagosRepo.contarTotal(empresaId);

const obtenerPagosPorAnioActual = (empresaId) => pagosRepo.contarPorAnio(empresaId);

const obtenerPagosPorAnio = (empresaId, year) => pagosRepo.contarPorAnio(empresaId, year);

const obtenerTotalPorAnio = (empresaId, year) => pagosRepo.totalPorAnio(empresaId, year);

const obtenerConteosMensuales = (empresaId) => pagosRepo.conteosMensuales(empresaId);

const obtenerConteoUsuarios = (empresaId) => usuariosRepo.contar(empresaId);

const obtenerGraficoIngresosEgresos = (empresaId, fechadesde, fechahasta) =>
  pagosRepo.ingresosEgresosPorRangoFechas(empresaId, fechadesde, fechahasta);

const obtenerIngresosEgresosAnioActual = (empresaId) => pagosRepo.ingresosEgresosPorAnio(empresaId);

const obtenerIngresosEgresosPorAnio = (empresaId, year) =>
  pagosRepo.ingresosEgresosPorAnio(empresaId, year);

const filtrarDashboard = (empresaId, desde, hasta) =>
  pagosRepo.filtrarDashboard(empresaId, desde, hasta);

const obtenerResumenMesActual = (empresaId) => pagosRepo.resumenMesActual(empresaId);
const obtenerBalancesProveedores = (empresaId) => pagosRepo.balancesProveedores(empresaId);
const obtenerDistribucionMediosPago = (empresaId) => pagosRepo.distribucionMediosPago(empresaId);
const obtenerPagosRecientes = (empresaId, limit) => pagosRepo.pagosRecientes(empresaId, limit);

const obtenerDashboard = async (empresaId) => {
  const [dashData, usuarios] = await Promise.all([
    pagosRepo.obtenerDashboard(empresaId),
    usuariosRepo.contar(empresaId),
  ]);
  return {
    ...dashData,
    usuarios: usuarios[0]?.cantidad || 0,
  };
};

module.exports = {
  obtenerPagosPorRangoFechas,
  obtenerConteoPagosEnRango,
  obtenerConteoTotal,
  obtenerPagosPorAnioActual,
  obtenerPagosPorAnio,
  obtenerTotalPorAnio,
  obtenerConteosMensuales,
  obtenerConteoUsuarios,
  obtenerGraficoIngresosEgresos,
  obtenerIngresosEgresosAnioActual,
  obtenerIngresosEgresosPorAnio,
  filtrarDashboard,
  obtenerResumenMesActual,
  obtenerBalancesProveedores,
  obtenerDistribucionMediosPago,
  obtenerPagosRecientes,
  obtenerDashboard,
};
