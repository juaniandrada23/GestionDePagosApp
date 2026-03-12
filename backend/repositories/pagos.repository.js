const pool = require('../db/pool');
const {
  PAGOS_BASE_SELECT,
  PAGOS_BASE_JOIN,
  MONTH_VALUES_CTE,
  INCOME_EXPENSE_COLUMNS,
  construirClausulaWhere,
  construirClausulaPaginacion,
} = require('./query-fragments');

const buscarTodos = async (empresaId, { page, limit } = {}) => {
  const { whereClause, params, nextIndex } = construirClausulaWhere({ empresaId });
  const { paginationClause, paginationParams } = construirClausulaPaginacion(
    page,
    limit,
    nextIndex,
  );
  const { rows } = await pool.query(
    `SELECT ${PAGOS_BASE_SELECT} ${PAGOS_BASE_JOIN} ${whereClause} ORDER BY pagos.fecha ASC ${paginationClause}`,
    [...params, ...paginationParams],
  );
  return rows;
};

const buscarFiltrado = async (empresaId, filters, { page, limit } = {}) => {
  const { whereClause, params, nextIndex } = construirClausulaWhere({ ...filters, empresaId });
  const { paginationClause, paginationParams } = construirClausulaPaginacion(
    page,
    limit,
    nextIndex,
  );
  const { rows } = await pool.query(
    `SELECT ${PAGOS_BASE_SELECT} ${PAGOS_BASE_JOIN} ${whereClause} ORDER BY pagos.fecha ASC ${paginationClause}`,
    [...params, ...paginationParams],
  );
  return rows;
};

const buscarPorUsuario = async (empresaId, idUsuario, { page, limit } = {}) => {
  const { whereClause, params, nextIndex } = construirClausulaWhere({
    empresaId,
    idUser: idUsuario,
  });
  const { paginationClause, paginationParams } = construirClausulaPaginacion(
    page,
    limit,
    nextIndex,
  );
  const { rows } = await pool.query(
    `SELECT ${PAGOS_BASE_SELECT} ${PAGOS_BASE_JOIN}
     ${whereClause}
     ORDER BY pagos.fecha ASC
     ${paginationClause}`,
    [...params, ...paginationParams],
  );
  return rows;
};

const crear = async (
  {
    idProveedor,
    idCliente,
    monto,
    idMedioPago,
    fecha,
    montoUSD,
    usdDelDia,
    idUsuario,
    descripcion,
    empresaId,
    tipo,
  },
  client = pool,
) => {
  const {
    rows: [row],
  } = await client.query(
    `INSERT INTO pagos ("idProveedor", "idCliente", monto, "idMedioPago", fecha, "montoUSD", "usdDelDia", "idUser", descripcion, empresa_id, tipo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING "idPago"`,
    [
      idProveedor || null,
      idCliente || null,
      monto,
      idMedioPago,
      fecha,
      montoUSD,
      usdDelDia,
      idUsuario,
      descripcion,
      empresaId,
      tipo || 'compra',
    ],
  );
  return row;
};

const actualizar = async (
  id,
  { idProveedor, idCliente, monto, idMedioPago, fecha, montoUSD, usdDelDia, descripcion },
  empresaId,
  client = pool,
) => {
  await client.query(
    `UPDATE pagos
     SET "idProveedor" = $1, "idCliente" = $2, monto = $3, "idMedioPago" = $4, fecha = $5, "montoUSD" = $6, "usdDelDia" = $7, descripcion = $8
     WHERE "idPago" = $9 AND empresa_id = $10`,
    [
      idProveedor || null,
      idCliente || null,
      monto,
      idMedioPago,
      fecha,
      montoUSD,
      usdDelDia,
      descripcion,
      id,
      empresaId,
    ],
  );
};

const eliminar = async (id, empresaId) => {
  await pool.query('DELETE FROM pagos WHERE "idPago" = $1 AND empresa_id = $2', [id, empresaId]);
};

