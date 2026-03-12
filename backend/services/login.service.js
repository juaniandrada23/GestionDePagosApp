const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { adminPool, adminWithTransaction } = require('../db/pool');
const usuariosRepo = require('../repositories/usuarios.repository');
const authRepo = require('../repositories/auth.repository');
const { UnauthorizedError } = require('../errors/AppError');

const hashearToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const crearEmpleado = async (username, password, empresaId) => {
  await adminWithTransaction(async (client) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usuariosRepo.crear({ username, hashedPassword, empresaId }, client);
    const role = await usuariosRepo.buscarRolPorNombre('Usuario', client);
    await usuariosRepo.asignarRol(user.id, role.role_id, client);
  });
};

const generarParDeTokens = async (user) => {
  const jti = crypto.randomUUID();

  const accessToken = jwt.sign(
    {
      userId: user.id,
      userName: user.username,
      userRole: user.role_name,
      imagen: user.imagen,
      empresaId: user.empresa_id,
      empresaNombre: user.empresa_nombre,
      jti,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn, algorithm: 'HS256' },
  );

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = hashearToken(refreshToken);
  const expiresAt = new Date(Date.now() + config.refreshTokenExpiresIn);

  await authRepo.crearTokenRefresco(user.id, refreshTokenHash, expiresAt);

  return { accessToken, refreshToken };
};

const iniciarSesion = async (username, password) => {
  const user = await usuariosRepo.buscarPorNombreUsuario(username, adminPool);
  if (!user) {
    throw new UnauthorizedError('Credenciales incorrectas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Credenciales incorrectas');
  }

  const { accessToken, refreshToken } = await generarParDeTokens(user);

  return {
    token: accessToken,
    refreshToken,
    userId: user.id,
    userName: user.username,
    userRole: user.role_name,
    imagen: user.imagen,
    empresaId: user.empresa_id,
    empresaNombre: user.empresa_nombre,
  };
};

const refrescarToken = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new UnauthorizedError('Refresh token no proporcionado');
  }

  const tokenHash = hashearToken(refreshTokenValue);
  const stored = await authRepo.buscarTokenRefresco(tokenHash);

  if (!stored || new Date(stored.expires_at) < new Date()) {
    if (stored) await authRepo.eliminarTokenRefresco(tokenHash);
    throw new UnauthorizedError('Refresh token inválido o expirado');
  }

  await authRepo.eliminarTokenRefresco(tokenHash);

  const user = await usuariosRepo.buscarPorIdConRol(stored.user_id, adminPool);
  if (!user) {
    throw new UnauthorizedError('Usuario no encontrado');
  }

  const { accessToken, refreshToken } = await generarParDeTokens(user);

  return {
    token: accessToken,
    refreshToken,
    userId: user.id,
    userName: user.username,
    userRole: user.role_name,
    imagen: user.imagen,
    empresaId: user.empresa_id,
    empresaNombre: user.empresa_nombre,
  };
};

const cerrarSesion = async (jti, exp, userId) => {
  if (jti && exp) {
    const expiresAt = new Date(exp * 1000);
    await authRepo.agregarTokenListaNegra(jti, expiresAt);
  }
  if (userId) {
    await authRepo.eliminarTokensRefrescoUsuario(userId);
  }
};

module.exports = { crearEmpleado, iniciarSesion, refrescarToken, cerrarSesion, generarParDeTokens };
