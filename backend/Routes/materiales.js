const express = require('express');
const materiales = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/materiales.schemas');
const service = require('../services/materiales.service');
const { requireAdmin } = require('../middleware/auth');

materiales.get(
  '/',
  asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.activo !== undefined) filters.activo = req.query.activo === 'true';
    if (req.query.categoria_id) filters.categoria_id = req.query.categoria_id;
    if (req.query.busqueda) filters.busqueda = req.query.busqueda;
    res.json(await service.obtenerTodos(req.user.empresaId, filters));
  }),
);

materiales.get(
  '/alertas/stock-bajo',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerStockBajo(req.user.empresaId));
  }),
);

materiales.get(
  '/unidades',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerUnidades(req.user.empresaId));
  }),
);

materiales.get(
  '/categorias',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerCategorias(req.user.empresaId));
  }),
);

materiales.post(
  '/categorias',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const result = await service.crearCategoria(req.body.nombre, req.user.empresaId);
    res.status(201).json(result);
  }),
);

materiales.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPorId(req.params.id, req.user.empresaId));
  }),
);

materiales.post(
  '/',
  requireAdmin,
  validate(schemas.crearMaterial),
  asyncHandler(async (req, res) => {
    const result = await service.crear(req.body, req.user.empresaId);
    res.status(201).json(result);
  }),
);

materiales.put(
  '/:id',
  requireAdmin,
  validate(schemas.actualizarMaterial),
  asyncHandler(async (req, res) => {
    const result = await service.actualizar(req.params.id, req.body, req.user.empresaId);
    res.json(result);
  }),
);

materiales.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.id, req.user.empresaId);
    res.json({ message: 'Material desactivado correctamente' });
  }),
);

materiales.get(
  '/:id/movimientos',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerMovimientos(req.params.id, req.user.empresaId));
  }),
);

materiales.post(
  '/:id/movimientos',
  validate(schemas.crearMovimiento),
  asyncHandler(async (req, res) => {
    const data = { ...req.body, material_id: parseInt(req.params.id) };
    const result = await service.registrarMovimiento(req.user.empresaId, req.user.userId, data);
    res.status(201).json(result);
  }),
);

module.exports = materiales;