const contarPorRangoFechas = async (empresaId, fechadesde, fechahasta) => {
  const { rows } = await pool.query(
    `
    SELECT d::date AS fecha, COUNT(p."idPago")::int AS cantidad_pagos
    FROM generate_series($1::date, $2::date, '1 day'::interval) d
    LEFT JOIN pagos p ON d::date = p.fecha AND p.empresa_id = $3
    GROUP BY d::date
    ORDER BY d::date
  `,
    [fechadesde, fechahasta, empresaId],
  );
  return rows;
};

const contarTotalEnRango = async (empresaId, fechadesde, fechahasta) => {
  const { rows } = await pool.query(
    `SELECT COUNT("idPago")::int AS cantidad_pagos FROM pagos WHERE fecha BETWEEN $1 AND $2 AND empresa_id = $3`,
    [fechadesde, fechahasta, empresaId],
  );
  return rows;
};

const contarTotal = async (empresaId) => {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total_pagos FROM pagos WHERE empresa_id = $1',
    [empresaId],
  );
  return rows;
};

const contarPorAnio = async (empresaId, year = null) => {
  if (year) {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${parseInt(year, 10) + 1}-01-01`;
    const { rows } = await pool.query(
      `
      SELECT m.nombre_mes, COALESCE(COUNT(p."idPago"), 0)::int AS cantidad_pagos
      FROM ${MONTH_VALUES_CTE}
      LEFT JOIN pagos p ON EXTRACT(MONTH FROM p.fecha) = m.mes
        AND p.fecha >= $1::date AND p.fecha < $2::date
        AND p.empresa_id = $3
      GROUP BY m.mes, m.nombre_mes
      ORDER BY m.mes
    `,
      [yearStart, yearEnd, empresaId],
    );
    return rows;
  }
  const { rows } = await pool.query(
    `
    SELECT m.nombre_mes, COALESCE(COUNT(p."idPago"), 0)::int AS cantidad_pagos
    FROM ${MONTH_VALUES_CTE}
    LEFT JOIN pagos p ON EXTRACT(MONTH FROM p.fecha) = m.mes
      AND p.fecha >= date_trunc('year', CURRENT_DATE)
      AND p.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
      AND p.empresa_id = $1
    GROUP BY m.mes, m.nombre_mes
    ORDER BY m.mes
  `,
    [empresaId],
  );
  return rows;
};

const totalPorAnio = async (empresaId, year) => {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${parseInt(year, 10) + 1}-01-01`;
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS "totalPagos" FROM pagos WHERE fecha >= $1::date AND fecha < $2::date AND empresa_id = $3`,
    [yearStart, yearEnd, empresaId],
  );
  return rows;
};

const conteosMensuales = async (empresaId) => {
  const { rows } = await pool.query(
    `
    SELECT
      COUNT(*) FILTER (
        WHERE fecha >= date_trunc('month', CURRENT_DATE)
          AND fecha < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      )::int AS "PagosMesActual",
      COUNT(*) FILTER (
        WHERE fecha >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
          AND fecha < date_trunc('month', CURRENT_DATE)
      )::int AS "PagosMesAnterior"
    FROM pagos
    WHERE empresa_id = $1
      AND fecha >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
      AND fecha < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
  `,
    [empresaId],
  );
  return rows[0];
};

const ingresosEgresosPorRangoFechas = async (empresaId, fechadesde, fechahasta) => {
  const { rows } = await pool.query(
    `
    SELECT d::date AS fecha,
           COUNT(p."idPago")::int AS cantidad_pagos,
           COALESCE(SUM(CASE WHEN p.monto > 0 THEN p.monto ELSE 0 END), 0)::float AS ingresos,
           COALESCE(SUM(CASE WHEN p.monto < 0 THEN -p.monto ELSE 0 END), 0)::float AS egresos
    FROM generate_series($1::date, $2::date, '1 day'::interval) d
    LEFT JOIN pagos p ON d::date = p.fecha AND p.empresa_id = $3
    GROUP BY d::date
    ORDER BY d::date
  `,
    [fechadesde, fechahasta, empresaId],
  );
  return rows;
};

const ingresosEgresosPorAnio = async (empresaId, year = null) => {
  if (year) {
    const yearStart = `${year}-01-01`;
    const yearEnd = `${parseInt(year, 10) + 1}-01-01`;
    const { rows } = await pool.query(
      `
      SELECT m.nombre_mes,
             COALESCE(SUM(CASE WHEN p.monto > 0 THEN p.monto ELSE 0 END), 0)::float AS ingresos,
             COALESCE(SUM(CASE WHEN p.monto < 0 THEN -p.monto ELSE 0 END), 0)::float AS egresos
      FROM ${MONTH_VALUES_CTE}
      LEFT JOIN pagos p ON EXTRACT(MONTH FROM p.fecha) = m.mes
        AND p.fecha >= $1::date AND p.fecha < $2::date
        AND p.empresa_id = $3
      GROUP BY m.mes, m.nombre_mes
      ORDER BY m.mes
    `,
      [yearStart, yearEnd, empresaId],
    );
    return rows;
  }
  const { rows } = await pool.query(
    `
    SELECT m.nombre_mes,
           COALESCE(SUM(CASE WHEN p.monto > 0 THEN p.monto ELSE 0 END), 0)::float AS ingresos,
           COALESCE(SUM(CASE WHEN p.monto < 0 THEN -p.monto ELSE 0 END), 0)::float AS egresos
    FROM ${MONTH_VALUES_CTE}
    LEFT JOIN pagos p ON EXTRACT(MONTH FROM p.fecha) = m.mes
      AND p.fecha >= date_trunc('year', CURRENT_DATE)
      AND p.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
      AND p.empresa_id = $1
    GROUP BY m.mes, m.nombre_mes
    ORDER BY m.mes
  `,
    [empresaId],
  );
  return rows;
};

const filtrarDashboard = async (empresaId, desde, hasta) => {
  const { rows } = await pool.query(
    `
    SELECT d::date AS fecha,
           COUNT(p."idPago")::int AS cantidad_pagos,
           COALESCE(SUM(CASE WHEN p.monto > 0 THEN p.monto ELSE 0 END), 0)::float AS ingresos,
           COALESCE(SUM(CASE WHEN p.monto < 0 THEN -p.monto ELSE 0 END), 0)::float AS egresos
    FROM generate_series($1::date, $2::date, '1 day'::interval) d
    LEFT JOIN pagos p ON d::date = p.fecha AND p.empresa_id = $3
    GROUP BY d::date
    ORDER BY d::date
  `,
    [desde, hasta, empresaId],
  );

  const totalPagos = rows.reduce((sum, r) => sum + r.cantidad_pagos, 0);
  return {
    pagos: rows.map(({ fecha, cantidad_pagos }) => ({ fecha, cantidad_pagos })),
    ingresosEgresos: rows.map(({ fecha, ingresos, egresos }) => ({ fecha, ingresos, egresos })),
    totalPagos,
  };
};

const resumenMesActual = async (empresaId) => {
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN monto > 0 THEN monto ELSE 0 END), 0)::float AS ingresos,
      COALESCE(SUM(CASE WHEN monto < 0 THEN ABS(monto) ELSE 0 END), 0)::float AS egresos,
      COALESCE(SUM(monto), 0)::float AS balance
    FROM pagos
    WHERE fecha >= date_trunc('month', CURRENT_DATE)
      AND fecha < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      AND empresa_id = $1
  `,
    [empresaId],
  );
  return rows[0];
};

