const proveedoresRepo = require('../repositories/proveedores.repository');
const { ConflictError } = require('../errors/AppError');

const obtenerTodos = (empresaId, filters) => proveedoresRepo.buscarTodos(empresaId, filters);

const obtenerNombres = (empresaId) => proveedoresRepo.buscarNombres(empresaId);

const obtenerPorId = (id, empresaId) => proveedoresRepo.buscarPorId(id, empresaId);

const crear = async (data, empresaId) => {
  const existing = await proveedoresRepo.buscarPorNombre(data.nombre, empresaId);
  if (existing) {
    throw new ConflictError('Ya existe un proveedor con el mismo nombre');
  }
  return proveedoresRepo.crear(data, empresaId);
};

const actualizar = async (id, data, empresaId) => {
  const existing = await proveedoresRepo.buscarPorNombre(data.nombre, empresaId);
  if (existing && existing.id !== parseInt(id, 10)) {
    throw new ConflictError('Ya existe un proveedor con el mismo nombre');
  }
  return proveedoresRepo.actualizar(id, data, empresaId);
};

const eliminar = (id, empresaId) => proveedoresRepo.eliminar(id, empresaId);

module.exports = { obtenerTodos, obtenerNombres, obtenerPorId, crear, actualizar, eliminar };
