const idUsuarioQuery = (data) => {
  const { idUsuario } = data || {};
  if (!idUsuario) {
    return { error: 'Debes proporcionar el ID de usuario' };
  }
  return { value: { idUsuario } };
};

const crearUsuario = (data) => {
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

  if (errors.length > 0) return { error: errors.join(', '), value: null };
  return { error: null, value };
};

module.exports = { idUsuarioQuery, crearUsuario };
