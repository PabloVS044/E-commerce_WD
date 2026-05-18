const consultaModel = require('../models/consultaModel');

module.exports = {
  getJoinPedidosResumen: () => consultaModel.getJoinPedidosResumen(),
  getJoinComprasResumen: () => consultaModel.getJoinComprasResumen(),
  getSubqueryClientesConPagos: () => consultaModel.getSubqueryClientesConPagos(),
  getSubqueryProveedoresGasto: () => consultaModel.getSubqueryProveedoresGasto(),
  getSubqueryProductosSinVentas: () => consultaModel.getSubqueryProductosSinVentas(),
  getViewPedidosResumen: () => consultaModel.getViewPedidosResumen(),
  getViewStockCritico: () => consultaModel.getViewStockCritico(),
};
