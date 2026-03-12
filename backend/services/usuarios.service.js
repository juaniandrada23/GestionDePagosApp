const usuariosRepo = require('../repositories/usuarios.repository');

const obtenerNombresUsuario = (empresaId) => usuariosRepo.buscarTodosLosNombresUsuario(empresaId);

const obtenerTodosConRoles = (empresaId) => usuariosRepo.buscarTodosConRoles(empresaId);

const eliminar = (id, empresaId) => usuariosRepo.eliminar(id, empresaId);

const actualizarImagen = (idUsuario, imagen, empresaId) =>
  usuariosRepo.actualizarImagen(idUsuario, imagen, empresaId);

const obtenerDatosSesion = (idUsuario, empresaId) => usuariosRepo.buscarPorId(idUsuario, empresaId);

module.exports = {
  obtenerNombresUsuario,
  obtenerTodosConRoles,
  eliminar,
  actualizarImagen,
  obtenerDatosSesion,
};
