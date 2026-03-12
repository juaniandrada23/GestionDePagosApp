const pool = require('../db/pool');

const buscarTodosLosNombres = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT "nombreMedioPago" FROM medio_pago WHERE empresa_id = $1 ORDER BY "nombreMedioPago"',
    [empresaId],
  );
  return rows;
};

const buscarPorNombre = async (nombreMedioPago, empresaId, client = pool) => {
  const { rows } = await client.query(
    'SELECT "idMedioPago" FROM medio_pago WHERE "nombreMedioPago" = $1 AND empresa_id = $2',
    [nombreMedioPago, empresaId],
  );
  return rows[0] || null;
};

const crear = async (nombreMedioPago, empresaId) => {
  await pool.query('INSERT INTO medio_pago ("nombreMedioPago", empresa_id) VALUES ($1, $2)', [
    nombreMedioPago,
    empresaId,
  ]);
};

const eliminar = async (nombreMedioPago, empresaId) => {
  await pool.query('DELETE FROM medio_pago WHERE "nombreMedioPago" = $1 AND empresa_id = $2', [
    nombreMedioPago,
    empresaId,
  ]);
};

const actualizar = async (nombreMedioPago, nuevoNombreMedioPago, empresaId) => {
  await pool.query(
    'UPDATE medio_pago SET "nombreMedioPago" = $1 WHERE "nombreMedioPago" = $2 AND empresa_id = $3',
    [nuevoNombreMedioPago, nombreMedioPago, empresaId],
  );
};

module.exports = { buscarTodosLosNombres, buscarPorNombre, crear, eliminar, actualizar };
