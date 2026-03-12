DO $$
DECLARE
  v_emp INTEGER := 1;
  v_admin INTEGER := 1;
  v_user2 INTEGER;
  v_prov1 INTEGER; v_prov2 INTEGER; v_prov3 INTEGER; v_prov4 INTEGER; v_prov5 INTEGER;
  v_prov6 INTEGER; v_prov7 INTEGER; v_prov8 INTEGER;
  v_mp1 INTEGER; v_mp2 INTEGER; v_mp3 INTEGER; v_mp4 INTEGER; v_mp5 INTEGER;
  v_cli1 INTEGER; v_cli2 INTEGER; v_cli3 INTEGER; v_cli4 INTEGER;
  v_cli5 INTEGER; v_cli6 INTEGER; v_cli7 INTEGER;
  v_cat1 INTEGER; v_cat2 INTEGER; v_cat3 INTEGER; v_cat4 INTEGER; v_cat5 INTEGER; v_cat6 INTEGER;
  v_m1 INTEGER; v_m2 INTEGER; v_m3 INTEGER; v_m4 INTEGER; v_m5 INTEGER;
  v_m6 INTEGER; v_m7 INTEGER; v_m8 INTEGER; v_m9 INTEGER; v_m10 INTEGER;
  v_m11 INTEGER; v_m12 INTEGER; v_m13 INTEGER; v_m14 INTEGER; v_m15 INTEGER;
  v_pg INTEGER;
  v_pr1 INTEGER; v_pr2 INTEGER; v_pr3 INTEGER; v_pr4 INTEGER; v_pr5 INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM proveedores LIMIT 1) THEN
    RAISE NOTICE 'Seed data already exists, skipping';
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM empresas WHERE id = v_emp) THEN
    RAISE NOTICE 'No default empresa found, skipping seed';
    RETURN;
  END IF;

  UPDATE empresas SET
    nombre = 'Materiales del Sur SRL',
    direccion = 'Av. San Martín 1250, Buenos Aires',
    telefono = '011-4555-0001',
    email = 'contacto@materialesdelsur.com',
    cuit = '30-71234567-9',
    rubro = 'Construcción'
  WHERE id = v_emp;

  UPDATE usuarios SET
    nombre = 'Carlos', apellido = 'Rodríguez',
    email = 'carlos@materialesdelsur.com', telefono = '011-4555-0002'
  WHERE id = v_admin;

  INSERT INTO usuarios (username, password, nombre, apellido, email, telefono, empresa_id) VALUES
    ('mlopez', '$2b$10$8K1p/a0dL1LXMw/dZ.YXeOQ7lQr3VHN7aVp5uW2zhbfRqW5y5Gy6e',
     'María', 'López', 'maria@materialesdelsur.com', '011-4555-0003', v_emp)
    RETURNING id INTO v_user2;

  INSERT INTO user_roles (user_id, role_id) VALUES (v_user2, 2);

  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Ferretería Industrial SA', v_emp) RETURNING id INTO v_prov1;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Aceros Patagonia', v_emp) RETURNING id INTO v_prov2;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Maderas del Litoral', v_emp) RETURNING id INTO v_prov3;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Pinturas Color SRL', v_emp) RETURNING id INTO v_prov4;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Cementos Argentinos', v_emp) RETURNING id INTO v_prov5;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Distribuidora Eléctrica Nacional', v_emp) RETURNING id INTO v_prov6;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Sanitarios del Plata', v_emp) RETURNING id INTO v_prov7;
  INSERT INTO proveedores (nombre, empresa_id) VALUES
    ('Vidriería Moderna', v_emp) RETURNING id INTO v_prov8;

  INSERT INTO medio_pago ("nombreMedioPago", empresa_id) VALUES
    ('Efectivo', v_emp) RETURNING "idMedioPago" INTO v_mp1;
  INSERT INTO medio_pago ("nombreMedioPago", empresa_id) VALUES
    ('Transferencia Bancaria', v_emp) RETURNING "idMedioPago" INTO v_mp2;
  INSERT INTO medio_pago ("nombreMedioPago", empresa_id) VALUES
    ('Cheque', v_emp) RETURNING "idMedioPago" INTO v_mp3;
  INSERT INTO medio_pago ("nombreMedioPago", empresa_id) VALUES
    ('Mercado Pago', v_emp) RETURNING "idMedioPago" INTO v_mp4;
  INSERT INTO medio_pago ("nombreMedioPago", empresa_id) VALUES
    ('Tarjeta de Crédito', v_emp) RETURNING "idMedioPago" INTO v_mp5;

  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Constructora Horizonte SA', 'Av. Rivadavia 5500, CABA', '011-4300-1111', 'compras@horizonte.com', '30-70001111-5')
    RETURNING id INTO v_cli1;
  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Inmobiliaria Rivadavia', 'Belgrano 890, Quilmes', '011-4250-2222', 'admin@inmorivadavia.com', '20-30001111-2')
    RETURNING id INTO v_cli2;
  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Arq. Martín López', 'Mitre 340, Lanús', '011-4240-3333', 'martin.lopez@arq.com', '27-25001111-8')
    RETURNING id INTO v_cli3;
  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Obras Civiles del Norte SRL', 'Sarmiento 1200, San Miguel', '011-4660-4444', 'obras@civilesnorte.com', '30-70002222-1')
    RETURNING id INTO v_cli4;
  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Estudio Bianchi & Asociados', 'Córdoba 780, Morón', '011-4628-5555', 'estudio@bianchi.com', '30-70003333-7')
    RETURNING id INTO v_cli5;
  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Municipalidad de Avellaneda', 'Av. Mitre 2502, Avellaneda', '011-4201-6666', 'compras@avella.gob.ar', '30-70004444-3')
    RETURNING id INTO v_cli6;
  INSERT INTO clientes (empresa_id, nombre, direccion, telefono, email, cuit_dni) VALUES
    (v_emp, 'Cooperativa de Vivienda Sur', 'Sáenz Peña 1100, Lomas de Zamora', '011-4292-7777', 'admin@coopsur.org', '30-70005555-9')
    RETURNING id INTO v_cli7;

  INSERT INTO categorias_material (nombre, empresa_id) VALUES
    ('Cementos y Áridos', v_emp) RETURNING id INTO v_cat1;
  INSERT INTO categorias_material (nombre, empresa_id) VALUES
    ('Maderas', v_emp) RETURNING id INTO v_cat2;
  INSERT INTO categorias_material (nombre, empresa_id) VALUES
    ('Pinturas', v_emp) RETURNING id INTO v_cat3;
  INSERT INTO categorias_material (nombre, empresa_id) VALUES
    ('Hierros y Aceros', v_emp) RETURNING id INTO v_cat4;
  INSERT INTO categorias_material (nombre, empresa_id) VALUES
    ('Herramientas', v_emp) RETURNING id INTO v_cat5;
  INSERT INTO categorias_material (nombre, empresa_id) VALUES
    ('Electricidad', v_emp) RETURNING id INTO v_cat6;

  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Cemento Portland 50kg', 'Cemento portland gris uso general', 'CEM-001', v_cat1, 8500, 6000, 150, 20, 'bolsa')
    RETURNING id INTO v_m1;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Arena gruesa', 'Arena gruesa lavada para construcción', 'ARI-001', v_cat1, 15000, 10000, 80, 10, 'm³')
    RETURNING id INTO v_m2;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Cal hidráulica 25kg', 'Cal hidráulica para revoque', 'CEM-002', v_cat1, 4200, 2800, 60, 15, 'bolsa')
    RETURNING id INTO v_m3;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Tirante pino 2x4', 'Tirante de pino cepillado 2x4x3.6m', 'MAD-001', v_cat2, 5500, 3500, 40, 10, 'un')
    RETURNING id INTO v_m4;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Fenólico 18mm', 'Placa fenólica 1.22x2.44m 18mm', 'MAD-002', v_cat2, 32000, 24000, 25, 5, 'un')
    RETURNING id INTO v_m5;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Látex interior 20L', 'Pintura látex interior blanco 20 litros', 'PIN-001', v_cat3, 45000, 32000, 18, 5, 'l')
    RETURNING id INTO v_m6;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Esmalte sintético 4L', 'Esmalte sintético brillante 4 litros', 'PIN-002', v_cat3, 18000, 12500, 30, 8, 'l')
    RETURNING id INTO v_m7;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Hierro 10mm x 12m', 'Barra de hierro aletado 10mm x 12m', 'HIE-001', v_cat4, 12000, 8500, 70, 20, 'un')
    RETURNING id INTO v_m8;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Malla electrosoldada 15x15', 'Malla electrosoldada 2.4x6m 4.2mm', 'HIE-002', v_cat4, 28000, 20000, 12, 5, 'un')
    RETURNING id INTO v_m9;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Amoladora angular 115mm', 'Amoladora angular 115mm 850W', 'HER-001', v_cat5, 85000, 60000, 8, 2, 'un')
    RETURNING id INTO v_m10;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Piedra partida', 'Piedra partida 6/20 para hormigón', 'ARI-002', v_cat1, 18000, 12000, 45, 10, 'm³')
    RETURNING id INTO v_m11;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Listón pino 1x3', 'Listón de pino cepillado 1x3x3.6m', 'MAD-003', v_cat2, 2800, 1800, 100, 20, 'un')
    RETURNING id INTO v_m12;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Cable unipolar 2.5mm 100m', 'Cable unipolar normalizado 2.5mm² rollo 100m', 'ELE-001', v_cat6, 42000, 30000, 15, 3, 'un')
    RETURNING id INTO v_m13;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Taladro percutor 13mm', 'Taladro percutor 13mm 750W', 'HER-002', v_cat5, 95000, 68000, 5, 2, 'un')
    RETURNING id INTO v_m14;
  INSERT INTO materiales (empresa_id, nombre, descripcion, codigo, categoria_id, precio_venta, precio_costo, stock_actual, stock_minimo, unidad) VALUES
    (v_emp, 'Membrana asfáltica 4mm', 'Membrana asfáltica con aluminio 4mm x 10m²', 'CEM-003', v_cat1, 35000, 25000, 20, 5, 'un')
    RETURNING id INTO v_m15;

  INSERT INTO movimientos_stock (material_id, empresa_id, cantidad, tipo, motivo, fecha, usuario_id, stock_resultante) VALUES
    (v_m1,  v_emp, 150, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 150),
    (v_m2,  v_emp,  80, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 80),
    (v_m3,  v_emp,  60, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 60),
    (v_m4,  v_emp,  40, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 40),
    (v_m5,  v_emp,  25, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 25),
    (v_m6,  v_emp,  18, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 18),
    (v_m7,  v_emp,  30, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 30),
    (v_m8,  v_emp, 100, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 100),
    (v_m9,  v_emp,  15, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 15),
    (v_m10, v_emp,   8, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 8),
    (v_m11, v_emp,  45, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 45),
    (v_m12, v_emp, 100, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 100),
    (v_m13, v_emp,  15, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 15),
    (v_m14, v_emp,   5, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 5),
    (v_m15, v_emp,  20, 'entrada', 'Stock inicial', CURRENT_DATE - INTERVAL '60 days', v_admin, 20);

  INSERT INTO movimientos_stock (material_id, empresa_id, cantidad, tipo, motivo, fecha, usuario_id, stock_resultante) VALUES
    (v_m1,  v_emp, 50,  'entrada', 'Reposición mensual',            CURRENT_DATE - INTERVAL '30 days', v_admin, 200),
    (v_m8,  v_emp, 30,  'entrada', 'Compra a Aceros Patagonia',     CURRENT_DATE - INTERVAL '28 days', v_admin, 130),
    (v_m1,  v_emp, 50,  'salida',  'Venta directa mostrador',       CURRENT_DATE - INTERVAL '20 days', v_user2, 150),
    (v_m7,  v_emp, 5,   'salida',  'Venta a particular',            CURRENT_DATE - INTERVAL '15 days', v_user2, 25),
    (v_m7,  v_emp, 10,  'entrada', 'Reposición Pinturas Color',     CURRENT_DATE - INTERVAL '10 days', v_admin, 35),
    (v_m7,  v_emp, 5,   'salida',  'Venta mostrador',               CURRENT_DATE - INTERVAL '5 days',  v_user2, 30),
    (v_m12, v_emp, 20,  'salida',  'Venta a carpintería',           CURRENT_DATE - INTERVAL '12 days', v_user2, 80),
    (v_m12, v_emp, 20,  'entrada', 'Reposición Maderas del Litoral',CURRENT_DATE - INTERVAL '8 days',  v_admin, 100);

  INSERT INTO movimientos_stock (material_id, empresa_id, cantidad, tipo, motivo, fecha, usuario_id, stock_resultante) VALUES
    (v_m8, v_emp, 30, 'salida', 'Presupuesto #3 aceptado', CURRENT_DATE - INTERVAL '3 days', v_admin, 70),
    (v_m9, v_emp,  3, 'salida', 'Presupuesto #3 aceptado', CURRENT_DATE - INTERVAL '3 days', v_admin, 12);

  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -600000,  CURRENT_DATE - INTERVAL '55 days', -545.45, 1100, v_admin, v_mp2, 'Compra cemento Portland x100 bolsas',      v_emp, 'compra'),
    (v_prov2, -425000,  CURRENT_DATE - INTERVAL '50 days', -386.36, 1100, v_admin, v_mp3, 'Compra hierro 10mm x50 barras',            v_emp, 'compra'),
    (v_prov3, -140000,  CURRENT_DATE - INTERVAL '45 days', -127.27, 1100, v_admin, v_mp1, 'Compra tirantes pino x40',                 v_emp, 'compra'),
    (v_prov4, -576000,  CURRENT_DATE - INTERVAL '40 days', -523.64, 1100, v_admin, v_mp2, 'Compra pinturas látex x18 baldes',         v_emp, 'compra'),
    (v_prov1, -480000,  CURRENT_DATE - INTERVAL '35 days', -436.36, 1100, v_admin, v_mp4, 'Compra mallas + herramientas',             v_emp, 'compra'),
    (v_prov6, -315000,  CURRENT_DATE - INTERVAL '30 days', -286.36, 1100, v_admin, v_mp2, 'Compra cables eléctricos x10 rollos',      v_emp, 'compra'),
    (v_prov3, -180000,  CURRENT_DATE - INTERVAL '25 days', -163.64, 1100, v_admin, v_mp1, 'Compra listones pino x100',                v_emp, 'compra'),
    (v_prov5, -300000,  CURRENT_DATE - INTERVAL '20 days', -272.73, 1100, v_admin, v_mp2, 'Compra cemento Portland x50 bolsas',       v_emp, 'compra'),
    (v_prov8, -250000,  CURRENT_DATE - INTERVAL '15 days', -227.27, 1100, v_admin, v_mp3, 'Compra membrana asfáltica x10',            v_emp, 'compra'),
    (v_prov2, -255000,  CURRENT_DATE - INTERVAL '10 days', -231.82, 1100, v_admin, v_mp2, 'Compra hierro 10mm x30 barras',            v_emp, 'compra'),
    (v_prov7, -195000,  CURRENT_DATE - INTERVAL '7 days',  -177.27, 1100, v_admin, v_mp4, 'Compra accesorios sanitarios',             v_emp, 'compra'),
    (v_prov4, -375000,  CURRENT_DATE - INTERVAL '5 days',  -340.91, 1100, v_admin, v_mp1, 'Compra esmalte sintético x30 latas',       v_emp, 'compra');

  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  425000, CURRENT_DATE - INTERVAL '48 days', 386.36, 1100, v_admin, v_mp2, 'Venta cemento x50 bolsas',                   v_emp, 'venta'),
    (v_cli4,  240000, CURRENT_DATE - INTERVAL '42 days', 218.18, 1100, v_admin, v_mp1, 'Venta hierro x20 barras',                    v_emp, 'venta'),
    (v_cli2,  160000, CURRENT_DATE - INTERVAL '38 days', 145.45, 1100, v_admin, v_mp2, 'Venta fenólico x5 placas',                   v_emp, 'venta'),
    (v_cli5,  280000, CURRENT_DATE - INTERVAL '33 days', 254.55, 1100, v_admin, v_mp5, 'Venta listones + tirantes para estudio',     v_emp, 'venta'),
    (v_cli3,   90000, CURRENT_DATE - INTERVAL '28 days',  81.82, 1100, v_admin, v_mp1, 'Venta pinturas para obra Mitre',             v_emp, 'venta'),
    (v_cli6,  540000, CURRENT_DATE - INTERVAL '22 days', 490.91, 1100, v_admin, v_mp2, 'Venta materiales obra municipal',            v_emp, 'venta'),
    (v_cli7,  350000, CURRENT_DATE - INTERVAL '18 days', 318.18, 1100, v_admin, v_mp3, 'Venta cemento + cal para cooperativa',       v_emp, 'venta'),
    (v_cli1,  168000, CURRENT_DATE - INTERVAL '12 days', 152.73, 1100, v_admin, v_mp4, 'Venta cable eléctrico x4 rollos',            v_emp, 'venta');

  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1, 399600, CURRENT_DATE - INTERVAL '3 days', 363.27, 1100, v_admin, v_mp2, 'Presupuesto #3 aceptado', v_emp, 'venta')
    RETURNING "idPago" INTO v_pg;

  INSERT INTO presupuestos (empresa_id, cliente_id, numero, fecha, fecha_validez, estado, observaciones, subtotal, descuento_porcentaje, total, usuario_id) VALUES
    (v_emp, v_cli2, 1, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'borrador',
     'Materiales para refacción departamento 3A', 212000, 5, 201400, v_admin)
    RETURNING id INTO v_pr1;

  INSERT INTO presupuesto_items (presupuesto_id, material_id, cantidad, precio_unitario, subtotal, material_nombre, material_codigo, material_unidad, empresa_id) VALUES
    (v_pr1, v_m1, 20, 8500, 170000, 'Cemento Portland 50kg', 'CEM-001', 'bolsa', v_emp),
    (v_pr1, v_m3, 10, 4200,  42000, 'Cal hidráulica 25kg',   'CEM-002', 'bolsa', v_emp);

  INSERT INTO presupuestos (empresa_id, cliente_id, numero, fecha, fecha_validez, estado, observaciones, subtotal, descuento_porcentaje, total, usuario_id) VALUES
    (v_emp, v_cli3, 2, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '22 days', 'enviado',
     'Materiales para obra Mitre 340', 332500, 0, 332500, v_admin)
    RETURNING id INTO v_pr2;

  INSERT INTO presupuesto_items (presupuesto_id, material_id, cantidad, precio_unitario, subtotal, material_nombre, material_codigo, material_unidad, empresa_id) VALUES
    (v_pr2, v_m5,  5, 32000, 160000, 'Fenólico 18mm',      'MAD-002', 'un',    v_emp),
    (v_pr2, v_m4, 15,  5500,  82500, 'Tirante pino 2x4',   'MAD-001', 'un',    v_emp),
    (v_pr2, v_m6,  2, 45000,  90000, 'Látex interior 20L',  'PIN-001', 'l',     v_emp);

  INSERT INTO presupuestos (empresa_id, cliente_id, numero, fecha, fecha_validez, estado, observaciones, subtotal, descuento_porcentaje, total, usuario_id, pago_id) VALUES
    (v_emp, v_cli1, 3, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '23 days', 'aceptado',
     'Estructura metálica para galpón', 444000, 10, 399600, v_admin, v_pg)
    RETURNING id INTO v_pr3;

  INSERT INTO presupuesto_items (presupuesto_id, material_id, cantidad, precio_unitario, subtotal, material_nombre, material_codigo, material_unidad, empresa_id) VALUES
    (v_pr3, v_m8, 30, 12000, 360000, 'Hierro 10mm x 12m',          'HIE-001', 'un',   v_emp),
    (v_pr3, v_m9,  3, 28000,  84000, 'Malla electrosoldada 15x15',  'HIE-002', 'un',   v_emp);

  INSERT INTO presupuestos (empresa_id, cliente_id, numero, fecha, fecha_validez, estado, observaciones, subtotal, descuento_porcentaje, total, usuario_id) VALUES
    (v_emp, v_cli5, 4, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 'rechazado',
     'Impermeabilización terraza estudio', 485000, 0, 485000, v_admin)
    RETURNING id INTO v_pr4;

  INSERT INTO presupuesto_items (presupuesto_id, material_id, cantidad, precio_unitario, subtotal, material_nombre, material_codigo, material_unidad, empresa_id) VALUES
    (v_pr4, v_m15, 10, 35000, 350000, 'Membrana asfáltica 4mm',   'CEM-003', 'un',  v_emp),
    (v_pr4, v_m6,   3, 45000, 135000, 'Látex interior 20L',       'PIN-001', 'l',   v_emp);

  INSERT INTO presupuestos (empresa_id, cliente_id, numero, fecha, fecha_validez, estado, observaciones, subtotal, descuento_porcentaje, total, usuario_id) VALUES
    (v_emp, v_cli7, 5, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '28 days', 'borrador',
     'Materiales para construcción 10 viviendas - Etapa 1', 1064000, 8, 978880, v_admin)
    RETURNING id INTO v_pr5;

  INSERT INTO presupuesto_items (presupuesto_id, material_id, cantidad, precio_unitario, subtotal, material_nombre, material_codigo, material_unidad, empresa_id) VALUES
    (v_pr5, v_m1,  50,  8500, 425000, 'Cemento Portland 50kg',          'CEM-001', 'bolsa', v_emp),
    (v_pr5, v_m3,  20,  4200,  84000, 'Cal hidráulica 25kg',            'CEM-002', 'bolsa', v_emp),
    (v_pr5, v_m4,  30,  5500, 165000, 'Tirante pino 2x4',              'MAD-001', 'un',    v_emp),
    (v_pr5, v_m11, 10, 18000, 180000, 'Piedra partida',                 'ARI-002', 'm³',   v_emp),
    (v_pr5, v_m13,  5, 42000, 210000, 'Cable unipolar 2.5mm 100m',     'ELE-001', 'un',    v_emp);

  RAISE NOTICE 'Seed data inserted successfully';
END $$;
