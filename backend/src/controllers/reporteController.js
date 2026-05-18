const reporteService = require('../services/reporteService');

async function getVentas(req, res) {
  const datos = await reporteService.getVentasPorProducto();
  res.json({ datos });
}

async function getDiario(req, res) {
  const datos = await reporteService.getVentasDiarias();
  res.json({ datos });
}

async function getClientesFrecuentes(req, res) {
  const result = await reporteService.getClientesFrecuentes(req.query.min_pedidos);
  res.json(result);
}

async function getRankingProductos(req, res) {
  const datos = await reporteService.getRankingProductos();
  res.json({ datos });
}

module.exports = {
  getVentas,
  getDiario,
  getClientesFrecuentes,
  getRankingProductos,
};
