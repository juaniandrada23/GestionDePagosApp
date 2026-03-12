CREATE TABLE categorias_material (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    UNIQUE(nombre, empresa_id)
);

CREATE TABLE materiales (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(100),
    categoria_id INTEGER REFERENCES categorias_material(id),
    precio_venta NUMERIC(12,2) NOT NULL DEFAULT 0,
    precio_costo NUMERIC(12,2) DEFAULT 0,
    stock_actual NUMERIC(12,2) NOT NULL DEFAULT 0,
    stock_minimo NUMERIC(12,2) DEFAULT 0,
    unidad VARCHAR(50) DEFAULT 'unidad',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(codigo, empresa_id),
    UNIQUE(nombre, empresa_id)
);

CREATE TABLE movimientos_stock (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL REFERENCES materiales(id),
    empresa_id INTEGER NOT NULL REFERENCES empresas(id),
    cantidad NUMERIC(12,2) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
    motivo VARCHAR(500),
    fecha TIMESTAMP DEFAULT NOW(),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    stock_resultante NUMERIC(12,2) NOT NULL
);

CREATE INDEX idx_materiales_empresa ON materiales(empresa_id);
CREATE INDEX idx_materiales_activo ON materiales(empresa_id, activo);
CREATE INDEX idx_movstock_material ON movimientos_stock(material_id);
CREATE INDEX idx_movstock_empresa_fecha ON movimientos_stock(empresa_id, fecha);
