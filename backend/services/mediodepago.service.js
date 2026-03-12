const medioDepagoRepo = require('../repositories/mediodepago.repository');

const obtenerTodos = (empresaId) => medioDepagoRepo.buscarTodosLosNombres(empresaId);

const crear = (nombreMedioPago, empresaId) => medioDepagoRepo.crear(nombreMedioPago, empresaId);

const eliminar = (nombreMedioPago, empresaId) =>
  medioDepagoRepo.eliminar(nombreMedioPago, empresaId);

const actualizar = (nombreMedioPago, nuevoNombreMedioPago, empresaId) =>
  medioDepagoRepo.actualizar(nombreMedioPago, nuevoNombreMedioPago, empresaId);

module.exports = { obtenerTodos, crear, eliminar, actualizar };
