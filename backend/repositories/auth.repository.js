const { adminPool: pool } = require('../db/pool');

const agregarTokenListaNegra = async (jti, expiresAt) => {
  await pool.query(
    'INSERT INTO blacklisted_tokens (jti, expires_at) VALUES ($1, $2) ON CONFLICT (jti) DO NOTHING',
    [jti, expiresAt],
  );
};

const estaEnListaNegra = async (jti) => {
  const { rows } = await pool.query('SELECT 1 FROM blacklisted_tokens WHERE jti = $1', [jti]);
  return rows.length > 0;
};

const limpiarExpirados = async () => {
  await pool.query('DELETE FROM blacklisted_tokens WHERE expires_at < NOW()');
};

const crearTokenRefresco = async (userId, tokenHash, expiresAt) => {
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenHash, expiresAt],
  );
};

const buscarTokenRefresco = async (tokenHash) => {
  const { rows } = await pool.query(
    'SELECT id, user_id, expires_at FROM refresh_tokens WHERE token_hash = $1',
    [tokenHash],
  );
  return rows[0] || null;
};

const eliminarTokenRefresco = async (tokenHash) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
};

const eliminarTokensRefrescoUsuario = async (userId) => {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
};

module.exports = {
  agregarTokenListaNegra,
  estaEnListaNegra,
  limpiarExpirados,
  crearTokenRefresco,
  buscarTokenRefresco,
  eliminarTokenRefresco,
  eliminarTokensRefrescoUsuario,
};
