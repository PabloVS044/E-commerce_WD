const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const requireAuth = require('../middleware/requireAuth');
const consultaController = require('../controllers/consultaController');

const router = express.Router();

router.use(requireAuth);

router.get('/joins/pedidos-resumen', asyncHandler(consultaController.getJoinPedidosResumen));
router.get('/joins/compras-resumen', asyncHandler(consultaController.getJoinComprasResumen));
router.get('/subqueries/clientes-con-pagos', asyncHandler(consultaController.getSubqueryClientesConPagos));
router.get('/subqueries/proveedores-gasto', asyncHandler(consultaController.getSubqueryProveedoresGasto));
router.get('/subqueries/productos-sin-ventas', asyncHandler(consultaController.getSubqueryProductosSinVentas));
router.get('/views/pedidos-resumen', asyncHandler(consultaController.getViewPedidosResumen));
router.get('/views/stock-critico', asyncHandler(consultaController.getViewStockCritico));

module.exports = router;
