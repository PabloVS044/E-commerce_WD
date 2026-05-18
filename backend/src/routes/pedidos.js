const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const requireAuth = require('../middleware/requireAuth');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.get('/catalogo', asyncHandler(pedidoController.getCatalog));
router.get('/seguimiento/:codigo', asyncHandler(pedidoController.getTrackingByCode));
router.post('/online', asyncHandler(pedidoController.createOnlineOrder));

router.use(requireAuth);

router.get('/clientes', asyncHandler(pedidoController.getCustomers));
router.get('/', asyncHandler(pedidoController.listMonitorOrders));
router.post('/', asyncHandler(pedidoController.createCounterOrder));
router.get('/:id', asyncHandler(pedidoController.getOrder));
router.patch('/:id/estado', asyncHandler(pedidoController.updateStatus));

module.exports = router;
