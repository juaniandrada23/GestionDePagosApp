const { withTransaction } = require('../db/pool');
const presupuestosRepo = require('../repositories/presupuestos.repository');
const materialesRepo = require('../repositories/materiales.repository');
const movimientosRepo = require('../repositories/movimientos-stock.repository');
const clientesRepo = require('../repositories/clientes.repository');
const medioDepagoRepo = require('../repositories/mediodepago.repository');
const pagosRepo = require('../repositories/pagos.repository');
const { NotFoundError, ValidationError } = require('../errors/AppError');

const obtenerTodos = (empresaId, filters) => presupuestosRepo.buscarTodos(empresaId, filters);

const obtenerPorId = async (id, empresaId) => {
  const presupuesto = await presupuestosRepo.buscarPorId(id, empresaId);
  if (!presupuesto) throw new NotFoundError('Presupuesto');
  return presupuesto;
};

const construirItemsDesdeMateriales = async (items, empresaId) => {
  const materialIds = items.map((i) => Number(i.material_id));
  const materials = await materialesRepo.buscarPorIds(materialIds, empresaId);
  const materialsMap = new Map(materials.map((m) => [m.id, m]));

  let subtotal = 0;
  const itemsToInsert = [];

  for (const item of items) {
    const material = materialsMap.get(Number(item.material_id));
    if (!material) throw new NotFoundError(`Material (id: ${item.material_id})`);

    const precioUnitario =
      item.precio_unitario !== undefined
        ? parseFloat(item.precio_unitario)
        : parseFloat(material.precio_venta);
    const cantidad = parseFloat(item.cantidad);
    const itemSubtotal = precioUnitario * cantidad;
    subtotal += itemSubtotal;

    itemsToInsert.push({
      material_id: material.id,
      cantidad,
      precio_unitario: precioUnitario,
      subtotal: itemSubtotal,
      material_nombre: material.nombre,
      material_codigo: material.codigo,
      material_unidad: material.unidad_abreviatura,
    });
  }

  return { itemsToInsert, subtotal };
};

const crear = async (empresaId, userId, data) => {
  return withTransaction(async (client) => {
    const cliente = await clientesRepo.buscarPorId(data.cliente_id, empresaId);
    if (!cliente) throw new NotFoundError('Cliente');

    const { itemsToInsert, subtotal } = await construirItemsDesdeMateriales(data.items, empresaId);

    const descuento = parseFloat(data.descuento_porcentaje) || 0;
    const total = subtotal * (1 - descuento / 100);

    const presupuesto = await presupuestosRepo.crear(
      {
        cliente_id: data.cliente_id,
        fecha: data.fecha,
        fecha_validez: data.fecha_validez,
        observaciones: data.observaciones,
        subtotal,
        descuento_porcentaje: descuento,
        total,
        usuario_id: userId,
      },
      empresaId,
      client,
    );

    if (itemsToInsert.length > 0) {
      await presupuestosRepo.crearItems(
        itemsToInsert.map((item) => ({
          ...item,
          presupuesto_id: presupuesto.id,
          empresa_id: empresaId,
        })),
        client,
      );
    }

    return { ...presupuesto, items: itemsToInsert };
  });
};

const actualizar = async (id, empresaId, data) => {
  return withTransaction(async (client) => {
    const { itemsToInsert, subtotal } = await construirItemsDesdeMateriales(data.items, empresaId);

    const descuento = parseFloat(data.descuento_porcentaje) || 0;
    const total = subtotal * (1 - descuento / 100);

    const presupuesto = await presupuestosRepo.actualizar(
      id,
      {
        cliente_id: data.cliente_id,
        fecha: data.fecha,
        fecha_validez: data.fecha_validez,
        observaciones: data.observaciones,
        subtotal,
        descuento_porcentaje: descuento,
        total,
      },
      empresaId,
      client,
    );

    if (!presupuesto)
      throw new ValidationError('Solo se pueden editar presupuestos en estado borrador');

    await presupuestosRepo.eliminarItems(id, client);
    if (itemsToInsert.length > 0) {
      await presupuestosRepo.crearItems(
        itemsToInsert.map((item) => ({ ...item, presupuesto_id: id, empresa_id: empresaId })),
        client,
      );
    }

    return { ...presupuesto, items: itemsToInsert };
  });
};

