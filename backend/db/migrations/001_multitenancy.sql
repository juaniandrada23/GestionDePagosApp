CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(500),
    telefono VARCHAR(50),
    email VARCHAR(255),
    logo VARCHAR(255),
    cuit VARCHAR(20),
    rubro VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nombre VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellido VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS dni VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefono VARCHAR(50);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS empresa_id INTEGER REFERENCES empresas(id);

ALTER TABLE proveedores ADD COLUMN empresa_id INTEGER REFERENCES empresas(id);
ALTER TABLE medio_pago ADD COLUMN empresa_id INTEGER REFERENCES empresas(id);
ALTER TABLE pagos ADD COLUMN empresa_id INTEGER REFERENCES empresas(id);

DO $$ DECLARE def_id INTEGER;
BEGIN
    INSERT INTO empresas (nombre) VALUES ('Empresa Default') RETURNING id INTO def_id;
    UPDATE usuarios SET empresa_id = def_id WHERE empresa_id IS NULL;
    UPDATE proveedores SET empresa_id = def_id WHERE empresa_id IS NULL;
    UPDATE medio_pago SET empresa_id = def_id WHERE empresa_id IS NULL;
    UPDATE pagos SET empresa_id = def_id WHERE empresa_id IS NULL;
END $$;

ALTER TABLE usuarios ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE proveedores ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE medio_pago ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE pagos ALTER COLUMN empresa_id SET NOT NULL;

CREATE INDEX idx_empresas_nombre ON empresas(nombre);
CREATE INDEX idx_usuarios_empresa ON usuarios(empresa_id);
CREATE INDEX idx_proveedores_empresa ON proveedores(empresa_id);
CREATE INDEX idx_mediopago_empresa ON medio_pago(empresa_id);
CREATE INDEX idx_pagos_empresa ON pagos(empresa_id);
CREATE INDEX idx_pagos_empresa_fecha ON pagos(empresa_id, fecha);

ALTER TABLE proveedores DROP CONSTRAINT proveedores_nombre_key;
CREATE UNIQUE INDEX idx_proveedores_nombre_empresa ON proveedores(nombre, empresa_id);