const balancesProveedores = async (empresaId) => {
  const { rows } = await pool.query(
    `
    SELECT p.nombre,
           COALESCE(SUM(CASE WHEN pagos.monto > 0 THEN pagos.monto ELSE 0 END), 0)::float AS ingresos,
           COALESCE(SUM(CASE WHEN pagos.monto < 0 THEN ABS(pagos.monto) ELSE 0 END), 0)::float AS egresos,
           COALESCE(SUM(pagos.monto), 0)::float AS balance
    FROM pagos
    JOIN proveedores p ON pagos."idProveedor" = p.id
    WHERE pagos.fecha >= date_trunc('year', CURRENT_DATE)
      AND pagos.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
      AND pagos.empresa_id = $1
    GROUP BY p.nombre
    ORDER BY ABS(SUM(pagos.monto)) DESC
  `,
    [empresaId],
  );
  return rows;
};

const distribucionMediosPago = async (empresaId) => {
  const { rows } = await pool.query(
    `
    SELECT mp."nombreMedioPago" AS nombre,
           COUNT(*)::int AS cantidad,
           COALESCE(SUM(ABS(pagos.monto)), 0)::float AS total
    FROM pagos
    JOIN medio_pago mp ON pagos."idMedioPago" = mp."idMedioPago"
    WHERE pagos.fecha >= date_trunc('year', CURRENT_DATE)
      AND pagos.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
      AND pagos.empresa_id = $1
    GROUP BY mp."nombreMedioPago"
    ORDER BY total DESC
  `,
    [empresaId],
  );
  return rows;
};

