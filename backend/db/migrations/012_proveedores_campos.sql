-- P1: Agregar campos a proveedores para paridad con clientes
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS direccion VARCHAR(500);
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS telefono VARCHAR(50);
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS cuit_dni VARCHAR(20);
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Indice parcial para busquedas de proveedores activos
CREATE INDEX IF NOT EXISTS idx_proveedores_activo
  ON proveedores(empresa_id) WHERE activo = TRUE;
