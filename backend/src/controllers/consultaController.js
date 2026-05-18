const consultaService = require('../services/consultaService');

async function getJoinPedidosResumen(req, res) {
  const datos = await consultaService.getJoinPedidosResumen();
  res.json({ datos });
}

async function getJoinComprasResumen(req, res) {
  const datos = await consultaService.getJoinComprasResumen();
  res.json({ datos });
}

async function getSubqueryClientesConPagos(req, res) {
  const datos = await consultaService.getSubqueryClientesConPagos();
  res.json({ datos });
}

async function getSubqueryProveedoresGasto(req, res) {
  const datos = await consultaService.getSubqueryProveedoresGasto();
  res.json({ datos });
}

async function getSubqueryProductosSinVentas(req, res) {
  const datos = await consultaService.getSubqueryProductosSinVentas();
  res.json({ datos });
}

async function getViewPedidosResumen(req, res) {
  const datos = await consultaService.getViewPedidosResumen();
  res.json({ datos });
}

async function getViewStockCritico(req, res) {
  const datos = await consultaService.getViewStockCritico();
  res.json({ datos });
}

module.exports = {
  getJoinPedidosResumen,
  getJoinComprasResumen,
  getSubqueryClientesConPagos,
  getSubqueryProveedoresGasto,
  getSubqueryProductosSinVentas,
  getViewPedidosResumen,
  getViewStockCritico,
};
