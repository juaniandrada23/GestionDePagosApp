-- Expanded seed data: pagos (compras + ventas) covering every month of 2026
DO $$
DECLARE
  v_emp INTEGER := 1;
  v_admin INTEGER := 1;
  v_user2 INTEGER;
  v_prov1 INTEGER; v_prov2 INTEGER; v_prov3 INTEGER; v_prov4 INTEGER;
  v_prov5 INTEGER; v_prov6 INTEGER; v_prov7 INTEGER; v_prov8 INTEGER;
  v_cli1 INTEGER; v_cli2 INTEGER; v_cli3 INTEGER; v_cli4 INTEGER;
  v_cli5 INTEGER; v_cli6 INTEGER; v_cli7 INTEGER;
  v_mp1 INTEGER; v_mp2 INTEGER; v_mp3 INTEGER; v_mp4 INTEGER; v_mp5 INTEGER;
BEGIN
  -- Only run if base seed exists but expanded seed does not
  IF NOT EXISTS (SELECT 1 FROM proveedores WHERE empresa_id = v_emp LIMIT 1) THEN
    RAISE NOTICE 'Base seed data not found, skipping expanded seed';
    RETURN;
  END IF;

  -- Guard: check if expanded data already inserted (look for a specific record)
  IF EXISTS (
    SELECT 1 FROM pagos
    WHERE empresa_id = v_emp AND fecha = '2026-01-10' AND descripcion = 'Compra cemento inicio de año x80 bolsas'
  ) THEN
    RAISE NOTICE 'Expanded seed data already exists, skipping';
    RETURN;
  END IF;

  -- Look up user2
  SELECT id INTO v_user2 FROM usuarios WHERE username = 'mlopez' AND empresa_id = v_emp;

  -- Look up proveedores
  SELECT id INTO v_prov1 FROM proveedores WHERE nombre = 'Ferretería Industrial SA' AND empresa_id = v_emp;
  SELECT id INTO v_prov2 FROM proveedores WHERE nombre = 'Aceros Patagonia' AND empresa_id = v_emp;
  SELECT id INTO v_prov3 FROM proveedores WHERE nombre = 'Maderas del Litoral' AND empresa_id = v_emp;
  SELECT id INTO v_prov4 FROM proveedores WHERE nombre = 'Pinturas Color SRL' AND empresa_id = v_emp;
  SELECT id INTO v_prov5 FROM proveedores WHERE nombre = 'Cementos Argentinos' AND empresa_id = v_emp;
  SELECT id INTO v_prov6 FROM proveedores WHERE nombre = 'Distribuidora Eléctrica Nacional' AND empresa_id = v_emp;
  SELECT id INTO v_prov7 FROM proveedores WHERE nombre = 'Sanitarios del Plata' AND empresa_id = v_emp;
  SELECT id INTO v_prov8 FROM proveedores WHERE nombre = 'Vidriería Moderna' AND empresa_id = v_emp;

  -- Look up clientes
  SELECT id INTO v_cli1 FROM clientes WHERE nombre = 'Constructora Horizonte SA' AND empresa_id = v_emp;
  SELECT id INTO v_cli2 FROM clientes WHERE nombre = 'Inmobiliaria Rivadavia' AND empresa_id = v_emp;
  SELECT id INTO v_cli3 FROM clientes WHERE nombre = 'Arq. Martín López' AND empresa_id = v_emp;
  SELECT id INTO v_cli4 FROM clientes WHERE nombre = 'Obras Civiles del Norte SRL' AND empresa_id = v_emp;
  SELECT id INTO v_cli5 FROM clientes WHERE nombre = 'Estudio Bianchi & Asociados' AND empresa_id = v_emp;
  SELECT id INTO v_cli6 FROM clientes WHERE nombre = 'Municipalidad de Avellaneda' AND empresa_id = v_emp;
  SELECT id INTO v_cli7 FROM clientes WHERE nombre = 'Cooperativa de Vivienda Sur' AND empresa_id = v_emp;

  -- Look up medios de pago
  SELECT "idMedioPago" INTO v_mp1 FROM medio_pago WHERE "nombreMedioPago" = 'Efectivo' AND empresa_id = v_emp;
  SELECT "idMedioPago" INTO v_mp2 FROM medio_pago WHERE "nombreMedioPago" = 'Transferencia Bancaria' AND empresa_id = v_emp;
  SELECT "idMedioPago" INTO v_mp3 FROM medio_pago WHERE "nombreMedioPago" = 'Cheque' AND empresa_id = v_emp;
  SELECT "idMedioPago" INTO v_mp4 FROM medio_pago WHERE "nombreMedioPago" = 'Mercado Pago' AND empresa_id = v_emp;
  SELECT "idMedioPago" INTO v_mp5 FROM medio_pago WHERE "nombreMedioPago" = 'Tarjeta de Crédito' AND empresa_id = v_emp;

  -- =============================================
  -- COMPRAS (monto negativo) - All months of 2026
  -- =============================================

  -- ENERO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -680000,  '2026-01-10', -566.67, 1200, v_admin, v_mp2, 'Compra cemento inicio de año x80 bolsas',        v_emp, 'compra'),
    (v_prov1, -245000,  '2026-01-18', -204.17, 1200, v_admin, v_mp1, 'Compra herramientas varias para taller',          v_emp, 'compra'),
    (v_prov3, -192000,  '2026-01-25', -160.00, 1200, v_user2, v_mp4, 'Compra maderas para stock enero',                 v_emp, 'compra');

  -- FEBRERO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov2, -510000,  '2026-02-05', -415.00, 1229, v_admin, v_mp2, 'Compra hierro aletado x60 barras',               v_emp, 'compra'),
    (v_prov4, -330000,  '2026-02-14', -268.51, 1229, v_admin, v_mp3, 'Compra pinturas para temporada alta',             v_emp, 'compra'),
    (v_prov6, -420000,  '2026-02-22', -341.74, 1229, v_user2, v_mp2, 'Compra cables y materiales eléctricos',           v_emp, 'compra');

  -- MARZO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -720000,  '2026-03-03', -576.00, 1250, v_admin, v_mp2, 'Compra cemento Portland x100 bolsas marzo',       v_emp, 'compra'),
    (v_prov7, -285000,  '2026-03-12', -228.00, 1250, v_admin, v_mp4, 'Compra sanitarios para obras en curso',           v_emp, 'compra'),
    (v_prov8, -365000,  '2026-03-20', -292.00, 1250, v_user2, v_mp1, 'Compra vidrios templados pedido especial',        v_emp, 'compra'),
    (v_prov3, -158000,  '2026-03-28', -126.40, 1250, v_admin, v_mp2, 'Compra listones y tirantes pino',                 v_emp, 'compra');

  -- ABRIL 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov1, -560000,  '2026-04-07', -437.50, 1280, v_admin, v_mp3, 'Compra mallas y herramientas industriales',       v_emp, 'compra'),
    (v_prov2, -390000,  '2026-04-15', -304.69, 1280, v_user2, v_mp2, 'Compra aceros para estructura galpón',            v_emp, 'compra'),
    (v_prov4, -275000,  '2026-04-24', -214.84, 1280, v_admin, v_mp1, 'Compra esmalte sintético x20 latas',              v_emp, 'compra');

  -- MAYO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -850000,  '2026-05-05', -648.85, 1310, v_admin, v_mp2, 'Compra cemento gran volumen obra municipal',      v_emp, 'compra'),
    (v_prov6, -310000,  '2026-05-14', -236.64, 1310, v_admin, v_mp4, 'Compra tableros eléctricos y accesorios',         v_emp, 'compra'),
    (v_prov3, -220000,  '2026-05-22', -167.94, 1310, v_user2, v_mp1, 'Compra fenólico y machimbre',                     v_emp, 'compra');

  -- JUNIO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov7, -445000,  '2026-06-02', -332.09, 1340, v_admin, v_mp2, 'Compra grifería y cañerías para stock',           v_emp, 'compra'),
    (v_prov2, -620000,  '2026-06-11', -462.69, 1340, v_admin, v_mp3, 'Compra hierro y mallas electrosoldadas',          v_emp, 'compra'),
    (v_prov8, -185000,  '2026-06-19', -138.06, 1340, v_user2, v_mp1, 'Compra vidrios para carpintería aluminio',        v_emp, 'compra'),
    (v_prov4, -410000,  '2026-06-27', -305.97, 1340, v_admin, v_mp2, 'Compra pinturas impermeabilizantes',              v_emp, 'compra');

  -- JULIO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -540000,  '2026-07-06', -393.43, 1372, v_admin, v_mp2, 'Compra cemento y cal para invierno',              v_emp, 'compra'),
    (v_prov1, -380000,  '2026-07-15', -277.00, 1372, v_user2, v_mp4, 'Compra herramientas eléctricas varias',           v_emp, 'compra'),
    (v_prov3, -265000,  '2026-07-24', -193.15, 1372, v_admin, v_mp1, 'Compra maderas tratadas para exterior',           v_emp, 'compra');

  -- AGOSTO 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov6, -490000,  '2026-08-04', -349.29, 1403, v_admin, v_mp2, 'Compra material eléctrico obra cooperativa',      v_emp, 'compra'),
    (v_prov2, -730000,  '2026-08-13', -520.31, 1403, v_admin, v_mp3, 'Compra hierro construcción x80 barras',           v_emp, 'compra'),
    (v_prov4, -195000,  '2026-08-21', -138.99, 1403, v_user2, v_mp1, 'Compra fondo y diluyentes',                       v_emp, 'compra'),
    (v_prov7, -320000,  '2026-08-29', -228.08, 1403, v_admin, v_mp4, 'Compra sanitarios línea premium',                 v_emp, 'compra');

  -- SEPTIEMBRE 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -900000,  '2026-09-02', -625.00, 1440, v_admin, v_mp2, 'Compra cemento gran volumen primavera',           v_emp, 'compra'),
    (v_prov8, -275000,  '2026-09-10', -190.97, 1440, v_admin, v_mp1, 'Compra vidrios doble panel',                      v_emp, 'compra'),
    (v_prov3, -340000,  '2026-09-18', -236.11, 1440, v_user2, v_mp2, 'Compra madera para encofrado',                    v_emp, 'compra'),
    (v_prov1, -415000,  '2026-09-26', -288.19, 1440, v_admin, v_mp3, 'Compra herramientas y ferretería general',        v_emp, 'compra');

  -- OCTUBRE 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov2, -580000,  '2026-10-05', -393.20, 1475, v_admin, v_mp2, 'Compra hierro para losa y columnas',              v_emp, 'compra'),
    (v_prov6, -350000,  '2026-10-14', -237.29, 1475, v_user2, v_mp4, 'Compra cables subterráneos y bandejas',           v_emp, 'compra'),
    (v_prov4, -520000,  '2026-10-23', -352.54, 1475, v_admin, v_mp2, 'Compra pintura exterior temporada alta',          v_emp, 'compra');

  -- NOVIEMBRE 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov5, -780000,  '2026-11-03', -516.56, 1510, v_admin, v_mp2, 'Compra cemento y áridos noviembre',               v_emp, 'compra'),
    (v_prov7, -260000,  '2026-11-12', -172.19, 1510, v_admin, v_mp1, 'Compra tanques y accesorios agua',                v_emp, 'compra'),
    (v_prov3, -295000,  '2026-11-20', -195.36, 1510, v_user2, v_mp3, 'Compra machimbre y zócalos',                      v_emp, 'compra'),
    (v_prov8, -430000,  '2026-11-28', -284.77, 1510, v_admin, v_mp2, 'Compra mamparas y espejos para obra',             v_emp, 'compra');

  -- DICIEMBRE 2026
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov1, -470000,  '2026-12-03', -304.52, 1544, v_admin, v_mp4, 'Compra herramientas cierre de año',               v_emp, 'compra'),
    (v_prov2, -650000,  '2026-12-10', -421.11, 1544, v_admin, v_mp2, 'Compra hierro stock diciembre',                   v_emp, 'compra'),
    (v_prov5, -920000,  '2026-12-18', -595.85, 1544, v_user2, v_mp2, 'Compra cemento para obras de verano',             v_emp, 'compra'),
    (v_prov4, -310000,  '2026-12-28', -200.78, 1544, v_admin, v_mp1, 'Compra pinturas fin de año promoción',            v_emp, 'compra');

  -- =============================================
  -- VENTAS (monto positivo) - All months of 2026
  -- =============================================

  -- ENERO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  520000, '2026-01-08', 433.33, 1200, v_admin, v_mp2, 'Venta cemento y cal obra torre Belgrano',        v_emp, 'venta'),
    (v_cli4,  310000, '2026-01-15', 258.33, 1200, v_admin, v_mp1, 'Venta hierro y mallas para estructura',          v_emp, 'venta'),
    (v_cli7,  185000, '2026-01-28', 154.17, 1200, v_user2, v_mp4, 'Venta materiales básicos cooperativa',           v_emp, 'venta');

  -- FEBRERO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli2,  275000, '2026-02-03', 223.76, 1229, v_admin, v_mp2, 'Venta materiales refacción depto 3A',            v_emp, 'venta'),
    (v_cli5,  420000, '2026-02-12', 341.74, 1229, v_admin, v_mp5, 'Venta madera y pintura para estudio',            v_emp, 'venta'),
    (v_cli3,  145000, '2026-02-20', 117.98, 1229, v_user2, v_mp1, 'Venta cemento para obra Mitre',                  v_emp, 'venta'),
    (v_cli6,  680000, '2026-02-27', 553.30, 1229, v_admin, v_mp2, 'Venta lote materiales obra pública',             v_emp, 'venta');

  -- MARZO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  390000, '2026-03-05', 312.00, 1250, v_admin, v_mp3, 'Venta hierro y cemento para pilotes',            v_emp, 'venta'),
    (v_cli4,  580000, '2026-03-13', 464.00, 1250, v_admin, v_mp2, 'Venta gran volumen obra norte',                  v_emp, 'venta'),
    (v_cli7,  240000, '2026-03-22', 192.00, 1250, v_user2, v_mp1, 'Venta materiales etapa 1 cooperativa',           v_emp, 'venta');

  -- ABRIL 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli5,  345000, '2026-04-02', 269.53, 1280, v_admin, v_mp2, 'Venta pinturas y membrana estudio',              v_emp, 'venta'),
    (v_cli2,  190000, '2026-04-10', 148.44, 1280, v_admin, v_mp4, 'Venta sanitarios departamento 3A',               v_emp, 'venta'),
    (v_cli6,  750000, '2026-04-18', 585.94, 1280, v_admin, v_mp2, 'Venta materiales obra avenida principal',        v_emp, 'venta'),
    (v_cli3,  120000, '2026-04-28', 93.75,  1280, v_user2, v_mp1, 'Venta eléctricos para obra Mitre',              v_emp, 'venta');

  -- MAYO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  650000, '2026-05-06', 496.18, 1310, v_admin, v_mp2, 'Venta materiales estructura torre',              v_emp, 'venta'),
    (v_cli7,  480000, '2026-05-15', 366.41, 1310, v_admin, v_mp3, 'Venta cemento y hierro cooperativa etapa 2',     v_emp, 'venta'),
    (v_cli4,  290000, '2026-05-23', 221.37, 1310, v_user2, v_mp1, 'Venta maderas para encofrado norte',             v_emp, 'venta');

  -- JUNIO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli6,  890000, '2026-06-04', 664.18, 1340, v_admin, v_mp2, 'Venta lote grande obra municipal',               v_emp, 'venta'),
    (v_cli2,  210000, '2026-06-12', 156.72, 1340, v_admin, v_mp5, 'Venta eléctricos y pinturas Rivadavia',          v_emp, 'venta'),
    (v_cli5,  365000, '2026-06-20', 272.39, 1340, v_user2, v_mp4, 'Venta materiales remodelación oficinas',         v_emp, 'venta'),
    (v_cli3,  175000, '2026-06-28', 130.60, 1340, v_admin, v_mp1, 'Venta vidrios y sanitarios obra Mitre',          v_emp, 'venta');

  -- JULIO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  430000, '2026-07-03', 313.41, 1372, v_admin, v_mp2, 'Venta cemento y cal obra Belgrano',              v_emp, 'venta'),
    (v_cli4,  380000, '2026-07-14', 277.00, 1372, v_admin, v_mp3, 'Venta hierro para losa obra norte',              v_emp, 'venta'),
    (v_cli7,  295000, '2026-07-25', 214.99, 1372, v_user2, v_mp1, 'Venta materiales cooperativa invierno',          v_emp, 'venta');

  -- AGOSTO 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli6,  720000, '2026-08-05', 513.19, 1403, v_admin, v_mp2, 'Venta materiales obra pública fase 2',           v_emp, 'venta'),
    (v_cli5,  260000, '2026-08-14', 185.32, 1403, v_admin, v_mp4, 'Venta pinturas especiales estudio',              v_emp, 'venta'),
    (v_cli2,  340000, '2026-08-22', 242.34, 1403, v_user2, v_mp2, 'Venta maderas y hierro Rivadavia',               v_emp, 'venta'),
    (v_cli3,  155000, '2026-08-30', 110.48, 1403, v_admin, v_mp1, 'Venta herramientas y accesorios Arq. López',     v_emp, 'venta');

  -- SEPTIEMBRE 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  810000, '2026-09-03', 562.50, 1440, v_admin, v_mp2, 'Venta gran lote para torre Belgrano',            v_emp, 'venta'),
    (v_cli4,  445000, '2026-09-11', 309.03, 1440, v_admin, v_mp3, 'Venta materiales estructura obra norte',         v_emp, 'venta'),
    (v_cli7,  530000, '2026-09-19', 368.06, 1440, v_user2, v_mp2, 'Venta cooperativa etapa 3 viviendas',            v_emp, 'venta'),
    (v_cli6,  480000, '2026-09-28', 333.33, 1440, v_admin, v_mp5, 'Venta eléctricos obra municipal',                v_emp, 'venta');

  -- OCTUBRE 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli5,  520000, '2026-10-02', 352.54, 1475, v_admin, v_mp2, 'Venta materiales remodelación estudio fase 2',   v_emp, 'venta'),
    (v_cli2,  390000, '2026-10-12', 264.41, 1475, v_admin, v_mp4, 'Venta cemento y arena Rivadavia',                v_emp, 'venta'),
    (v_cli1,  560000, '2026-10-20', 379.66, 1475, v_user2, v_mp2, 'Venta hierro y mallas torre Belgrano',           v_emp, 'venta'),
    (v_cli3,  230000, '2026-10-29', 155.93, 1475, v_admin, v_mp1, 'Venta pinturas y membrana obra Mitre',           v_emp, 'venta');

  -- NOVIEMBRE 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli4,  670000, '2026-11-04', 443.71, 1510, v_admin, v_mp2, 'Venta lote cemento y hierro obra norte',         v_emp, 'venta'),
    (v_cli6,  950000, '2026-11-13', 629.14, 1510, v_admin, v_mp2, 'Venta gran pedido municipal cierre año',         v_emp, 'venta'),
    (v_cli7,  410000, '2026-11-21', 271.52, 1510, v_user2, v_mp3, 'Venta materiales cooperativa etapa 4',           v_emp, 'venta'),
    (v_cli5,  285000, '2026-11-29', 188.74, 1510, v_admin, v_mp1, 'Venta eléctricos y sanitarios estudio',          v_emp, 'venta');

  -- DICIEMBRE 2026
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1,  920000, '2026-12-04', 595.85, 1544, v_admin, v_mp2, 'Venta materiales cierre obra torre Belgrano',    v_emp, 'venta'),
    (v_cli2,  310000, '2026-12-11', 200.78, 1544, v_admin, v_mp5, 'Venta acabados finales depto Rivadavia',         v_emp, 'venta'),
    (v_cli4,  485000, '2026-12-17', 314.25, 1544, v_user2, v_mp2, 'Venta últimos materiales obra norte',            v_emp, 'venta'),
    (v_cli6,  620000, '2026-12-23', 401.55, 1544, v_admin, v_mp3, 'Venta cierre de año obra municipal',             v_emp, 'venta'),
    (v_cli3,  195000, '2026-12-29', 126.30, 1544, v_admin, v_mp1, 'Venta materiales última obra año Arq. López',    v_emp, 'venta');

  -- =============================================
  -- CROSS-ENTITY: Proveedores en ventas (devoluciones/notas de crédito a favor)
  -- =============================================
  INSERT INTO pagos ("idProveedor", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_prov4,  85000, '2026-03-15', 68.00, 1250, v_admin, v_mp2, 'Nota de crédito Pinturas Color - material fallado',   v_emp, 'venta'),
    (v_prov2, 120000, '2026-07-20', 87.46, 1372, v_admin, v_mp2, 'Devolución hierro fuera de norma Aceros Patagonia',   v_emp, 'venta'),
    (v_prov5,  95000, '2026-10-08', 64.41, 1475, v_admin, v_mp1, 'Bonificación Cementos Argentinos por volumen',        v_emp, 'venta');

  -- =============================================
  -- CROSS-ENTITY: Clientes en compras (devoluciones de clientes)
  -- =============================================
  INSERT INTO pagos ("idCliente", monto, fecha, "montoUSD", "usdDelDia", "idUser", "idMedioPago", descripcion, empresa_id, tipo) VALUES
    (v_cli1, -150000, '2026-04-22', -117.19, 1280, v_admin, v_mp2, 'Devolución material sobrante Constructora Horizonte', v_emp, 'compra'),
    (v_cli6, -210000, '2026-08-10', -149.68, 1403, v_admin, v_mp2, 'Recompra material devuelto Municipalidad',            v_emp, 'compra'),
    (v_cli7,  -95000, '2026-11-15', -62.91,  1510, v_user2, v_mp1, 'Ajuste precio cooperativa por acuerdo previo',        v_emp, 'compra');

  RAISE NOTICE 'Expanded seed data for 2026 inserted successfully';
END $$;
