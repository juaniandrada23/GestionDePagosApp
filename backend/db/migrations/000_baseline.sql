CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255)
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    imagen VARCHAR(255),
    descripcion VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE medio_pago (
    "idMedioPago" SERIAL PRIMARY KEY,
    "nombreMedioPago" VARCHAR(255) NOT NULL
);

CREATE TABLE pagos (
    "idPago" SERIAL PRIMARY KEY,
    "idProveedor" INTEGER REFERENCES proveedores(id),
    monto NUMERIC(10,2),
    fecha DATE,
    "montoUSD" NUMERIC(10,2),
    "usdDelDia" NUMERIC(10,2),
    "idUser" INTEGER REFERENCES usuarios(id),
    "idMedioPago" INTEGER REFERENCES medio_pago("idMedioPago"),
    descripcion VARCHAR(650)
);

CREATE INDEX idx_pagos_fecha ON pagos (fecha);
CREATE INDEX idx_pagos_idproveedor ON pagos ("idProveedor");
CREATE INDEX idx_pagos_iduser ON pagos ("idUser");
CREATE INDEX idx_pagos_idmediopago ON pagos ("idMedioPago");
CREATE INDEX idx_pagos_iduser_fecha ON pagos ("idUser", fecha);
CREATE INDEX idx_proveedores_nombre ON proveedores (nombre);
CREATE INDEX idx_mediopago_nombre ON medio_pago ("nombreMedioPago");
CREATE INDEX idx_usuarios_username ON usuarios (username);

INSERT INTO roles (role_id, role_name) VALUES (1, 'Administrador'), (2, 'Usuario');

INSERT INTO usuarios (username, password) VALUES
    ('admin', '$2b$10$4.a4yjhzSzXjBv3th0xXYez7RSTdMQUhze9VKwCqpTgxIpLEbm1be');
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

CREATE TABLE blacklisted_tokens (
    jti VARCHAR(36) PRIMARY KEY,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_blacklisted_expires ON blacklisted_tokens(expires_at);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
