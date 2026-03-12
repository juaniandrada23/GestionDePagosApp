const express = require('express');
const proveedores = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/proveedores.schemas');
const service = require('../services/proveedores.service');
const { requireAdmin } = require('../middleware/auth');

proveedores.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerTodos(req.user.empresaId));
  }),
);

proveedores.get(
  '/nombreprov',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerNombres(req.user.empresaId));
  }),
);

proveedores.post(
  '/',
  requireAdmin,
  validate(schemas.nombre),
  asyncHandler(async (req, res) => {
    const { id } = await service.crear(req.body.nombre, req.user.empresaId);
    res.status(201).json({ message: 'Proveedor agregado correctamente', id });
  }),
);

proveedores.put(
  '/:id',
  requireAdmin,
  validate(schemas.nombre),
  asyncHandler(async (req, res) => {
    await service.actualizar(req.params.id, req.body.nombre, req.user.empresaId);
    res.json({ message: 'Proveedor actualizado correctamente' });
  }),
);

proveedores.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.id, req.user.empresaId);
    res.json({ message: 'Proveedor borrado correctamente' });
  }),
);

module.exports = proveedores;
