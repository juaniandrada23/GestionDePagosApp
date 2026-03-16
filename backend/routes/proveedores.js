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
    const filters = {};
    if (req.query.activo !== undefined) filters.activo = req.query.activo === 'true';
    if (req.query.busqueda) filters.busqueda = req.query.busqueda;
    res.json(await service.obtenerTodos(req.user.empresaId, filters));
  }),
);

proveedores.get(
  '/nombreprov',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerNombres(req.user.empresaId));
  }),
);

proveedores.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const proveedor = await service.obtenerPorId(req.params.id, req.user.empresaId);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(proveedor);
  }),
);

proveedores.post(
  '/',
  requireAdmin,
  validate(schemas.crearProveedor),
  asyncHandler(async (req, res) => {
    const proveedor = await service.crear(req.body, req.user.empresaId);
    res.status(201).json({ message: 'Proveedor agregado correctamente', id: proveedor.id });
  }),
);

proveedores.put(
  '/:id',
  requireAdmin,
  validate(schemas.actualizarProveedor),
  asyncHandler(async (req, res) => {
    await service.actualizar(req.params.id, req.body, req.user.empresaId);
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
