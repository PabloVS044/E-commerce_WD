const express = require('express');

const authRoutes = require('./auth');
const productRoutes = require('./productos');
const insumoRoutes = require('./insumos');
const consultaRoutes = require('./consultas');
const compraInsumoRoutes = require('./comprasInsumos');
const reporteRoutes = require('./reportes');
const pedidoRoutes = require('./pedidos');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true });
});

router.use('/auth', authRoutes);
router.use('/productos', productRoutes);
router.use('/insumos', insumoRoutes);
router.use('/consultas', consultaRoutes);
router.use('/compras-insumos', compraInsumoRoutes);
router.use('/reportes', reporteRoutes);
router.use('/pedidos', pedidoRoutes);

module.exports = router;
