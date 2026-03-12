const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.db);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function getAppliedVersions(client) {
  const { rows } = await client.query('SELECT version FROM schema_migrations ORDER BY version');
  return new Set(rows.map((r) => r.version));
}

function getMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => {
      const match = f.match(/^(\d+)_(.+)\.sql$/);
      if (!match) return null;
      return { version: parseInt(match[1], 10), name: f, path: path.join(MIGRATIONS_DIR, f) };
    })
    .filter(Boolean);
}

async function migrate() {
  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);
    const applied = await getAppliedVersions(client);
    const migrations = getMigrationFiles();

    const { rows: tables } = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'usuarios'
    `);
    const dbExists = tables.length > 0;

    for (const migration of migrations) {
      if (applied.has(migration.version)) {
        console.log(`  skip  ${migration.name} (already applied)`);
        continue;
      }

      if (migration.version === 0 && dbExists) {
        await client.query('INSERT INTO schema_migrations (version, name) VALUES ($1, $2)', [
          migration.version,
          migration.name,
        ]);
        console.log(`  mark  ${migration.name} (baseline — DB already exists)`);
        continue;
      }

      let sql = fs.readFileSync(migration.path, 'utf8');
      sql = sql.replace(/__DB_APP_PASSWORD__/g, config.db.appPassword);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version, name) VALUES ($1, $2)', [
          migration.version,
          migration.name,
        ]);
        await client.query('COMMIT');
        console.log(`  apply ${migration.name}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  FAIL  ${migration.name}: ${err.message}`);
        throw err;
      }
    }

    console.log('Migrations complete.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
