const { AsyncLocalStorage } = require('async_hooks');
const { Pool } = require('pg');
const config = require('../config');

const tenantContext = new AsyncLocalStorage();

const sslConfig = config.isProd ? { ssl: { rejectUnauthorized: true } } : {};

const adminPool = new Pool({ ...config.db, ...sslConfig });

const appPool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.appUser,
  password: config.db.appPassword,
  database: config.db.database,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis,
  ...sslConfig,
});

const query = async (text, params) => {
  const store = tenantContext.getStore();
  if (store?.empresaId) {
    const client = await appPool.connect();
    try {
      await client.query(`SELECT set_config('app.current_empresa_id', $1, false)`, [
        String(store.empresaId),
      ]);
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }
  return appPool.query(text, params);
};

const withTransaction = async (callback) => {
  const client = await appPool.connect();
  try {
    await client.query('BEGIN');
    const store = tenantContext.getStore();
    if (store?.empresaId) {
      await client.query(`SELECT set_config('app.current_empresa_id', $1, true)`, [
        String(store.empresaId),
      ]);
    }
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const adminWithTransaction = async (callback) => {
  const client = await adminPool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { query, connect: appPool.connect.bind(appPool) };
module.exports.appPool = appPool;
module.exports.withTransaction = withTransaction;
module.exports.adminPool = adminPool;
module.exports.adminWithTransaction = adminWithTransaction;
module.exports.tenantContext = tenantContext;
