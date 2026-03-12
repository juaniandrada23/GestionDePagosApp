require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida: ${name}`);
  }
  return value;
};

const requiredInProd = (name, devDefault) => {
  const value = process.env[name];
  if (!value && isProd) {
    throw new Error(`Variable de entorno requerida en produccion: ${name}`);
  }
  return value || devDefault;
};

const config = {
  port: process.env.PORT || 3001,
  isProd,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: requiredInProd('DB_PASSWORD', 'postgres'),
    database: process.env.DB_NAME || 'gestion_de_pagos',
    max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    appUser: process.env.DB_APP_USER || 'app_user',
    appPassword: requiredInProd('DB_APP_PASSWORD', 'app_password'),
  },
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshTokenExpiresIn:
    parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10) || 7 * 24 * 60 * 60 * 1000,
  corsOrigin: requiredInProd('CORS_ORIGIN', 'http://localhost:3000'),
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: requiredInProd('MINIO_ACCESS_KEY', 'minioadmin'),
    secretKey: requiredInProd('MINIO_SECRET_KEY', 'minioadmin123'),
    bucket: process.env.MINIO_BUCKET || 'usuarios-imagenes',
  },
};

module.exports = config;
