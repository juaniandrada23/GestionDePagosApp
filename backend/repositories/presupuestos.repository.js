const pool = require('../db/pool');

const buscarTodos = async (empresaId, filters = {}) => {
  const conditions = ['p.empresa_id = $1'];
  const params = [empresaId];
  let idx = 2;

  if (filters.estado) {
    conditions.push(`p.estado = $${idx++}`);
    params.push(filters.estado);
  }
  if (filters.cliente_id) {
    conditions.push(`p.cliente_id = $${idx++}`);
    params.push(filters.cliente_id);
  }
  if (filters.fechadesde) {
    conditions.push(`p.fecha >= $${idx++}`);
    params.push(filters.fechadesde);
  }
  if (filters.fechahasta) {
    conditions.push(`p.fecha <= $${idx++}`);
    params.push(filters.fechahasta);
  }

  const where = conditions.join(' AND ');
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS cliente_nombre
     FROM presupuestos p
     JOIN clientes c ON p.cliente_id = c.id
     WHERE ${where}
     ORDER BY p.numero DESC`,
    params,
  );
  return rows;
};

const buscarPorId = async (id, empresaId) => {
  const {
    rows: [row],
  } = await pool.query(
    `SELECT p.*,
            c.nombre AS cliente_nombre, c.direccion AS cliente_direccion,
            c.telefono AS cliente_telefono, c.email AS cliente_email, c.cuit_dni AS cliente_cuit_dni,
            COALESCE(
              json_agg(json_build_object(
                'id', pi.id, 'material_id', pi.material_id,
                'cantidad', pi.cantidad, 'precio_unitario', pi.precio_unitario,
                'subtotal', pi.subtotal, 'material_nombre', pi.material_nombre,
                'material_codigo', pi.material_codigo, 'material_unidad', pi.material_unidad
              ) ORDER BY pi.id) FILTER (WHERE pi.id IS NOT NULL), '[]'::json
            ) AS items
     FROM presupuestos p
     JOIN clientes c ON p.cliente_id = c.id
     LEFT JOIN presupuesto_items pi ON pi.presupuesto_id = p.id
     WHERE p.id = $1 AND p.empresa_id = $2
     GROUP BY p.id, c.nombre, c.direccion, c.telefono, c.email, c.cuit_dni`,
    [id, empresaId],
  );
  return row || null;
};

const crear = async (data, empresaId, client) => {
  const {
    rows: [{ next_presupuesto_numero: numero }],
  } = await client.query('SELECT next_presupuesto_numero($1)', [empresaId]);

  const {
    rows: [row],
  } = await client.query(
    `INSERT INTO presupuestos (empresa_id, cliente_id, numero, fecha, fecha_validez, observaciones,
     subtotal, descuento_porcentaje, total, usuario_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      empresaId,
      data.cliente_id,
      numero,
      data.fecha || new Date(),
      data.fecha_validez || null,
      data.observaciones || null,
      data.subtotal,
      data.descuento_porcentaje || 0,
      data.total,
      data.usuario_id,
    ],
  );
  return row;
};

const crearItems = async (items, client) => {
  if (!items.length) return [];
  const values = [];
  const params = [];
  let idx = 1;
  for (const item of items) {
    values.push(
      `($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`,
    );
    params.push(
      item.presupuesto_id,
      item.material_id,
      item.cantidad,
      item.precio_unitario,
      item.subtotal,
      item.material_nombre,
      item.material_codigo || null,
      item.material_unidad,
      item.empresa_id,
    );
  }
  const { rows } = await client.query(
    `INSERT INTO presupuesto_items (presupuesto_id, material_id, cantidad, precio_unitario, subtotal,
     material_nombre, material_codigo, material_unidad, empresa_id)
     VALUES ${values.join(', ')} RETURNING *`,
    params,
  );
  return rows;
};

const actualizar = async (id, data, empresaId, client) => {
  const {
    rows: [row],
  } = await client.query(
    `UPDATE presupuestos SET cliente_id = $1, fecha = $2, fecha_validez = $3, observaciones = $4,
     subtotal = $5, descuento_porcentaje = $6, total = $7, updated_at = NOW()
     WHERE id = $8 AND empresa_id = $9 AND estado = 'borrador' RETURNING *`,
    [
      data.cliente_id,
      data.fecha,
      data.fecha_validez || null,
      data.observaciones || null,
      data.subtotal,
      data.descuento_porcentaje || 0,
      data.total,
      id,
      empresaId,
    ],
  );
  return row || null;
};

const actualizarEstado = async (id, estado, empresaId, client = pool) => {
  const {
    rows: [row],
  } = await client.query(
    `UPDATE presupuestos SET estado = $1, updated_at = NOW()
     WHERE id = $2 AND empresa_id = $3 RETURNING *`,
    [estado, id, empresaId],
  );
  return row || null;
};

const eliminarItems = async (presupuestoId, client) => {
  await client.query('DELETE FROM presupuesto_items WHERE presupuesto_id = $1', [presupuestoId]);
};

const eliminar = async (id, empresaId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM presupuestos WHERE id = $1 AND empresa_id = $2 AND estado = 'borrador'`,
    [id, empresaId],
  );
  return rowCount;
};

const vincularPago = async (id, pagoId, client) => {
  await client.query('UPDATE presupuestos SET pago_id = $1, updated_at = NOW() WHERE id = $2', [
    pagoId,
    id,
  ]);
};

const contarPorEstado = async (empresaId) => {
  const { rows } = await pool.query(
    `SELECT estado, COUNT(*)::int AS cantidad
     FROM presupuestos WHERE empresa_id = $1
     GROUP BY estado`,
    [empresaId],
  );
  return rows;
};

module.exports = {
  buscarTodos,
  buscarPorId,
  crear,
  crearItems,
  actualizar,
  actualizarEstado,
  eliminarItems,
  eliminar,
  vincularPago,
  contarPorEstado,
};
