const insumoService = require('../services/insumoService');

async function listSuppliers(req, res) {
  const proveedores = await insumoService.listSuppliers();
  res.json({ proveedores });
}

async function listInsumos(req, res) {
  const insumos = await insumoService.listInsumos();
  res.json({ insumos });
}

async function getInsumo(req, res) {
  const insumo = await insumoService.getInsumo(req.params.id);
  res.json({ insumo });
}

async function createInsumo(req, res) {
  const insumo = await insumoService.createInsumo(req.body);
  res.status(201).json({ insumo });
}

async function updateInsumo(req, res) {
  const insumo = await insumoService.updateInsumo(req.params.id, req.body);
  res.json({ insumo });
}

async function deleteInsumo(req, res) {
  await insumoService.deleteInsumo(req.params.id);
  res.json({ message: 'Insumo eliminado.' });
}

module.exports = {
  listSuppliers,
  listInsumos,
  getInsumo,
  createInsumo,
  updateInsumo,
  deleteInsumo,
};
