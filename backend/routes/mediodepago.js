const express = require('express');
const mediodepago = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/mediodepago.schemas');
const service = require('../services/mediodepago.service');
const { requireAdmin } = require('../middleware/auth');

mediodepago.get(
  '/nombremediopago',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerTodos(req.user.empresaId));
  }),
);

mediodepago.post(
  '/agregarmediopago',
  requireAdmin,
  validate(schemas.crear),
  asyncHandler(async (req, res) => {
    await service.crear(req.body.nombreMedioPago, req.user.empresaId);
    res.status(201).json({ message: 'Medio de pago agregado exitosamente' });
  }),
);

mediodepago.delete(
  '/borrarmediopago/:nombreMedioPago',
  requireAdmin,
  asyncHandler(async (req, res) => {
    await service.eliminar(req.params.nombreMedioPago, req.user.empresaId);
    res.json({ message: 'Medio de pago eliminado exitosamente' });
  }),
);

mediodepago.put(
  '/actualizarmediopago/:nombreMedioPago',
  requireAdmin,
  validate(schemas.actualizar),
  asyncHandler(async (req, res) => {
    await service.actualizar(
      req.params.nombreMedioPago,
      req.body.nuevoNombreMedioPago,
      req.user.empresaId,
    );
    res.json({ message: 'Medio de pago actualizado exitosamente' });
  }),
);

module.exports = mediodepago;
