const PAGOS_BASE_SELECT = `
  pagos."idPago",
  COALESCE(proveedores.nombre, clientes.nombre) AS nombre,
  proveedores.nombre AS proveedor_nombre,
  clientes.nombre AS cliente_nombre,
  pagos.monto, medio_pago."nombreMedioPago",
  pagos.fecha, pagos.descripcion, pagos."montoUSD", pagos."usdDelDia",
  usuarios.username, pagos.tipo`;

const PAGOS_BASE_JOIN = `
  FROM pagos
  LEFT JOIN proveedores ON pagos."idProveedor" = proveedores.id
  LEFT JOIN clientes ON pagos."idCliente" = clientes.id
  JOIN usuarios ON pagos."idUser" = usuarios.id
  JOIN medio_pago ON pagos."idMedioPago" = medio_pago."idMedioPago"`;

const MONTH_VALUES_CTE = `
  (VALUES (1,'Enero'),(2,'Febrero'),(3,'Marzo'),(4,'Abril'),(5,'Mayo'),(6,'Junio'),
          (7,'Julio'),(8,'Agosto'),(9,'Septiembre'),(10,'Octubre'),(11,'Noviembre'),(12,'Diciembre')
  ) AS m(mes, nombre_mes)`;

const INCOME_EXPENSE_COLUMNS = `
  SUM(CASE WHEN pagos.monto > 0 THEN pagos.monto ELSE 0 END) AS "Ingresos",
  SUM(CASE WHEN pagos.monto < 0 THEN ABS(pagos.monto) ELSE 0 END) AS "Egresos",
  SUM(CASE WHEN pagos."montoUSD" > 0 THEN pagos."montoUSD" ELSE 0 END) AS "IngresosUSD",
  SUM(CASE WHEN pagos."montoUSD" < 0 THEN ABS(pagos."montoUSD") ELSE 0 END) AS "EgresosUSD"`;

const DEFINICIONES_FILTRO = {
  empresaId: { columna: 'pagos.empresa_id', operador: '=' },
  fechadesde: { columna: 'pagos.fecha', operador: '>=' },
  fechahasta: { columna: 'pagos.fecha', operador: '<=' },
  tipo: { columna: 'pagos.tipo', operador: '=' },
  idUser: { columna: 'pagos."idUser"', operador: '=' },
  nombreProveedor: { columna: 'proveedores.nombre', operador: '=' },
  usuarioFiltrado: { columna: 'usuarios.username', operador: '=' },
  nombreCliente: { columna: 'clientes.nombre', operador: '=' },
};

const construirClausulaWhere = (filters, startIndex = 1) => {
  let idx = startIndex;
  const conditions = [];
  const params = [];

  for (const [clave, valor] of Object.entries(filters)) {
    if (valor == null) continue;
    const def = DEFINICIONES_FILTRO[clave];
    if (!def) continue;
    conditions.push(`${def.columna} ${def.operador} $${idx++}`);
    params.push(valor);
  }

  return {
    whereClause: conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '',
    params,
    nextIndex: idx,
  };
};

const MAX_PAGE_SIZE = 100;

const construirClausulaPaginacion = (page, limit, nextIndex) => {
  if (!limit) return { paginationClause: '', paginationParams: [], nextIndex };
  const cappedLimit = Math.min(parseInt(limit, 10) || MAX_PAGE_SIZE, MAX_PAGE_SIZE);
  const paginationParams = [cappedLimit];
  let clause = `LIMIT $${nextIndex++}`;
  if (page && page > 1) {
    clause += ` OFFSET $${nextIndex++}`;
    paginationParams.push((page - 1) * cappedLimit);
  }
  return { paginationClause: clause, paginationParams, nextIndex };
};

module.exports = {
  PAGOS_BASE_SELECT,
  PAGOS_BASE_JOIN,
  MONTH_VALUES_CTE,
  INCOME_EXPENSE_COLUMNS,
  construirClausulaWhere,
  construirClausulaPaginacion,
};
