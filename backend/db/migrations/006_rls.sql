DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD '__DB_APP_PASSWORD__';
  END IF;
END$$;

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app_user;

ALTER TABLE presupuesto_items
  ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id);

UPDATE presupuesto_items pi
  SET empresa_id = p.empresa_id
  FROM presupuestos p
  WHERE pi.presupuesto_id = p.id AND pi.empresa_id IS NULL;

ALTER TABLE presupuesto_items ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_presupuesto_items_empresa
  ON presupuesto_items(empresa_id);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE medio_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuesto_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON usuarios
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON proveedores
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON medio_pago
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON pagos
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON categorias_material
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON materiales
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON movimientos_stock
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON clientes
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON presupuestos
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

CREATE POLICY tenant_isolation ON presupuesto_items
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

GRANT EXECUTE ON FUNCTION next_presupuesto_numero(integer) TO app_user;
