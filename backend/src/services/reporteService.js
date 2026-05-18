const reporteModel = require('../models/reporteModel');
const { AppError } = require('../utils/appError');

async function getVentasPorProducto() {
  return reporteModel.getVentasPorProducto();
}

async function getVentasDiarias() {
  return reporteModel.getVentasDiarias();
}

async function getClientesFrecuentes(minPedidos) {
  const parsedMinPedidos = Number(minPedidos || 2);
  if (!Number.isInteger(parsedMinPedidos) || parsedMinPedidos < 1) {
    throw new AppError(400, 'min_pedidos debe ser un entero mayor o igual a 1.');
  }

  const datos = await reporteModel.getClientesFrecuentes(parsedMinPedidos);
  return {
    datos,
    min_pedidos: parsedMinPedidos,
  };
}

async function getRankingProductos() {
  return reporteModel.getRankingProductos();
}

module.exports = {
  getVentasPorProducto,
  getVentasDiarias,
  getClientesFrecuentes,
  getRankingProductos,
};
