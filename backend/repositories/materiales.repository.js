const pool = require('../db/pool');

const escapeLike = (str) => str.replace(/[%_\\]/g, '\\$&');

const MATERIAL_SELECT = `
  SELECT m.*, c.nombre AS categoria_nombre,
         u.nombre AS unidad_nombre, u.abreviatura AS unidad_abreviatura
  FROM materiales m
  LEFT JOIN categorias_material c ON m.categoria_id = c.id
  JOIN unidades u ON m.unidad_id = u.id`;

const buscarTodos = async (empresaId, filters = {}) => {
  const conditions = ['m.empresa_id = $1'];
  const params = [empresaId];
  let idx = 2;

  if (filters.activo !== undefined) {
    conditions.push(`m.activo = $${idx++}`);
    params.push(filters.activo);
  }
  if (filters.categoria_id) {
    conditions.push(`m.categoria_id = $${idx++}`);
    params.push(filters.categoria_id);
  }
  if (filters.busqueda) {
    conditions.push(`(m.nombre ILIKE $${idx} OR m.codigo ILIKE $${idx})`);
    params.push(`%${escapeLike(filters.busqueda)}%`);
    idx++;
  }

  const where = conditions.join(' AND ');
  const { rows } = await pool.query(
    `${MATERIAL_SELECT} WHERE ${where} ORDER BY m.nombre ASC`,
    params,
  );
  return rows;
};

const buscarPorIds = async (ids, empresaId) => {
  if (!ids.length) return [];
  const { rows } = await pool.query(
    `${MATERIAL_SELECT} WHERE m.id = ANY($1) AND m.empresa_id = $2`,
    [ids, empresaId],
  );
  return rows;
};

const buscarPorId = async (id, empresaId) => {
  const { rows } = await pool.query(`${MATERIAL_SELECT} WHERE m.id = $1 AND m.empresa_id = $2`, [
    id,
    empresaId,
  ]);
  return rows[0] || null;
};

const crear = async (data, empresaId, client = pool) => {
  const { rows } = await client.query(
    `INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id,
     precio_venta, precio_costo, stock_actual, stock_minimo, unidad_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      empresaId,
      data.nombre,
      data.descripcion || null,
      data.codigo || null,
      data.categoria_id || null,
      data.precio_venta,
      data.precio_costo || 0,
      data.stock_actual || 0,
      data.stock_minimo || 0,
      data.unidad_id,
    ],
  );
  return rows[0];
};

const actualizar = async (id, data, empresaId) => {
  const { rows } = await pool.query(
    `UPDATE materiales SET nombre = $1, descripcion = $2, codigo = $3, categoria_id = $4,
     precio_venta = $5, precio_costo = $6, stock_minimo = $7, unidad_id = $8, updated_at = NOW()
     WHERE id = $9 AND empresa_id = $10 RETURNING *`,
    [
      data.nombre,
      data.descripcion || null,
      data.codigo || null,
      data.categoria_id || null,
      data.precio_venta,
      data.precio_costo || 0,
      data.stock_minimo || 0,
      data.unidad_id,
      id,
      empresaId,
    ],
  );
  return rows[0] || null;
};

const eliminar = async (id, empresaId) => {
  const { rowCount } = await pool.query(
    'UPDATE materiales SET activo = FALSE, updated_at = NOW() WHERE id = $1 AND empresa_id = $2',
    [id, empresaId],
  );
  return rowCount;
};

const actualizarStock = async (id, newStock, empresaId, client = pool) => {
  const { rows } = await client.query(
    'UPDATE materiales SET stock_actual = $1, updated_at = NOW() WHERE id = $2 AND empresa_id = $3 RETURNING *',
    [newStock, id, empresaId],
  );
  return rows[0] || null;
};

const buscarStockBajo = async (empresaId) => {
  const { rows } = await pool.query(
    `${MATERIAL_SELECT}
     WHERE m.empresa_id = $1 AND m.activo = TRUE AND m.stock_actual <= m.stock_minimo
     ORDER BY (m.stock_actual - m.stock_minimo) ASC`,
    [empresaId],
  );
  return rows;
};

const buscarCategorias = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT * FROM categorias_material WHERE empresa_id = $1 ORDER BY nombre',
    [empresaId],
  );
  return rows;
};

const crearCategoria = async (nombre, empresaId) => {
  const { rows } = await pool.query(
    'INSERT INTO categorias_material (nombre, empresa_id) VALUES ($1, $2) RETURNING *',
    [nombre, empresaId],
  );
  return rows[0];
};

const buscarUnidades = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT * FROM unidades WHERE empresa_id = $1 ORDER BY nombre',
    [empresaId],
  );
  return rows;
};

module.exports = {
  buscarTodos,
  buscarPorIds,
  buscarPorId,
  crear,
  actualizar,
  eliminar,
  actualizarStock,
  buscarStockBajo,
  buscarCategorias,
  crearCategoria,
  buscarUnidades,
};
