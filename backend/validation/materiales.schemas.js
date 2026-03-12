const crearMaterial = (data) => {
  const errors = [];
  const value = { ...data };

  if (!value.nombre || typeof value.nombre !== 'string' || value.nombre.trim().length === 0) {
    errors.push('nombre es requerido');
  } else {
    value.nombre = value.nombre.trim();
  }

  if (
    value.precio_venta === undefined ||
    value.precio_venta === null ||
    isNaN(Number(value.precio_venta))
  ) {
    errors.push('precio_venta es requerido y debe ser numérico');
  } else {
    value.precio_venta = Number(value.precio_venta);
  }

  if (value.precio_costo !== undefined && value.precio_costo !== null) {
    value.precio_costo = Number(value.precio_costo);
  }
  if (value.stock_actual !== undefined) value.stock_actual = Number(value.stock_actual);
  if (value.stock_minimo !== undefined) value.stock_minimo = Number(value.stock_minimo);

  if (value.codigo) value.codigo = value.codigo.trim();
  if (value.descripcion) value.descripcion = value.descripcion.trim();
  if (value.unidad_id) value.unidad_id = Number(value.unidad_id);
  if (value.categoria_id) value.categoria_id = Number(value.categoria_id);

  if (errors.length > 0) return { error: errors.join(', '), value: null };
  return { error: null, value };
};

const actualizarMaterial = crearMaterial;

const crearMovimiento = (data) => {
  const errors = [];
  const value = { ...data };

  if (!value.cantidad || isNaN(Number(value.cantidad)) || Number(value.cantidad) <= 0) {
    errors.push('cantidad es requerida y debe ser mayor a 0');
  } else {
    value.cantidad = Number(value.cantidad);
  }

  const tiposValidos = ['entrada', 'salida', 'ajuste'];
  if (!value.tipo || !tiposValidos.includes(value.tipo)) {
    errors.push('tipo es requerido (entrada, salida, ajuste)');
  }

  if (value.motivo) value.motivo = value.motivo.trim();
  if (value.material_id) value.material_id = Number(value.material_id);

  if (errors.length > 0) return { error: errors.join(', '), value: null };
  return { error: null, value };
};

module.exports = { crearMaterial, actualizarMaterial, crearMovimiento };
