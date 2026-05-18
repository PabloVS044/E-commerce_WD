const compraInsumoService = require('../services/compraInsumoService');
const { withTransaction } = require('../utils/transaction');

async function createCompraInsumo(req, res) {
  const result = await withTransaction((client) => (
    compraInsumoService.createCompraInsumo(client, req.body, req.session.user)
  ));
  res.status(201).json(result);
}

module.exports = {
  createCompraInsumo,
};