const pagosRecientes = async (empresaId, limit = 5) => {
  const { rows } = await pool.query(
    `
    SELECT pagos."idPago",
           COALESCE(proveedores.nombre, clientes.nombre) AS nombre,
           pagos.monto, medio_pago."nombreMedioPago", pagos.fecha, pagos.tipo
    FROM pagos
    LEFT JOIN proveedores ON pagos."idProveedor" = proveedores.id
    LEFT JOIN clientes ON pagos."idCliente" = clientes.id
    JOIN medio_pago ON pagos."idMedioPago" = medio_pago."idMedioPago"
    WHERE pagos.empresa_id = $1
    ORDER BY pagos.fecha DESC, pagos."idPago" DESC
    LIMIT $2
  `,
    [empresaId, limit],
  );
  return rows;
};

const totalPorProveedor = async (empresaId, filters = {}) => {
  const { whereClause, params } = construirClausulaWhere({ ...filters, empresaId });
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(proveedores.nombre, clientes.nombre) AS "NombreProveedor",
      pagos.tipo,
      CASE WHEN pagos."idProveedor" IS NOT NULL THEN 'proveedor' ELSE 'cliente' END AS entidad,
      ${INCOME_EXPENSE_COLUMNS},
      SUM(pagos.monto) AS "MontoTotal",
      SUM(pagos."montoUSD") AS "MontoTotalUSD"
    FROM pagos
    LEFT JOIN proveedores ON pagos."idProveedor" = proveedores.id
    LEFT JOIN clientes ON pagos."idCliente" = clientes.id
    JOIN usuarios ON pagos."idUser" = usuarios.id
    ${whereClause}
    GROUP BY COALESCE(proveedores.nombre, clientes.nombre), pagos.tipo,
      CASE WHEN pagos."idProveedor" IS NOT NULL THEN 'proveedor' ELSE 'cliente' END
    ORDER BY pagos.tipo, COALESCE(proveedores.nombre, clientes.nombre)
  `,
    params,
  );
  return rows;
};

const totalGeneral = async (empresaId, fechaDesde, fechaHasta, nombreProveedor, nombreCliente) => {
  const filters = { empresaId, fechadesde: fechaDesde, fechahasta: fechaHasta };
  if (nombreProveedor) filters.nombreProveedor = nombreProveedor;
  if (nombreCliente) filters.nombreCliente = nombreCliente;

  const { whereClause, params } = construirClausulaWhere(filters);
  const provJoin = nombreProveedor
    ? 'JOIN proveedores ON pagos."idProveedor" = proveedores.id'
    : '';
  const clientJoin = nombreCliente
    ? 'JOIN clientes ON pagos."idCliente" = clientes.id'
    : '';

  const { rows } = await pool.query(
    `
    SELECT
      SUM(CASE WHEN monto > 0 THEN monto ELSE 0 END) AS "Ingresos",
      SUM(CASE WHEN "montoUSD" > 0 THEN "montoUSD" ELSE 0 END) AS "IngresosUSD",
      SUM(CASE WHEN monto < 0 THEN ABS(monto) ELSE 0 END) AS "Egresos",
      SUM(CASE WHEN "montoUSD" < 0 THEN ABS("montoUSD") ELSE 0 END) AS "EgresosUSD",
      SUM(monto) AS "MontoTotal",
      SUM("montoUSD") AS "MontoTotalUSD"
    FROM pagos
    ${provJoin}
    ${clientJoin}
    ${whereClause}
  `,
    params,
  );
  return rows;
};

const ingresosEgresosEnRango = async (empresaId, fechadesde, fechahasta, nombreProveedor, nombreCliente) => {
  const filters = { empresaId, fechadesde, fechahasta };
  if (nombreProveedor) filters.nombreProveedor = nombreProveedor;
  if (nombreCliente) filters.nombreCliente = nombreCliente;

  const { whereClause, params } = construirClausulaWhere(filters);
  const provJoin = nombreProveedor
    ? 'JOIN proveedores ON pagos."idProveedor" = proveedores.id'
    : '';
  const clientJoin = nombreCliente
    ? 'JOIN clientes ON pagos."idCliente" = clientes.id'
    : '';

  const { rows } = await pool.query(
    `
    SELECT
      SUM(CASE WHEN pagos.monto > 0 THEN pagos.monto ELSE 0 END) AS "Ingresos",
      SUM(CASE WHEN pagos.monto < 0 THEN ABS(pagos.monto) ELSE 0 END) AS "Egresos"
    FROM pagos
    ${provJoin}
    ${clientJoin}
    ${whereClause}
  `,
    params,
  );
  return rows[0];
};

const obtenerDashboard = async (empresaId) => {
  const { appPool } = require('../db/pool');
  const { tenantContext } = require('../db/pool');
  const client = await appPool.connect();
  try {
    const store = tenantContext.getStore();
    if (store?.empresaId) {
      await client.query(`SELECT set_config('app.current_empresa_id', $1, false)`, [
        String(store.empresaId),
      ]);
    }

    const [
      totalResult,
      mensualesResult,
      pagosPorAnioResult,
      ingresosEgresosAnioResult,
      resumenMesResult,
      balancesResult,
      mediosResult,
      recientesResult,
    ] = await Promise.all([
      client.query('SELECT COUNT(*)::int AS total_pagos FROM pagos WHERE empresa_id = $1', [
        empresaId,
      ]),
      client.query(
        `
        SELECT
          COUNT(*) FILTER (
            WHERE fecha >= date_trunc('month', CURRENT_DATE)
              AND fecha < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
          )::int AS "PagosMesActual",
          COUNT(*) FILTER (
            WHERE fecha >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
              AND fecha < date_trunc('month', CURRENT_DATE)
          )::int AS "PagosMesAnterior"
        FROM pagos
        WHERE empresa_id = $1
          AND fecha >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
          AND fecha < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
      `,
        [empresaId],
      ),
      client.query(
        `
        SELECT m.nombre_mes, COALESCE(COUNT(p."idPago"), 0)::int AS cantidad_pagos
        FROM ${MONTH_VALUES_CTE}
        LEFT JOIN pagos p ON EXTRACT(MONTH FROM p.fecha) = m.mes
          AND p.fecha >= date_trunc('year', CURRENT_DATE)
          AND p.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
          AND p.empresa_id = $1
        GROUP BY m.mes, m.nombre_mes
        ORDER BY m.mes
      `,
        [empresaId],
      ),
      client.query(
        `
        SELECT m.nombre_mes,
               COALESCE(SUM(CASE WHEN p.monto > 0 THEN p.monto ELSE 0 END), 0)::float AS ingresos,
               COALESCE(SUM(CASE WHEN p.monto < 0 THEN -p.monto ELSE 0 END), 0)::float AS egresos
        FROM ${MONTH_VALUES_CTE}
        LEFT JOIN pagos p ON EXTRACT(MONTH FROM p.fecha) = m.mes
          AND p.fecha >= date_trunc('year', CURRENT_DATE)
          AND p.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
          AND p.empresa_id = $1
        GROUP BY m.mes, m.nombre_mes
        ORDER BY m.mes
      `,
        [empresaId],
      ),
      client.query(
        `
        SELECT
          COALESCE(SUM(CASE WHEN monto > 0 THEN monto ELSE 0 END), 0)::float AS ingresos,
          COALESCE(SUM(CASE WHEN monto < 0 THEN ABS(monto) ELSE 0 END), 0)::float AS egresos,
          COALESCE(SUM(monto), 0)::float AS balance
        FROM pagos
        WHERE fecha >= date_trunc('month', CURRENT_DATE)
          AND fecha < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
          AND empresa_id = $1
      `,
        [empresaId],
      ),
      client.query(
        `
        SELECT p.nombre,
               COALESCE(SUM(CASE WHEN pagos.monto > 0 THEN pagos.monto ELSE 0 END), 0)::float AS ingresos,
               COALESCE(SUM(CASE WHEN pagos.monto < 0 THEN ABS(pagos.monto) ELSE 0 END), 0)::float AS egresos,
               COALESCE(SUM(pagos.monto), 0)::float AS balance
        FROM pagos
        JOIN proveedores p ON pagos."idProveedor" = p.id
        WHERE pagos.fecha >= date_trunc('year', CURRENT_DATE)
          AND pagos.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
          AND pagos.empresa_id = $1
        GROUP BY p.nombre
        ORDER BY ABS(SUM(pagos.monto)) DESC
      `,
        [empresaId],
      ),
      client.query(
        `
        SELECT mp."nombreMedioPago" AS nombre,
               COUNT(*)::int AS cantidad,
               COALESCE(SUM(ABS(pagos.monto)), 0)::float AS total
        FROM pagos
        JOIN medio_pago mp ON pagos."idMedioPago" = mp."idMedioPago"
        WHERE pagos.fecha >= date_trunc('year', CURRENT_DATE)
          AND pagos.fecha < date_trunc('year', CURRENT_DATE) + INTERVAL '1 year'
          AND pagos.empresa_id = $1
        GROUP BY mp."nombreMedioPago"
        ORDER BY total DESC
      `,
        [empresaId],
      ),
      client.query(
        `
        SELECT pagos."idPago",
               COALESCE(proveedores.nombre, clientes.nombre) AS nombre,
               pagos.monto, medio_pago."nombreMedioPago", pagos.fecha, pagos.tipo
        FROM pagos
        LEFT JOIN proveedores ON pagos."idProveedor" = proveedores.id
        LEFT JOIN clientes ON pagos."idCliente" = clientes.id
        JOIN medio_pago ON pagos."idMedioPago" = medio_pago."idMedioPago"
        WHERE pagos.empresa_id = $1
        ORDER BY pagos.fecha DESC, pagos."idPago" DESC
        LIMIT 5
      `,
        [empresaId],
      ),
    ]);

    const mensuales = mensualesResult.rows[0] || { PagosMesActual: 0, PagosMesAnterior: 0 };

    return {
      totalPagos: totalResult.rows[0]?.total_pagos || 0,
      pagosMesActual: mensuales.PagosMesActual,
      pagosMesAnterior: mensuales.PagosMesAnterior,
      pagosPorAnio: pagosPorAnioResult.rows,
      ingresosEgresosAnio: ingresosEgresosAnioResult.rows,
      resumenMes: resumenMesResult.rows[0] || { ingresos: 0, egresos: 0, balance: 0 },
      balancesProveedores: balancesResult.rows,
      mediosDePago: mediosResult.rows,
      ultimosPagos: recientesResult.rows,
    };
  } finally {
    client.release();
  }
};

module.exports = {
  buscarTodos,
  buscarFiltrado,
  buscarPorUsuario,
  crear,
  actualizar,
  eliminar,
  contarPorRangoFechas,
  contarTotalEnRango,
  contarTotal,
  contarPorAnio,
  totalPorAnio,
  conteosMensuales,
  ingresosEgresosPorRangoFechas,
  ingresosEgresosPorAnio,
  totalPorProveedor,
  totalGeneral,
  ingresosEgresosEnRango,
  filtrarDashboard,
  obtenerDashboard,
  resumenMesActual,
  balancesProveedores,
  distribucionMediosPago,
  pagosRecientes,
};
