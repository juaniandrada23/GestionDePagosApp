const credentials = (data) => {
  const { username, password } = data || {};
  if (!username || !password) {
    return { error: 'Username y password son requeridos' };
  }
  if (password.length > 72) {
    return { error: 'El password no puede superar los 72 caracteres' };
  }
  return { value: { username: username.trim(), password } };
};

module.exports = { credentials };
