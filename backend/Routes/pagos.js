const express = require('express');
const pagos = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/pagos.schemas');
const service = require('../services/pagos.service');
const { requireAdmin } = require('../middleware/auth');

pagos.get(
  '/',
  asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.tipo) filters.tipo = req.query.tipo;
    res.json(await service.obtenerTodos(req.user.empresaId, filters));
  }),
);

pagos.get(
  '/filtrando',
  validate(schemas.filtrarPagos, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerFiltrado(req.user.empresaId, req.query));
  }),
);

pagos.get(
  '/:idUsuario',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPorUsuario(req.user.empresaId, req.params.idUsuario));
  }),
);

pagos.put(
  '/:id',
  validate(schemas.actualizarPago),
  asyncHandler(async (req, res) => {
    await service.actualizar(req.params.id, req.user.empresaId, req.body);
    res.json({ message: 'Pago actualizado con éxito' });
  }),
);

pagos.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.id, req.user.empresaId);
    res.json({ message: 'Pago borrado correctamente' });
  }),
);

pagos.post(
  '/compras/:idUsuario',
  requireAdmin,
  validate(schemas.crearCompra),
  asyncHandler(async (req, res) => {
    await service.crearCompra(req.params.idUsuario, req.user.empresaId, req.body);
    res.status(201).json({ message: 'Compra registrada con éxito' });
  }),
);

pagos.post(
  '/ventas/:idUsuario',
  requireAdmin,
  validate(schemas.crearVenta),
  asyncHandler(async (req, res) => {
    await service.crearVenta(req.params.idUsuario, req.user.empresaId, req.body);
    res.status(201).json({ message: 'Venta registrada con éxito' });
  }),
);

module.exports = pagos;
