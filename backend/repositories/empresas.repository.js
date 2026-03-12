const pool = require('../db/pool');

const crear = async (data, client = pool) => {
  const { rows } = await client.query(
    `INSERT INTO empresas (nombre, direccion, telefono, email, logo, cuit, rubro)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      data.nombre,
      data.direccion || null,
      data.telefono || null,
      data.email || null,
      data.logo || null,
      data.cuit || null,
      data.rubro || null,
    ],
  );
  return rows[0];
};

const buscarPorId = async (id) => {
  const { rows } = await pool.query('SELECT * FROM empresas WHERE id = $1', [id]);
  return rows[0] || null;
};

const actualizar = async (id, data) => {
  const { rows } = await pool.query(
    `UPDATE empresas SET nombre = $1, direccion = $2, telefono = $3, email = $4,
     logo = $5, cuit = $6, rubro = $7, updated_at = NOW()
     WHERE id = $8 RETURNING *`,
    [data.nombre, data.direccion, data.telefono, data.email, data.logo, data.cuit, data.rubro, id],
  );
  return rows[0] || null;
};

module.exports = { crear, buscarPorId, actualizar };
