const express = require('express');
const principal = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const principalSchemas = require('../validation/principal.schemas');
const service = require('../services/principal.service');

principal.get(
  '/dashboard',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerDashboard(req.user.empresaId));
  }),
);

principal.get(
  '/filtrando',
  validate(principalSchemas.fechaRange, 'query'),
  asyncHandler(async (req, res) => {
    res.json(
      await service.obtenerPagosPorRangoFechas(
        req.user.empresaId,
        req.query.fechadesde,
        req.query.fechahasta,
      ),
    );
  }),
);

principal.get(
  '/filtrandocantidad',
  validate(principalSchemas.fechaRange, 'query'),
  asyncHandler(async (req, res) => {
    res.json(
      await service.obtenerConteoPagosEnRango(
        req.user.empresaId,
        req.query.fechadesde,
        req.query.fechahasta,
      ),
    );
  }),
);

principal.get(
  '/contando',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerConteoTotal(req.user.empresaId));
  }),
);

principal.get(
  '/pagosporanio',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPagosPorAnioActual(req.user.empresaId));
  }),
);

principal.get(
  '/pagosporaniofiltrado',
  validate(principalSchemas.anioFiltrado, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPagosPorAnio(req.user.empresaId, req.query.añoFiltrado));
  }),
);

principal.get(
  '/totalpagofiltradoporanio',
  validate(principalSchemas.anioFiltrado, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerTotalPorAnio(req.user.empresaId, req.query.añoFiltrado));
  }),
);

principal.get(
  '/mesactual',
  asyncHandler(async (req, res) => {
    const counts = await service.obtenerConteosMensuales(req.user.empresaId);
    res.json([{ PagosMesActual: counts.PagosMesActual }]);
  }),
);

principal.get(
  '/mesanterior',
  asyncHandler(async (req, res) => {
    const counts = await service.obtenerConteosMensuales(req.user.empresaId);
    res.json([{ PagosMesAnterior: counts.PagosMesAnterior }]);
  }),
);

principal.get(
  '/usuarios',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerConteoUsuarios(req.user.empresaId));
  }),
);

principal.get(
  '/ingresosegresosgrafico',
  validate(principalSchemas.fechaRange, 'query'),
  asyncHandler(async (req, res) => {
    res.json(
      await service.obtenerGraficoIngresosEgresos(
        req.user.empresaId,
        req.query.fechadesde,
        req.query.fechahasta,
      ),
    );
  }),
);

principal.get(
  '/ingresosegresosanioactual',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerIngresosEgresosAnioActual(req.user.empresaId));
  }),
);

principal.get(
  '/ingresosegresostotalpagofiltradoporanio',
  validate(principalSchemas.anioFiltrado, 'query'),
  asyncHandler(async (req, res) => {
    res.json(
      await service.obtenerIngresosEgresosPorAnio(req.user.empresaId, req.query.añoFiltrado),
    );
  }),
);

principal.get(
  '/filtrar',
  validate(principalSchemas.filtrarDashboard, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await service.filtrarDashboard(req.user.empresaId, req.query.desde, req.query.hasta));
  }),
);

principal.get(
  '/resumenmes',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerResumenMesActual(req.user.empresaId));
  }),
);

principal.get(
  '/proveedoresbalance',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerBalancesProveedores(req.user.empresaId));
  }),
);

principal.get(
  '/mediosdepago',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerDistribucionMediosPago(req.user.empresaId));
  }),
);

principal.get(
  '/ultimospagos',
  asyncHandler(async (req, res) => {
    res.json(await service.obtenerPagosRecientes(req.user.empresaId, 5));
  }),
);

module.exports = principal;
