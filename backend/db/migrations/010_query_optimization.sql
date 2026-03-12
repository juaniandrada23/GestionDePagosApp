-- movimientos_stock: queries por material+empresa ordenadas por fecha
CREATE INDEX IF NOT EXISTS idx_movstock_material_empresa_fecha
  ON movimientos_stock(material_id, empresa_id, fecha DESC);

-- clientes activos para dropdowns (nombre ordenado)
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_activo_nombre
  ON clientes(empresa_id, nombre) WHERE activo = TRUE;

-- materiales con stock bajo
CREATE INDEX IF NOT EXISTS idx_materiales_stock_bajo
  ON materiales(empresa_id) WHERE activo = TRUE AND stock_actual <= stock_minimo;

-- presupuestos items por presupuesto_id (acelera el JOIN en buscarPorId)
CREATE INDEX IF NOT EXISTS idx_presupuesto_items_presupuesto_id
  ON presupuesto_items(presupuesto_id);

-- pagos por fecha+empresa (acelera generate_series JOINs en dashboard)
CREATE INDEX IF NOT EXISTS idx_pagos_empresa_fecha
  ON pagos(empresa_id, fecha);
