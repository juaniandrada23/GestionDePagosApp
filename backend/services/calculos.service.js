const pagosRepo = require('../repositories/pagos.repository');

const obtenerTotal = (empresaId) => pagosRepo.totalPorProveedor(empresaId);

const obtenerFiltrado = (empresaId, filters) =>
  pagosRepo.totalPorProveedor(empresaId, {
    fechadesde: filters.fechaDesde,
    fechahasta: filters.fechaHasta,
    nombreProveedor: filters.nombreProveedor,
    nombreCliente: filters.nombreCliente,
  });

const obtenerTotalGeneral = (empresaId, fechaDesde, fechaHasta, nombreProveedor, nombreCliente) =>
  pagosRepo.totalGeneral(empresaId, fechaDesde, fechaHasta, nombreProveedor, nombreCliente);

const obtenerIngresosYEgresos = (empresaId, fechadesde, fechahasta, nombreProveedor, nombreCliente) =>
  pagosRepo.ingresosEgresosEnRango(empresaId, fechadesde, fechahasta, nombreProveedor, nombreCliente);

module.exports = { obtenerTotal, obtenerFiltrado, obtenerTotalGeneral, obtenerIngresosYEgresos };
