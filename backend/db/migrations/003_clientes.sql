CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(500),
  telefono VARCHAR(50),
  email VARCHAR(255),
  cuit_dni VARCHAR(20),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa ON clientes(empresa_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_nombre_empresa ON clientes(nombre, empresa_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_cuit_empresa ON clientes(empresa_id, cuit_dni) WHERE cuit_dni IS NOT NULL;
