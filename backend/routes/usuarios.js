const express = require('express');
const usuarios = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/usuarios.schemas');
const service = require('../services/usuarios.service');
const loginService = require('../services/login.service');
const storageService = require('../services/storage.service');
const upload = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');
const setTenantContext = require('../middleware/tenantContext');
const { ValidationError, ForbiddenError } = require('../errors/AppError');

usuarios.get(
  '/nombres',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerNombresUsuario(req.user.empresaId));
  }),
);

usuarios.get(
  '/total',
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerTodosConRoles(req.user.empresaId));
  }),
);

usuarios.post(
  '/',
  requireAdmin,
  validate(schemas.crearUsuario),
  asyncHandler(async (req, res) => {
    await loginService.crearEmpleado(req.body.username, req.body.password, req.user.empresaId);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  }),
);

usuarios.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.id, req.user.empresaId);
    res.json({ message: 'Usuario borrado correctamente' });
  }),
);

usuarios.post(
  '/imagen',
  upload.single('imagen'),
  setTenantContext,
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ValidationError('Debes proporcionar una imagen');
    }
    const idUsuario = req.body.idUsuario;
    if (!idUsuario) {
      throw new ValidationError('Debes proporcionar el ID de usuario');
    }

    if (req.user.userId !== parseInt(idUsuario) && req.user.userRole !== 'Administrador') {
      throw new ForbiddenError('No puedes cambiar la imagen de otro usuario');
    }

    const { empresaId } = req.user;

    const sessionData = await service.obtenerDatosSesion(idUsuario, empresaId);
    if (sessionData.length > 0 && sessionData[0].imagen) {
      await storageService.eliminarArchivo(sessionData[0].imagen);
    }

    const url = await storageService.subirArchivo(req.file, idUsuario);
    await service.actualizarImagen(idUsuario, url, empresaId);
    res.json({ message: 'Imagen de perfil actualizada correctamente', url });
  }),
);

usuarios.get(
  '/datosusuariosesion',
  validate(schemas.idUsuarioQuery, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerDatosSesion(req.query.idUsuario, req.user.empresaId));
  }),
);

module.exports = usuarios;
