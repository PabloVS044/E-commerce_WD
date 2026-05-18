const pool = require('../config/db');
const queries = require('../queries/reporteQueries');

async function queryRows(sql, params = [], executor = pool) {
  const result = await executor.query(sql, params);
  return result.rows;
}

module.exports = {
  getVentasPorProducto: (executor) => queryRows(queries.ventasPorProducto, [], executor),
  getVentasDiarias: (executor) => queryRows(queries.ventasDiarias, [], executor),
  getClientesFrecuentes: (minPedidos, executor) => queryRows(queries.clientesFrecuentes, [minPedidos], executor),
  getRankingProductos: (executor) => queryRows(queries.rankingProductos, [], executor),
};
