const filtrarPagos = (data) => {
  const { fechadesde, fechahasta, nombreProveedor, usuarioFiltrado, page, limit } = data || {};
  if (!fechadesde && !fechahasta && !nombreProveedor && !usuarioFiltrado) {
    return {
      error:
        'Debes proporcionar al menos uno de los parámetros: fechadesde, fechahasta, nombreProveedor o usuarioFiltrado',
    };
  }
  const value = { fechadesde, fechahasta, nombreProveedor, usuarioFiltrado };
  if (limit) value.limit = parseInt(limit, 10);
  if (page) value.page = parseInt(page, 10);
  return { value };
};

const actualizarPago = (data) => {
  const { nombre, cliente, monto, medioPago, fecha, usdDelDia, descripcion } = data || {};
  if (!nombre && !cliente) {
    return { error: 'Debe proporcionar un proveedor (nombre) o un cliente' };
  }
  if (!monto || !medioPago || !fecha || !usdDelDia) {
    return {
      error: 'Todos los campos son obligatorios: monto, medioPago, fecha, usdDelDia',
    };
  }
  return { value: { nombre, cliente, monto, medioPago, fecha, usdDelDia, descripcion } };
};

const crearCompra = (data) => {
  const { nombre, cliente, monto, medioPago, fecha, usdDelDia, descripcion } = data || {};
  if (!nombre && !cliente) {
    return { error: 'Debe proporcionar un proveedor (nombre) o un cliente' };
  }
  if (!monto || !medioPago || !fecha || !usdDelDia) {
    return {
      error: 'Todos los campos son obligatorios: monto, medioPago, fecha, usdDelDia',
    };
  }
  return { value: { nombre, cliente, monto, medioPago, fecha, usdDelDia, descripcion } };
};

const crearVenta = (data) => {
  const { cliente, proveedor, monto, medioPago, fecha, usdDelDia, descripcion } = data || {};
  if (!cliente && !proveedor) {
    return { error: 'Debe proporcionar un cliente o un proveedor' };
  }
  if (!monto || !medioPago || !fecha || !usdDelDia) {
    return {
      error: 'Todos los campos son obligatorios: monto, medioPago, fecha, usdDelDia',
    };
  }
  return { value: { cliente, proveedor, monto, medioPago, fecha, usdDelDia, descripcion } };
};

module.exports = { actualizarPago, filtrarPagos, crearCompra, crearVenta };
