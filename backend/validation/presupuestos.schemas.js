const crearPresupuesto = (data) => {
  const errors = [];
  const value = { ...data };

  if (!value.cliente_id || isNaN(Number(value.cliente_id))) {
    errors.push('cliente_id es requerido');
  } else {
    value.cliente_id = Number(value.cliente_id);
  }

  if (!value.items || !Array.isArray(value.items) || value.items.length === 0) {
    errors.push('items es requerido y debe tener al menos un elemento');
  } else {
    value.items = value.items.map((item, i) => {
      if (!item.material_id || isNaN(Number(item.material_id))) {
        errors.push(`items[${i}].material_id es requerido`);
      }
      if (!item.cantidad || isNaN(Number(item.cantidad)) || Number(item.cantidad) <= 0) {
        errors.push(`items[${i}].cantidad debe ser mayor a 0`);
      }
      return {
        material_id: Number(item.material_id),
        cantidad: Number(item.cantidad),
        precio_unitario:
          item.precio_unitario !== undefined ? Number(item.precio_unitario) : undefined,
      };
    });
  }

  if (value.descuento_porcentaje !== undefined) {
    value.descuento_porcentaje = Number(value.descuento_porcentaje);
    if (
      isNaN(value.descuento_porcentaje) ||
      value.descuento_porcentaje < 0 ||
      value.descuento_porcentaje > 100
    ) {
      errors.push('descuento_porcentaje debe estar entre 0 y 100');
    }
  }

  if (value.observaciones) value.observaciones = value.observaciones.trim();

  if (errors.length > 0) return { error: errors.join(', '), value: null };
  return { error: null, value };
};

const actualizarPresupuesto = crearPresupuesto;

const aceptarPresupuesto = (data) => {
  const errors = [];
  const value = { ...data };

  if (
    !value.medioPago ||
    typeof value.medioPago !== 'string' ||
    value.medioPago.trim().length === 0
  ) {
    errors.push('medioPago es requerido');
  } else {
    value.medioPago = value.medioPago.trim();
  }

  if (!value.usdDelDia || isNaN(Number(value.usdDelDia)) || Number(value.usdDelDia) <= 0) {
    errors.push('usdDelDia es requerido y debe ser mayor a 0');
  } else {
    value.usdDelDia = Number(value.usdDelDia);
  }

  if (errors.length > 0) return { error: errors.join(', '), value: null };
  return { error: null, value };
};

module.exports = { crearPresupuesto, actualizarPresupuesto, aceptarPresupuesto };
