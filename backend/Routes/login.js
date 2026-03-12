const express = require('express');
const login = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/login.schemas');
const service = require('../services/login.service');
const { auth } = require('../middleware/auth');
const config = require('../config');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/login',
  maxAge: config.refreshTokenExpiresIn,
};

login.post(
  '/iniciosesion',
  validate(schemas.credentials),
  asyncHandler(async (req, res) => {
    const result = await service.iniciarSesion(req.body.username, req.body.password);
    const { refreshToken, ...body } = result;
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json(body);
  }),
);

login.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken;
    const result = await service.refrescarToken(oldRefreshToken);
    const { refreshToken, ...body } = result;
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.json(body);
  }),
);

login.post(
  '/logout',
  auth,
  asyncHandler(async (req, res) => {
    await service.cerrarSesion(req.user.jti, req.user.exp, req.user.userId);
    res.clearCookie('refreshToken', { path: '/login' });
    res.json({ message: 'Sesión cerrada exitosamente' });
  }),
);

module.exports = login;
