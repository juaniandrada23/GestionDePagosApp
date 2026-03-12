const register = (data) => {
  const errors = [];
  const value = { ...data };

  if (!value.username || typeof value.username !== 'string' || value.username.trim().length < 3) {
    errors.push('username es requerido (mínimo 3 caracteres)');
  } else {
    value.username = value.username.trim();
  }

  if (!value.password || typeof value.password !== 'string' || value.password.length < 6) {
    errors.push('password es requerido (mínimo 6 caracteres)');
  } else if (value.password.length > 72) {
    errors.push('El password no puede superar los 72 caracteres');
  }

  if (!value.nombre || typeof value.nombre !== 'string' || value.nombre.trim().length === 0) {
    errors.push('nombre es requerido');
  } else {
    value.nombre = value.nombre.trim();
  }

  if (!value.apellido || typeof value.apellido !== 'string' || value.apellido.trim().length === 0) {
    errors.push('apellido es requerido');
  } else {
    value.apellido = value.apellido.trim();
  }

  if (
    !value.empresa_nombre ||
    typeof value.empresa_nombre !== 'string' ||
    value.empresa_nombre.trim().length === 0
  ) {
    errors.push('empresa_nombre es requerido');
  } else {
    value.empresa_nombre = value.empresa_nombre.trim();
  }

  if (value.email) value.email = value.email.trim();
  if (value.telefono) value.telefono = value.telefono.trim();
  if (value.dni) value.dni = value.dni.trim();
  if (value.empresa_direccion) value.empresa_direccion = value.empresa_direccion.trim();
  if (value.empresa_telefono) value.empresa_telefono = value.empresa_telefono.trim();
  if (value.empresa_email) value.empresa_email = value.empresa_email.trim();
  if (value.empresa_cuit) value.empresa_cuit = value.empresa_cuit.trim();
  if (value.empresa_rubro) value.empresa_rubro = value.empresa_rubro.trim();

  if (errors.length > 0) {
    return { error: errors.join(', '), value: null };
  }
  return { error: null, value };
};

module.exports = { register };
