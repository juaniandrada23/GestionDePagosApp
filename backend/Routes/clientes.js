const express = require('express');
const clientes = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/clientes.schemas');
const service = require('../services/clientes.service');
const { requireAdmin } = require('../middleware/auth');

clientes.get(
  '/',
  asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.activo !== undefined) filters.activo = req.query.activo === 'true';
    if (req.query.busqueda) filters.busqueda = req.query.busqueda;
    res.json(await service.obtenerTodos(req.user.empresaId, filters));
  }),
);

clientes.get(
  '/nombres',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerNombres(req.user.empresaId));
  }),
);

clientes.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPorId(req.params.id, req.user.empresaId));
  }),
);

clientes.post(
  '/',
  requireAdmin,
  validate(schemas.crearCliente),
  asyncHandler(async (req, res) => {
    const result = await service.crear(req.body, req.user.empresaId);
    res.status(201).json(result);
  }),
);

clientes.put(
  '/:id',
  requireAdmin,
  validate(schemas.actualizarCliente),
  asyncHandler(async (req, res) => {
    const result = await service.actualizar(req.params.id, req.body, req.user.empresaId);
    res.json(result);
  }),
);

clientes.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.id, req.user.empresaId);
    res.json({ message: 'Cliente desactivado correctamente' });
  }),
);

module.exports = clientes;
