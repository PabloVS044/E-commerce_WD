const productService = require('../services/productService');

async function listCategories(req, res) {
  const categorias = await productService.listCategories();
  res.json({ categorias });
}

async function listProducts(req, res) {
  const productos = await productService.listProducts();
  res.json({ productos });
}

async function getProduct(req, res) {
  const producto = await productService.getProduct(req.params.id);
  res.json({ producto });
}

async function createProduct(req, res) {
  const producto = await productService.createProduct(req.body);
  res.status(201).json({ producto });
}

async function updateProduct(req, res) {
  const producto = await productService.updateProduct(req.params.id, req.body);
  res.json({ producto });
}

async function deleteProduct(req, res) {
  await productService.deleteProduct(req.params.id);
  res.json({ message: 'Producto eliminado.' });
}

module.exports = {
  listCategories,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
