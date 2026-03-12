CREATE TABLE IF NOT EXISTS presupuestos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  numero INTEGER NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_validez DATE,
  estado VARCHAR(20) NOT NULL DEFAULT 'borrador'
    CHECK (estado IN ('borrador', 'enviado', 'aceptado', 'rechazado')),
  observaciones TEXT,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  descuento_porcentaje NUMERIC(5,2) DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  pago_id INTEGER REFERENCES pagos("idPago"),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_presupuestos_numero ON presupuestos(empresa_id, numero);
CREATE INDEX IF NOT EXISTS idx_presupuestos_empresa ON presupuestos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_cliente ON presupuestos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_estado ON presupuestos(empresa_id, estado);

CREATE TABLE IF NOT EXISTS presupuesto_items (
  id SERIAL PRIMARY KEY,
  presupuesto_id INTEGER NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materiales(id),
  cantidad NUMERIC(10,2) NOT NULL,
  precio_unitario NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  material_nombre VARCHAR(255) NOT NULL,
  material_codigo VARCHAR(100),
  material_unidad VARCHAR(50) NOT NULL DEFAULT 'unidad'
);
CREATE INDEX IF NOT EXISTS idx_presupuesto_items_presupuesto ON presupuesto_items(presupuesto_id);

CREATE OR REPLACE FUNCTION next_presupuesto_numero(p_empresa_id INTEGER)
RETURNS INTEGER AS $$
  SELECT COALESCE(MAX(numero), 0) + 1 FROM presupuestos WHERE empresa_id = p_empresa_id;
$$ LANGUAGE sql;
