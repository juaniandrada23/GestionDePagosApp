const { withTransaction } = require('../db/pool');
const materialesRepo = require('../repositories/materiales.repository');
const movimientosRepo = require('../repositories/movimientos-stock.repository');
const { NotFoundError, ValidationError } = require('../errors/AppError');

const obtenerTodos = (empresaId, filters) => materialesRepo.buscarTodos(empresaId, filters);

const obtenerPorId = async (id, empresaId) => {
  const material = await materialesRepo.buscarPorId(id, empresaId);
  if (!material) throw new NotFoundError('Material');
  return material;
};

const crear = (data, empresaId) => materialesRepo.crear(data, empresaId);

const actualizar = async (id, data, empresaId) => {
  const result = await materialesRepo.actualizar(id, data, empresaId);
  if (!result) throw new NotFoundError('Material');
  return result;
};

const eliminar = async (id, empresaId) => {
  const count = await materialesRepo.eliminar(id, empresaId);
  if (!count) throw new NotFoundError('Material');
};

const registrarMovimiento = async (empresaId, userId, data) => {
  return withTransaction(async (client) => {
    const material = await materialesRepo.buscarPorId(data.material_id, empresaId);
    if (!material) throw new NotFoundError('Material');

    let newStock;
    if (data.tipo === 'entrada') {
      newStock = parseFloat(material.stock_actual) + parseFloat(data.cantidad);
    } else if (data.tipo === 'salida') {
      newStock = parseFloat(material.stock_actual) - parseFloat(data.cantidad);
      if (newStock < 0) {
        throw new ValidationError('Stock insuficiente para realizar la salida');
      }
    } else {
      newStock = parseFloat(data.cantidad);
    }

    await materialesRepo.actualizarStock(data.material_id, newStock, empresaId, client);

    const movimiento = await movimientosRepo.crear(
      {
        material_id: data.material_id,
        empresa_id: empresaId,
        cantidad: data.cantidad,
        tipo: data.tipo,
        motivo: data.motivo,
        usuario_id: userId,
        stock_resultante: newStock,
      },
      client,
    );

    return movimiento;
  });
};

const obtenerMovimientos = (materialId, empresaId) =>
  movimientosRepo.buscarPorMaterial(materialId, empresaId);

const obtenerStockBajo = (empresaId) => materialesRepo.buscarStockBajo(empresaId);

const obtenerCategorias = (empresaId) => materialesRepo.buscarCategorias(empresaId);

const crearCategoria = (nombre, empresaId) => materialesRepo.crearCategoria(nombre, empresaId);

const obtenerUnidades = (empresaId) => materialesRepo.buscarUnidades(empresaId);

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  registrarMovimiento,
  obtenerMovimientos,
  obtenerStockBajo,
  obtenerCategorias,
  crearCategoria,
  obtenerUnidades,
};
