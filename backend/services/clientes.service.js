const clientesRepo = require('../repositories/clientes.repository');
const { NotFoundError, ConflictError } = require('../errors/AppError');

const obtenerTodos = (empresaId, filters) => clientesRepo.buscarTodos(empresaId, filters);

const obtenerPorId = async (id, empresaId) => {
  const cliente = await clientesRepo.buscarPorId(id, empresaId);
  if (!cliente) throw new NotFoundError('Cliente');
  return cliente;
};

const obtenerNombres = (empresaId) => clientesRepo.buscarNombres(empresaId);

const crear = async (data, empresaId) => {
  const existing = await clientesRepo.buscarPorNombre(data.nombre, empresaId);
  if (existing) throw new ConflictError('Ya existe un cliente con ese nombre');
  return clientesRepo.crear(data, empresaId);
};

const actualizar = async (id, data, empresaId) => {
  const result = await clientesRepo.actualizar(id, data, empresaId);
  if (!result) throw new NotFoundError('Cliente');
  return result;
};

const eliminar = async (id, empresaId) => {
  const count = await clientesRepo.eliminar(id, empresaId);
  if (!count) throw new NotFoundError('Cliente');
};

module.exports = { obtenerTodos, obtenerPorId, obtenerNombres, crear, actualizar, eliminar };
