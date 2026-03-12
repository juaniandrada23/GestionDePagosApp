const crear = (data) => {
  const { nombreMedioPago } = data || {};
  if (!nombreMedioPago) {
    return { error: 'El nombre del medio de pago es requerido' };
  }
  return { value: { nombreMedioPago: nombreMedioPago.trim() } };
};

const actualizar = (data) => {
  const { nuevoNombreMedioPago } = data || {};
  if (!nuevoNombreMedioPago) {
    return { error: 'El nuevo nombre del medio de pago es requerido' };
  }
  return { value: { nuevoNombreMedioPago: nuevoNombreMedioPago.trim() } };
};

module.exports = { crear, actualizar };