const cambiarEstado = async (id, empresaId, nuevoEstado) => {
  const presupuesto = await presupuestosRepo.buscarPorId(id, empresaId);
  if (!presupuesto) throw new NotFoundError('Presupuesto');

  const transicionesValidas = {
    borrador: ['enviado'],
    enviado: ['aceptado', 'rechazado'],
  };

  const permitidas = transicionesValidas[presupuesto.estado] || [];
  if (!permitidas.includes(nuevoEstado)) {
    throw new ValidationError(`No se puede cambiar de '${presupuesto.estado}' a '${nuevoEstado}'`);
  }

  return presupuestosRepo.actualizarEstado(id, nuevoEstado, empresaId);
};

const aceptar = async (id, empresaId, userId, { medioPago, usdDelDia }) => {
  return withTransaction(async (client) => {
    const presupuesto = await presupuestosRepo.buscarPorId(id, empresaId);
    if (!presupuesto) throw new NotFoundError('Presupuesto');
    if (presupuesto.estado !== 'enviado') {
      throw new ValidationError('Solo se pueden aceptar presupuestos en estado "enviado"');
    }

    const materialIds = presupuesto.items.map((i) => i.material_id);
    const { rows: materials } = await client.query(
      'SELECT * FROM materiales WHERE id = ANY($1) AND empresa_id = $2 FOR UPDATE',
      [materialIds, empresaId],
    );
    const materialsMap = new Map(materials.map((m) => [m.id, m]));

    const stockErrors = [];
    const stockUpdates = [];

    for (const item of presupuesto.items) {
      const material = materialsMap.get(item.material_id);

      if (!material) {
        stockErrors.push(`Material "${item.material_nombre}" ya no existe`);
        continue;
      }

      const newStock = parseFloat(material.stock_actual) - parseFloat(item.cantidad);
      if (newStock < 0) {
        stockErrors.push(
          `"${item.material_nombre}": stock actual ${material.stock_actual} ${item.material_unidad}, necesario ${item.cantidad}`,
        );
      }

      stockUpdates.push({ material, item, newStock });
    }

    if (stockErrors.length > 0) {
      throw new ValidationError(`Stock insuficiente: ${stockErrors.join('; ')}`);
    }

    if (stockUpdates.length > 0) {
      const ids = stockUpdates.map((s) => s.material.id);
      const stocks = stockUpdates.map((s) => s.newStock);
      await client.query(
        `UPDATE materiales AS m SET stock_actual = v.new_stock, updated_at = NOW()
         FROM UNNEST($1::int[], $2::numeric[]) AS v(id, new_stock)
         WHERE m.id = v.id`,
        [ids, stocks],
      );
    }

    if (stockUpdates.length > 0) {
      await movimientosRepo.crearLote(
        stockUpdates.map(({ material, item, newStock }) => ({
          material_id: material.id,
          empresa_id: empresaId,
          cantidad: item.cantidad,
          tipo: 'salida',
          motivo: `Presupuesto #${presupuesto.numero} aceptado`,
          usuario_id: userId,
          stock_resultante: newStock,
        })),
        client,
      );
    }

    const mp = await medioDepagoRepo.buscarPorNombre(medioPago, empresaId, client);
    if (!mp) throw new NotFoundError('Medio de pago');

    const montoTotal = parseFloat(presupuesto.total);
    const montoUSD = montoTotal / parseFloat(usdDelDia);

    const pago = await pagosRepo.crear(
      {
        idProveedor: null,
        idCliente: presupuesto.cliente_id,
        monto: montoTotal,
        idMedioPago: mp.idMedioPago,
        fecha: new Date(),
        montoUSD,
        usdDelDia: parseFloat(usdDelDia),
        idUsuario: userId,
        descripcion: `Presupuesto #${presupuesto.numero} aceptado`,
        empresaId,
        tipo: 'venta',
      },
      client,
    );

    await presupuestosRepo.actualizarEstado(id, 'aceptado', empresaId, client);
    await presupuestosRepo.vincularPago(id, pago.idPago, client);

    return { presupuestoId: id, pagoId: pago.idPago };
  });
};

const eliminar = async (id, empresaId) => {
  const count = await presupuestosRepo.eliminar(id, empresaId);
  if (!count) throw new ValidationError('Solo se pueden eliminar presupuestos en estado borrador');
};

const obtenerDatosPdf = async (id, empresaId) => {
  const presupuesto = await presupuestosRepo.buscarPorId(id, empresaId);
  if (!presupuesto) throw new NotFoundError('Presupuesto');

  const empresasRepo = require('../repositories/empresas.repository');
  const empresa = await empresasRepo.buscarPorId(empresaId);

  return { presupuesto, empresa };
};

const contarPorEstado = (empresaId) => presupuestosRepo.contarPorEstado(empresaId);

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  cambiarEstado,
  aceptar,
  eliminar,
  obtenerDatosPdf,
  contarPorEstado,
};
