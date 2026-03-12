const pool = require('../db/pool');

const buscarTodos = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT id, nombre FROM proveedores WHERE empresa_id = $1 ORDER BY nombre',
    [empresaId],
  );
  return rows;
};

const buscarNombres = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT nombre FROM proveedores WHERE empresa_id = $1 ORDER BY nombre',
    [empresaId],
  );
  return rows;
};

const buscarPorNombre = async (nombre, empresaId, client = pool) => {
  const { rows } = await client.query(
    'SELECT id FROM proveedores WHERE nombre = $1 AND empresa_id = $2',
    [nombre, empresaId],
  );
  return rows[0] || null;
};

const crear = async (nombre, empresaId) => {
  const { rows } = await pool.query(
    'INSERT INTO proveedores (nombre, empresa_id) VALUES ($1, $2) RETURNING id',
    [nombre, empresaId],
  );
  return rows[0];
};

const actualizar = async (id, nombre, empresaId) => {
  await pool.query('UPDATE proveedores SET nombre = $1 WHERE id = $2 AND empresa_id = $3', [
    nombre,
    id,
    empresaId,
  ]);
};

const eliminar = async (id, empresaId) => {
  await pool.query('DELETE FROM proveedores WHERE id = $1 AND empresa_id = $2', [id, empresaId]);
};

module.exports = { buscarTodos, buscarNombres, buscarPorNombre, crear, actualizar, eliminar };
