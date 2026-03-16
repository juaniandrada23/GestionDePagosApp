const pool = require('../db/pool');

const crear = async (data, client = pool) => {
  const { rows } = await client.query(
    `INSERT INTO movimientos_stock (material_id, empresa_id, cantidad, tipo, motivo, usuario_id, stock_resultante)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.material_id,
      data.empresa_id,
      data.cantidad,
      data.tipo,
      data.motivo || null,
      data.usuario_id,
      data.stock_resultante,
    ],
  );
  return rows[0];
};

const crearLote = async (items, client = pool) => {
  if (!items.length) return [];
  const values = [];
  const params = [];
  let idx = 1;
  for (const data of items) {
    values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
    params.push(
      data.material_id,
      data.empresa_id,
      data.cantidad,
      data.tipo,
      data.motivo || null,
      data.usuario_id,
      data.stock_resultante,
    );
  }
  const { rows } = await client.query(
    `INSERT INTO movimientos_stock (material_id, empresa_id, cantidad, tipo, motivo, usuario_id, stock_resultante)
     VALUES ${values.join(', ')} RETURNING *`,
    params,
  );
  return rows;
};

const buscarPorMaterial = async (materialId, empresaId) => {
  const { rows } = await pool.query(
    `SELECT ms.*, u.username
     FROM movimientos_stock ms
     JOIN usuarios u ON ms.usuario_id = u.id
     WHERE ms.material_id = $1 AND ms.empresa_id = $2
     ORDER BY ms.fecha DESC`,
    [materialId, empresaId],
  );
  return rows;
};

module.exports = { crear, crearLote, buscarPorMaterial };
