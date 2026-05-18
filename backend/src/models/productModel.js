const pool = require('../config/db');
const queries = require('../queries/productQueries');

async function listCategories(executor = pool) {
  const result = await executor.query(queries.listCategories);
  return result.rows;
}

async function findCategoryById(idCategoria, executor = pool) {
  const result = await executor.query(queries.findCategoryById, [idCategoria]);
  return result.rows[0] || null;
}

async function listProducts(executor = pool) {
  const result = await executor.query(queries.listProducts);
  return result.rows;
}

async function findProductById(idProducto, executor = pool) {
  const result = await executor.query(queries.findProductById, [idProducto]);
  return result.rows[0] || null;
}

async function listProductRecipe(idProducto, executor = pool) {
  const result = await executor.query(queries.listProductRecipe, [idProducto]);
  return result.rows;
}

async function listProductComboItems(idProducto, executor = pool) {
  const result = await executor.query(queries.listProductComboItems, [idProducto]);
  return result.rows;
}

async function listAllComboItems(executor = pool) {
  const result = await executor.query(queries.listAllComboItems);
  return result.rows;
}

async function createProduct(payload, executor = pool) {
  const result = await executor.query(queries.insertProduct, payload);
  return result.rows[0];
}

async function updateProduct(idProducto, payload, executor = pool) {
  const result = await executor.query(queries.updateProduct, [...payload, idProducto]);
  return result.rows[0] || null;
}

async function clearProductRecipe(idProducto, executor = pool) {
  await executor.query(queries.deleteProductRecipe, [idProducto]);
}

async function addRecipeItem(idProducto, idInsumo, cantidad, executor = pool) {
  await executor.query(queries.insertRecipeItem, [idProducto, idInsumo, cantidad]);
}

async function clearProductComboItems(idProducto, executor = pool) {
  await executor.query(queries.deleteProductComboItems, [idProducto]);
}

async function addProductComboItem(idProductoCombo, idProductoComponente, cantidad, executor = pool) {
  await executor.query(queries.insertComboItem, [idProductoCombo, idProductoComponente, cantidad]);
}

async function deleteProduct(idProducto, executor = pool) {
  const result = await executor.query(queries.deleteProduct, [idProducto]);
  return result.rowCount;
}

module.exports = {
  listCategories,
  findCategoryById,
  listProducts,
  findProductById,
  listProductRecipe,
  listProductComboItems,
  listAllComboItems,
  createProduct,
  updateProduct,
  clearProductRecipe,
  addRecipeItem,
  clearProductComboItems,
  addProductComboItem,
  deleteProduct,
};
