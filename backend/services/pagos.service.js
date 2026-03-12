const { withTransaction } = require('../db/pool');
const pagosRepo = require('../repositories/pagos.repository');
const proveedoresRepo = require('../repositories/proveedores.repository');
const clientesRepo = require('../repositories/clientes.repository');
const medioDepagoRepo = require('../repositories/mediodepago.repository');
const { NotFoundError } = require('../errors/AppError');

const obtenerTodos = (empresaId, filters = {}) => {
  if (filters.tipo) return pagosRepo.buscarFiltrado(empresaId, filters);
  return pagosRepo.buscarTodos(empresaId);
};

const obtenerFiltrado = (empresaId, filters) => pagosRepo.buscarFiltrado(empresaId, filters);

const obtenerPorUsuario = (empresaId, idUsuario) =>
  pagosRepo.buscarPorUsuario(empresaId, idUsuario);

const resolverEntidad = async (nombre, cliente, empresaId, dbClient) => {
  if (nombre) {
    const prov = await proveedoresRepo.buscarPorNombre(nombre, empresaId, dbClient);
    if (!prov) throw new NotFoundError('Proveedor');
    return { idProveedor: prov.id, idCliente: null };
  }
  const cli = await clientesRepo.buscarPorNombre(cliente, empresaId, dbClient);
  if (!cli) throw new NotFoundError('Cliente');
  return { idProveedor: null, idCliente: cli.id };
};

const actualizar = async (
  id,
  empresaId,
  { nombre, cliente, monto, medioPago, fecha, usdDelDia, descripcion },
) => {
  await withTransaction(async (dbClient) => {
    const [entidad, mp] = await Promise.all([
      resolverEntidad(nombre, cliente, empresaId, dbClient),
      medioDepagoRepo.buscarPorNombre(medioPago, empresaId, dbClient),
    ]);

    if (!mp) throw new NotFoundError('Medio de pago');

    const montoUSD = monto / usdDelDia;

    await pagosRepo.actualizar(
      id,
      {
        idProveedor: entidad.idProveedor,
        idCliente: entidad.idCliente,
        monto,
        idMedioPago: mp.idMedioPago,
        fecha,
        montoUSD,
        usdDelDia,
        descripcion,
      },
      empresaId,
      dbClient,
    );
  });
};

const eliminar = (id, empresaId) => pagosRepo.eliminar(id, empresaId);

const crearCompra = async (
  idUsuario,
  empresaId,
  { nombre, cliente, monto, medioPago, fecha, usdDelDia, descripcion },
) => {
  await withTransaction(async (dbClient) => {
    const [entidad, mp] = await Promise.all([
      resolverEntidad(nombre, cliente, empresaId, dbClient),
      medioDepagoRepo.buscarPorNombre(medioPago, empresaId, dbClient),
    ]);

    if (!mp) throw new NotFoundError('Medio de pago');

    const montoNum = -Math.abs(parseFloat(monto));
    const montoUSD = montoNum / usdDelDia;

    await pagosRepo.crear(
      {
        idProveedor: entidad.idProveedor,
        idCliente: entidad.idCliente,
        monto: montoNum,
        idMedioPago: mp.idMedioPago,
        fecha,
        montoUSD,
        usdDelDia,
        idUsuario,
        descripcion,
        empresaId,
        tipo: 'compra',
      },
      dbClient,
    );
  });
};

const crearVenta = async (
  idUsuario,
  empresaId,
  { cliente, proveedor, monto, medioPago, fecha, usdDelDia, descripcion },
) => {
  await withTransaction(async (dbClient) => {
    const [entidad, mp] = await Promise.all([
      resolverEntidad(proveedor, cliente, empresaId, dbClient),
      medioDepagoRepo.buscarPorNombre(medioPago, empresaId, dbClient),
    ]);

    if (!mp) throw new NotFoundError('Medio de pago');

    const montoNum = Math.abs(parseFloat(monto));
    const montoUSD = montoNum / usdDelDia;

    await pagosRepo.crear(
      {
        idProveedor: entidad.idProveedor,
        idCliente: entidad.idCliente,
        monto: montoNum,
        idMedioPago: mp.idMedioPago,
        fecha,
        montoUSD,
        usdDelDia,
        idUsuario,
        descripcion,
        empresaId,
        tipo: 'venta',
      },
      dbClient,
    );
  });
};

module.exports = {
  obtenerTodos,
  obtenerFiltrado,
  obtenerPorUsuario,
  actualizar,
  eliminar,
  crearCompra,
  crearVenta,
};
