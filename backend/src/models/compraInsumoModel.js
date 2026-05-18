const queries = require('../queries/compraInsumoQueries');

async function findActiveProviderById(executor, idProveedor) {
  const result = await executor.query(queries.findActiveProviderById, [idProveedor]);
  return result.rows[0] || null;
}

async function findActiveEmployeeById(executor, idEmpleado) {
  const result = await executor.query(queries.findActiveEmployeeById, [idEmpleado]);
  return result.rows[0] || null;
}

async function findActiveInsumosByIds(executor, idsInsumo) {
  const result = await executor.query(queries.findActiveInsumosByIds, [idsInsumo]);
  return result.rows;
}

async function createCompraInsumo(executor, payload) {
  const result = await executor.query(queries.insertCompraInsumo, payload);
  return result.rows[0];
}

async function createCompraInsumoDetalle(executor, payload) {
  await executor.query(queries.insertCompraInsumoDetalle, payload);
}

async function increaseInsumoStock(executor, cantidad, idInsumo) {
  await executor.query(queries.increaseInsumoStock, [cantidad, idInsumo]);
}

async function createInventoryEntry(executor, payload) {
  await executor.query(queries.insertInventoryEntry, payload);
}

module.exports = {
  findActiveProviderById,
  findActiveEmployeeById,
  findActiveInsumosByIds,
  createCompraInsumo,
  createCompraInsumoDetalle,
  increaseInsumoStock,
  createInventoryEntry,
};
