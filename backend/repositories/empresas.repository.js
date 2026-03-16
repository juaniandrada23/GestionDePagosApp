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

module.exports = { crear, buscarPorId };
