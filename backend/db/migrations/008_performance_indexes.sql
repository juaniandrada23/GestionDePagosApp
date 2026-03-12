CREATE INDEX IF NOT EXISTS idx_pagos_empresa_tipo_fecha ON pagos(empresa_id, tipo, fecha);

CREATE INDEX IF NOT EXISTS idx_pagos_empresa_proveedor_fecha ON pagos(empresa_id, "idProveedor", fecha);

CREATE INDEX IF NOT EXISTS idx_pagos_empresa_cliente_fecha ON pagos(empresa_id, "idCliente", fecha);

CREATE INDEX IF NOT EXISTS idx_pagos_empresa_fecha_desc ON pagos(empresa_id, fecha DESC, "idPago" DESC);

CREATE INDEX IF NOT EXISTS idx_clientes_empresa_activo ON clientes(empresa_id, activo);

CREATE INDEX IF NOT EXISTS idx_presupuestos_empresa_estado_fecha ON presupuestos(empresa_id, estado, fecha DESC);

CREATE INDEX IF NOT EXISTS idx_presupuesto_items_material ON presupuesto_items(material_id);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_materiales_nombre_trgm ON materiales USING gin(nombre gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_materiales_codigo_trgm ON materiales USING gin(codigo gin_trgm_ops);
