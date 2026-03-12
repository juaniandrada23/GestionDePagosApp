const pool = require('../db/pool');

const escapeLike = (str) => str.replace(/[%_\\]/g, '\\$&');

const buscarTodos = async (empresaId, filters = {}) => {
  const conditions = ['empresa_id = $1'];
  const params = [empresaId];
  let idx = 2;

  if (filters.activo !== undefined) {
    conditions.push(`activo = $${idx++}`);
    params.push(filters.activo);
  }
  if (filters.busqueda) {
    conditions.push(`(nombre ILIKE $${idx} OR cuit_dni ILIKE $${idx})`);
    params.push(`%${escapeLike(filters.busqueda)}%`);
    idx++;
  }

  const where = conditions.join(' AND ');
  const { rows } = await pool.query(
    `SELECT * FROM clientes WHERE ${where} ORDER BY nombre ASC`,
    params,
  );
  return rows;
};

const buscarPorId = async (id, empresaId) => {
  const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1 AND empresa_id = $2', [
    id,
    empresaId,
  ]);
  return rows[0] || null;
};

const buscarPorNombre = async (nombre, empresaId, client = pool) => {
  const { rows } = await client.query(
    'SELECT id FROM clientes WHERE nombre = $1 AND empresa_id = $2',
    [nombre, empresaId],
  );
  return rows[0] || null;
};

const buscarNombres = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT id, nombre FROM clientes WHERE empresa_id = $1 AND activo = TRUE ORDER BY nombre',
    [empresaId],
  );
  return rows;
};

const crear = async (data, empresaId) => {
  const { rows } = await pool.query(
    `INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      empresaId,
      data.nombre,
      data.direccion || null,
      data.telefono || null,
      data.email || null,
      data.cuit_dni || null,
    ],
  );
  return rows[0];
};

const actualizar = async (id, data, empresaId) => {
  const { rows } = await pool.query(
    `UPDATE clientes SET nombre = $1, direccion = $2, telefono = $3, email = $4, cuit_dni = $5, updated_at = NOW()
     WHERE id = $6 AND empresa_id = $7 RETURNING *`,
    [
      data.nombre,
      data.direccion || null,
      data.telefono || null,
      data.email || null,
      data.cuit_dni || null,
      id,
      empresaId,
    ],
  );
  return rows[0] || null;
};

const eliminar = async (id, empresaId) => {
  const { rowCount } = await pool.query(
    'UPDATE clientes SET activo = FALSE, updated_at = NOW() WHERE id = $1 AND empresa_id = $2',
    [id, empresaId],
  );
  return rowCount;
};

module.exports = {
  buscarTodos,
  buscarPorId,
  buscarPorNombre,
  buscarNombres,
  crear,
  actualizar,
  eliminar,
};
