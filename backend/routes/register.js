const express = require('express');
const register = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const schemas = require('../validation/register.schemas');
const registerService = require('../services/register.service');
const config = require('../config');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: config.refreshTokenExpiresIn,
};

register.post(
  '/',
  validate(schemas.register),
  asyncHandler(async (req, res) => {
    const {
      username,
      password,
      nombre,
      apellido,
      fecha_nacimiento,
      dni,
      telefono,
      email,
      empresa_nombre,
      empresa_direccion,
      empresa_telefono,
      empresa_email,
      empresa_cuit,
      empresa_rubro,
    } = req.body;

    const empresaData = {
      nombre: empresa_nombre,
      direccion: empresa_direccion,
      telefono: empresa_telefono,
      email: empresa_email,
      cuit: empresa_cuit,
      rubro: empresa_rubro,
    };

    const userData = {
      username,
      password,
      nombre,
      apellido,
      fecha_nacimiento,
      dni,
      telefono,
      email,
    };

    const result = await registerService.registrarAdmin(empresaData, userData);
    const { refreshToken, ...body } = result;
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json(body);
  }),
);

module.exports = register;
