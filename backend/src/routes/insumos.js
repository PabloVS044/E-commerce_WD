const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const requireAuth = require('../middleware/requireAuth');
const insumoController = require('../controllers/insumoController');

const router = express.Router();

router.use(requireAuth);

router.get('/proveedores', asyncHandler(insumoController.listSuppliers));
router.get('/', asyncHandler(insumoController.listInsumos));
router.get('/:id', asyncHandler(insumoController.getInsumo));
router.post('/', asyncHandler(insumoController.createInsumo));
router.put('/:id', asyncHandler(insumoController.updateInsumo));
router.delete('/:id', asyncHandler(insumoController.deleteInsumo));

module.exports = router;
