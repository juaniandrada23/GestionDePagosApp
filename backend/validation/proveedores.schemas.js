const crearProveedor = (data) => {
  const errors = [];
  const value = { ...data };

  if (!value.nombre || typeof value.nombre !== 'string' || value.nombre.trim().length === 0) {
    errors.push('nombre es requerido');
  } else {
    value.nombre = value.nombre.trim();
  }

  if (value.direccion) value.direccion = value.direccion.trim();
  if (value.telefono) value.telefono = value.telefono.trim();

  if (value.email) {
    value.email = value.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
      errors.push('email no es válido');
    }
  }

  if (value.cuit_dni) {
    value.cuit_dni = value.cuit_dni.trim();
  }

  if (errors.length > 0) return { error: errors.join(', '), value: null };
  return { error: null, value };
};

const actualizarProveedor = crearProveedor;

module.exports = { crearProveedor, actualizarProveedor };
