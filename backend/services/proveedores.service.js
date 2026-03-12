const proveedoresRepo = require('../repositories/proveedores.repository');
const { ConflictError } = require('../errors/AppError');

const obtenerTodos = (empresaId) => proveedoresRepo.buscarTodos(empresaId);

const obtenerNombres = (empresaId) => proveedoresRepo.buscarNombres(empresaId);

const crear = async (nombre, empresaId) => {
  const existing = await proveedoresRepo.buscarPorNombre(nombre, empresaId);
  if (existing) {
    throw new ConflictError('Ya existe un proveedor con el mismo nombre');
  }
  return proveedoresRepo.crear(nombre, empresaId);
};

const actualizar = (id, nombre, empresaId) => proveedoresRepo.actualizar(id, nombre, empresaId);

const eliminar = (id, empresaId) => proveedoresRepo.eliminar(id, empresaId);

module.exports = { obtenerTodos, obtenerNombres, crear, actualizar, eliminar };
