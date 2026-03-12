const bcrypt = require('bcrypt');
const { adminPool, adminWithTransaction } = require('../db/pool');
const usuariosRepo = require('../repositories/usuarios.repository');
const empresasRepo = require('../repositories/empresas.repository');
const loginService = require('./login.service');

const registrarAdmin = async (empresaData, userData) => {
  const result = await adminWithTransaction(async (client) => {
    const empresa = await empresasRepo.crear(empresaData, client);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await usuariosRepo.crear(
      {
        username: userData.username,
        hashedPassword,
        empresaId: empresa.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        fecha_nacimiento: userData.fecha_nacimiento,
        dni: userData.dni,
        telefono: userData.telefono,
        email: userData.email,
      },
      client,
    );

    const role = await usuariosRepo.buscarRolPorNombre('Administrador', client);
    await usuariosRepo.asignarRol(user.id, role.role_id, client);

    return { userId: user.id, empresaId: empresa.id, empresaNombre: empresa.nombre };
  });

  const userForToken = await usuariosRepo.buscarPorNombreUsuario(userData.username, adminPool);
  const { accessToken, refreshToken } = await loginService.generarParDeTokens(userForToken);

  return {
    token: accessToken,
    refreshToken,
    userId: result.userId,
    userName: userData.username,
    userRole: 'Administrador',
    imagen: '',
    empresaId: result.empresaId,
    empresaNombre: result.empresaNombre,
  };
};

module.exports = { registrarAdmin };
