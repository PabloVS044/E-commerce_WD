const pool = require('../config/db');
const queries = require('../queries/insumoQueries');

async function listSuppliers(executor = pool) {
  const result = await executor.query(queries.listSuppliers);
  return result.rows;
}

async function listInsumos(executor = pool) {
  const result = await executor.query(queries.listInsumos);
  return result.rows;
}

async function findInsumoById(idInsumo, executor = pool) {
  const result = await executor.query(queries.findInsumoById, [idInsumo]);
  return result.rows[0] || null;
}

async function createInsumo(payload, executor = pool) {
  const result = await executor.query(queries.insertInsumo, payload);
  return result.rows[0];
}

async function updateInsumo(idInsumo, payload, executor = pool) {
  const result = await executor.query(queries.updateInsumo, [...payload, idInsumo]);
  return result.rows[0] || null;
}

async function deleteInsumo(idInsumo, executor = pool) {
  const result = await executor.query(queries.deleteInsumo, [idInsumo]);
  return result.rowCount;
}

module.exports = {
  listSuppliers,
  listInsumos,
  findInsumoById,
  createInsumo,
  updateInsumo,
  deleteInsumo,
};
