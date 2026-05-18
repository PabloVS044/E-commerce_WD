const pool = require('../config/db');
const queries = require('../queries/consultaQueries');

async function queryRows(sql, params = [], executor = pool) {
  const result = await executor.query(sql, params);
  return result.rows;
}

module.exports = {
  getJoinPedidosResumen: (executor) => queryRows(queries.joinPedidosResumen, [], executor),
  getJoinComprasResumen: (executor) => queryRows(queries.joinComprasResumen, [], executor),
  getSubqueryClientesConPagos: (executor) => queryRows(queries.subqueryClientesConPagos, [], executor),
  getSubqueryProveedoresGasto: (executor) => queryRows(queries.subqueryProveedoresGasto, [], executor),
  getSubqueryProductosSinVentas: (executor) => queryRows(queries.subqueryProductosSinVentas, [], executor),
  getViewPedidosResumen: (executor) => queryRows(queries.viewPedidosResumen, [], executor),
  getViewStockCritico: (executor) => queryRows(queries.viewStockCritico, [], executor),
};
