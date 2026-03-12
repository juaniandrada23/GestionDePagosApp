const pool = require('../db/pool');

const USER_COLUMNS =
  'u.id, u.username, u.imagen, u.descripcion, u.email, u.nombre, u.apellido, u.empresa_id';

const buscarTodosLosNombresUsuario = async (empresaId) => {
  const { rows } = await pool.query('SELECT username FROM usuarios WHERE empresa_id = $1', [
    empresaId,
  ]);
  return rows;
};

const buscarTodosConRoles = async (empresaId) => {
  const { rows } = await pool.query(
    `SELECT ${USER_COLUMNS}, r.role_name
     FROM user_roles ur
     INNER JOIN usuarios u ON ur.user_id = u.id
     INNER JOIN roles r ON ur.role_id = r.role_id
     WHERE u.empresa_id = $1`,
    [empresaId],
  );
  return rows;
};

const buscarPorId = async (id, empresaId) => {
  const { rows } = await pool.query(
    `SELECT ${USER_COLUMNS} FROM usuarios u WHERE id = $1 AND empresa_id = $2`,
    [id, empresaId],
  );
  return rows;
};

const buscarPorNombreUsuario = async (username, client = pool) => {
  const { rows } = await client.query(
    `SELECT u.id, u.username, u.password, u.imagen, u.empresa_id, r.role_name, e.nombre AS empresa_nombre
     FROM usuarios u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.role_id
     LEFT JOIN empresas e ON u.empresa_id = e.id
     WHERE u.username = $1`,
    [username],
  );
  return rows[0] || null;
};

const buscarPorIdConRol = async (id, client = pool) => {
  const { rows } = await client.query(
    `SELECT u.id, u.username, u.imagen, u.empresa_id, r.role_name, e.nombre AS empresa_nombre
     FROM usuarios u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.role_id
     LEFT JOIN empresas e ON u.empresa_id = e.id
     WHERE u.id = $1`,
    [id],
  );
  return rows[0] || null;
};

const crear = async (data, client = pool) => {
  const { rows } = await client.query(
    `INSERT INTO usuarios (username, password, empresa_id, nombre, apellido, fecha_nacimiento, dni, telefono, email)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      data.username,
      data.hashedPassword,
      data.empresaId,
      data.nombre || null,
      data.apellido || null,
      data.fecha_nacimiento || null,
      data.dni || null,
      data.telefono || null,
      data.email || null,
    ],
  );
  return rows[0];
};

const buscarRolPorNombre = async (roleName, client = pool) => {
  const { rows } = await client.query('SELECT role_id FROM roles WHERE role_name = $1', [roleName]);
  return rows[0] || null;
};

const asignarRol = async (userId, roleId, client = pool) => {
  await client.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, roleId]);
};

const eliminar = async (id, empresaId) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1 AND empresa_id = $2', [id, empresaId]);
};

const actualizarImagen = async (idUsuario, imagen, empresaId) => {
  const { rowCount } = await pool.query(
    'UPDATE usuarios SET imagen = $1 WHERE id = $2 AND empresa_id = $3',
    [imagen, idUsuario, empresaId],
  );
  return rowCount;
};

const contar = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS cantidad FROM usuarios WHERE empresa_id = $1',
    [empresaId],
  );
  return rows;
};

module.exports = {
  buscarTodosLosNombresUsuario,
  buscarTodosConRoles,
  buscarPorId,
  buscarPorNombreUsuario,
  buscarPorIdConRol,
  crear,
  buscarRolPorNombre,
  asignarRol,
  eliminar,
  actualizarImagen,
  contar,
};
