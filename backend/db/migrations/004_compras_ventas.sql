ALTER TABLE pagos ADD COLUMN IF NOT EXISTS "idCliente" INTEGER REFERENCES clientes(id);
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS tipo VARCHAR(10) DEFAULT 'compra';

DO $$ BEGIN
  ALTER TABLE pagos ADD CONSTRAINT pagos_tipo_check CHECK (tipo IN ('compra', 'venta'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

UPDATE pagos SET tipo = CASE WHEN monto >= 0 THEN 'venta' ELSE 'compra' END;

CREATE INDEX IF NOT EXISTS idx_pagos_tipo ON pagos(empresa_id, tipo);
CREATE INDEX IF NOT EXISTS idx_pagos_cliente ON pagos("idCliente") WHERE "idCliente" IS NOT NULL;
