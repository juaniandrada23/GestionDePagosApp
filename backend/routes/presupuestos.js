const express = require('express');
const presupuestos = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/presupuestos.schemas');
const service = require('../services/presupuestos.service');
const { requireAdmin } = require('../middleware/auth');

presupuestos.get(
  '/',
  asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.estado) filters.estado = req.query.estado;
    if (req.query.cliente_id) filters.cliente_id = req.query.cliente_id;
    if (req.query.fechadesde) filters.fechadesde = req.query.fechadesde;
    if (req.query.fechahasta) filters.fechahasta = req.query.fechahasta;
    res.json(await service.obtenerTodos(req.user.empresaId, filters));
  }),
);

presupuestos.get(
  '/stats',
  asyncHandler(async (req, res) => {
    res.json(await service.contarPorEstado(req.user.empresaId));
  }),
);

presupuestos.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPorId(req.params.id, req.user.empresaId));
  }),
);

presupuestos.get(
  '/:id/pdf-data',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerDatosPdf(req.params.id, req.user.empresaId));
  }),
);

presupuestos.post(
  '/',
  requireAdmin,
  validate(schemas.crearPresupuesto),
  asyncHandler(async (req, res) => {
    const result = await service.crear(req.user.empresaId, req.user.userId, req.body);
    res.status(201).json(result);
  }),
);

presupuestos.put(
  '/:id',
  requireAdmin,
  validate(schemas.actualizarPresupuesto),
  asyncHandler(async (req, res) => {
    const result = await service.actualizar(req.params.id, req.user.empresaId, req.body);
    res.json(result);
  }),
);

presupuestos.patch(
  '/:id/estado',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { estado } = req.body;
    const result = await service.cambiarEstado(req.params.id, req.user.empresaId, estado);
    res.json(result);
  }),
);

presupuestos.post(
  '/:id/aceptar',
  requireAdmin,
  validate(schemas.aceptarPresupuesto),
  asyncHandler(async (req, res) => {
    const result = await service.aceptar(
      req.params.id,
      req.user.empresaId,
      req.user.userId,
      req.body,
    );
    res.json(result);
  }),
);

presupuestos.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.id, req.user.empresaId);
    res.json({ message: 'Presupuesto eliminado correctamente' });
  }),
);

module.exports = presupuestos;
