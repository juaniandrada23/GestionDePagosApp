CREATE TABLE unidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    abreviatura VARCHAR(20) NOT NULL,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    UNIQUE(nombre, empresa_id),
    UNIQUE(abreviatura, empresa_id)
);

CREATE INDEX idx_unidades_empresa ON unidades(empresa_id);

ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON unidades
  FOR ALL TO app_user
  USING (empresa_id = current_setting('app.current_empresa_id')::int)
  WITH CHECK (empresa_id = current_setting('app.current_empresa_id')::int);

GRANT SELECT, INSERT, UPDATE, DELETE ON unidades TO app_user;
GRANT USAGE, SELECT ON SEQUENCE unidades_id_seq TO app_user;

INSERT INTO unidades (nombre, abreviatura, empresa_id)
SELECT u.nombre, u.abreviatura, e.id
FROM empresas e
CROSS JOIN (VALUES
  ('Unidad', 'un'),
  ('Metro', 'm'),
  ('Metro cuadrado', 'm²'),
  ('Metro cúbico', 'm³'),
  ('Kilogramo', 'kg'),
  ('Tonelada', 'tn'),
  ('Litro', 'L'),
  ('Bolsa', 'bolsa'),
  ('Barra', 'barra'),
  ('Placa', 'placa'),
  ('Rollo', 'rollo'),
  ('Balde', 'balde'),
  ('Lata', 'lata'),
  ('Paño', 'paño'),
  ('Caja', 'caja'),
  ('Par', 'par')
) AS u(nombre, abreviatura)
ON CONFLICT DO NOTHING;

ALTER TABLE materiales ADD COLUMN unidad_id INTEGER REFERENCES unidades(id);

UPDATE materiales m SET unidad_id = u.id
FROM unidades u
WHERE LOWER(m.unidad) = LOWER(u.abreviatura) AND u.empresa_id = m.empresa_id;

UPDATE materiales m SET unidad_id = u.id
FROM unidades u
WHERE m.unidad_id IS NULL AND LOWER(m.unidad) = LOWER(u.nombre) AND u.empresa_id = m.empresa_id;

UPDATE materiales m SET unidad_id = u.id
FROM unidades u
WHERE m.unidad_id IS NULL AND u.nombre = 'Unidad' AND u.empresa_id = m.empresa_id;

ALTER TABLE materiales ALTER COLUMN unidad_id SET NOT NULL;
ALTER TABLE materiales DROP COLUMN unidad;
