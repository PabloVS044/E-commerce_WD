const queries = require('../queries/orderQueries');

async function listCatalogProducts(executor, onlyAvailable) {
  const result = await executor.query(queries.listCatalogProducts(onlyAvailable));
  return result.rows;
}

async function listRecipes(executor) {
  const result = await executor.query(queries.listRecipes);
  return result.rows;
}

async function listComboItems(executor) {
  const result = await executor.query(queries.listComboItems);
  return result.rows;
}

async function listActiveExtras(executor) {
  const result = await executor.query(queries.listActiveExtras);
  return result.rows;
}

async function findGeneralCustomerId(executor, email) {
  const result = await executor.query(queries.findGeneralCustomerId, [email]);
  return result.rows[0] || null;
}

async function findActiveCustomerById(executor, idCliente) {
  const result = await executor.query(queries.findActiveCustomerById, [idCliente]);
  return result.rows[0] || null;
}

async function listActiveCustomers(executor, generalCustomerEmail) {
  const result = await executor.query(queries.listActiveCustomers, [generalCustomerEmail]);
  return result.rows;
}

async function findCustomerByEmail(executor, email) {
  const result = await executor.query(queries.findCustomerByEmail, [email]);
  return result.rows[0] || null;
}

async function updateCustomerById(executor, payload) {
  await executor.query(queries.updateCustomerById, payload);
}

async function findCustomerByIdentity(executor, payload) {
  const result = await executor.query(queries.findCustomerByIdentity, payload);
  return result.rows[0] || null;
}

async function createCustomer(executor, payload) {
  const result = await executor.query(queries.insertCustomer, payload);
  return result.rows[0];
}

async function createOrder(executor, payload) {
  const result = await executor.query(queries.insertOrder, payload);
  return result.rows[0];
}

async function createOrderItem(executor, payload) {
  const result = await executor.query(queries.insertOrderItem, payload);
  return result.rows[0];
}

async function createOrderItemModification(executor, payload) {
  await executor.query(queries.insertOrderItemModification, payload);
}

async function createPayment(executor, payload) {
  await executor.query(queries.insertPayment, payload);
}

async function decrementStock(executor, cantidad, idInsumo) {
  await executor.query(queries.decrementStock, [cantidad, idInsumo]);
}

async function incrementStock(executor, cantidad, idInsumo) {
  await executor.query(queries.incrementStock, [cantidad, idInsumo]);
}

async function createInventoryMovement(executor, payload) {
  await executor.query(queries.insertInventoryMovement, payload);
}

async function findOrderCore(executor, idPedido) {
  const result = await executor.query(queries.findOrderCore, [idPedido]);
  return result.rows[0] || null;
}

async function listOrderItems(executor, idPedido) {
  const result = await executor.query(queries.listOrderItems, [idPedido]);
  return result.rows;
}

async function listOrderModifications(executor, idPedido) {
  const result = await executor.query(queries.listOrderModifications, [idPedido]);
  return result.rows;
}

async function listOrders(executor, limit) {
  const result = await executor.query(queries.listOrders, [limit]);
  return result.rows;
}

async function listOrderConsumptionItems(executor, idPedido) {
  const result = await executor.query(queries.listOrderConsumptionItems, [idPedido]);
  return result.rows;
}

async function listOrderConsumptionModifications(executor, idPedido) {
  const result = await executor.query(queries.listOrderConsumptionModifications, [idPedido]);
  return result.rows;
}

async function listOrderInventoryOutputs(executor, idPedido) {
  const result = await executor.query(queries.listOrderInventoryOutputs, [idPedido]);
  return result.rows;
}

async function updatePaymentStatus(executor, estado, fechaConfirmacion, idPedido) {
  await executor.query(queries.updatePaymentStatus, [estado, fechaConfirmacion, idPedido]);
}

async function updateOrderFields(executor, idPedido, assignments, values) {
  await executor.query(
    `UPDATE pedido
     SET ${assignments.join(', ')}
     WHERE id_pedido = $${values.length + 1}`,
    [...values, idPedido]
  );
}

module.exports = {
  listCatalogProducts,
  listRecipes,
  listComboItems,
  listActiveExtras,
  findGeneralCustomerId,
  findActiveCustomerById,
  listActiveCustomers,
  findCustomerByEmail,
  updateCustomerById,
  findCustomerByIdentity,
  createCustomer,
  createOrder,
  createOrderItem,
  createOrderItemModification,
  createPayment,
  decrementStock,
  incrementStock,
  createInventoryMovement,
  findOrderCore,
  listOrderItems,
  listOrderModifications,
  listOrders,
  listOrderConsumptionItems,
  listOrderConsumptionModifications,
  listOrderInventoryOutputs,
  updatePaymentStatus,
  updateOrderFields,
};
