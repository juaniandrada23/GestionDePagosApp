const express = require('express');
const calculos = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/calculos.schemas');
const service = require('../services/calculos.service');
const { requireAdmin } = require('../middleware/auth');

calculos.get(
  '/total',
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerTotal(req.user.empresaId));
  }),
);

calculos.get(
  '/filtrando',
  requireAdmin,
  validate(schemas.filtrarCalculos, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerFiltrado(req.user.empresaId, req.query));
  }),
);

calculos.get(
  '/totalgeneral',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { fechaDesde, fechaHasta, nombreProveedor, nombreCliente } = req.query;
    res.json(
      await service.obtenerTotalGeneral(
        req.user.empresaId,
        fechaDesde,
        fechaHasta,
        nombreProveedor,
        nombreCliente,
      ),
    );
  }),
);

calculos.get(
  '/ingresosyegresos',
  requireAdmin,
  validate(schemas.ingresosYEgresos, 'query'),
  asyncHandler(async (req, res) => {
    const { fechadesde, fechahasta, nombreProveedor, nombreCliente } = req.query;
    res.json(
      await service.obtenerIngresosYEgresos(
        req.user.empresaId,
        fechadesde,
        fechahasta,
        nombreProveedor,
        nombreCliente,
      ),
    );
  }),
);

module.exports = calculos;
