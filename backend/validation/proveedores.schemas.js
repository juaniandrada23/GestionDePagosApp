const nombre = (data) => {
  const { nombre } = data || {};
  if (!nombre) {
    return { error: 'El campo nombre es requerido' };
  }
  return { value: { nombre: nombre.trim() } };
};

module.exports = { nombre };
