const orderModel = require('../models/orderModel');
const { AppError } = require('../utils/appError');

const GENERAL_CUSTOMER_EMAIL = 'general@tacospepe.gt';
const ORDER_CODE_PREFIX = 'PEPE-';

function orderError(status, message) {
  return new AppError(status, message);
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function formatOrderCode(idPedido) {
  return `${ORDER_CODE_PREFIX}${String(idPedido).padStart(6, '0')}`;
}

function parseOrderCode(rawCode) {
  if (!rawCode) {
    return null;
  }

  const match = String(rawCode).trim().toUpperCase().match(/(\d+)$/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function canonicalIngredientName(rawName) {
  return String(rawName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isRemovableIngredient(name) {
  return /cebolla|cilantro|salsa|piña|lechuga|tomate|limon|crema|queso|aguacate|pico|chile|picante/.test(
    canonicalIngredientName(name)
  );
}

function makeGuestEmail(customer = {}) {
  const phoneFragment = String(customer.telefono || '').replace(/\D+/g, '').slice(-8) || 'guest';
  const timeFragment = Date.now();
  return `guest-${phoneFragment}-${timeFragment}@pedidos.tacospepe.local`;
}

function splitCustomerName(customer = {}) {
  const rawFullName = String(customer.nombre || '').trim();
  const explicitLastName = String(customer.apellido || '').trim();

  if (!rawFullName && !explicitLastName) {
    return { nombre: 'Cliente', apellido: 'General' };
  }

  if (explicitLastName) {
    return {
      nombre: rawFullName || 'Cliente',
      apellido: explicitLastName,
    };
  }

  const parts = rawFullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { nombre: 'Cliente', apellido: 'General' };
  }

  if (parts.length === 1) {
    return { nombre: parts[0], apellido: 'Cliente' };
  }

  return {
    nombre: parts[0],
    apellido: parts.slice(1).join(' '),
  };
}

function cloneIngredient(ingredient) {
  return {
    id_insumo: ingredient.id_insumo,
    nombre: ingredient.nombre,
    unidad_medida: ingredient.unidad_medida,
    stock_actual: Number(ingredient.stock_actual || 0),
    cantidad: Number(ingredient.cantidad || 0),
  };
}

function addIngredientQuantity(targetMap, ingredient, factor = 1) {
  const current = targetMap.get(ingredient.id_insumo) || {
    id_insumo: ingredient.id_insumo,
    nombre: ingredient.nombre,
    unidad_medida: ingredient.unidad_medida,
    stock_actual: Number(ingredient.stock_actual || 0),
    cantidad: 0,
  };

  current.cantidad += Number(ingredient.cantidad || 0) * factor;
  targetMap.set(ingredient.id_insumo, current);
}

function getExpandedRecipe(productId, productById, recipesByProduct, combosByProduct, memo, stack = new Set()) {
  if (memo.has(productId)) {
    return memo.get(productId);
  }

  if (stack.has(productId)) {
    throw orderError(500, 'Se detectó una referencia circular en la composición de productos.');
  }

  stack.add(productId);

  const product = productById.get(productId);
  const aggregated = new Map();

  if (product?.es_combo) {
    const comboItems = combosByProduct.get(productId) || [];
    comboItems.forEach((component) => {
      const componentRecipe = getExpandedRecipe(
        component.id_producto_componente,
        productById,
        recipesByProduct,
        combosByProduct,
        memo,
        stack
      );

      componentRecipe.forEach((ingredient) => {
        addIngredientQuantity(aggregated, ingredient, Number(component.cantidad || 0));
      });
    });
  } else {
    const recipeItems = recipesByProduct.get(productId) || [];
    recipeItems.forEach((ingredient) => {
      addIngredientQuantity(aggregated, ingredient, 1);
    });
  }

  stack.delete(productId);

  const normalized = Array.from(aggregated.values())
    .map(cloneIngredient)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  memo.set(productId, normalized);
  return normalized;
}

function serializeProducts(products, recipesByProduct, combosByProduct, extras, productById) {
  const memo = new Map();

  return products.map((product) => {
    const normalizedCategory = canonicalIngredientName(product.categoria);
    const canCustomize = !product.es_combo && !/bebida|postre/.test(normalizedCategory);
    const ingredients = getExpandedRecipe(
      product.id_producto,
      productById,
      recipesByProduct,
      combosByProduct,
      memo
    );

    const availableExtras = (canCustomize
      ? extras.filter((extra) => Number(extra.stock_actual || 0) >= Number(extra.cantidad_insumo || 0))
      : [])
      .map((extra) => ({
        id_extra: extra.id_extra,
        nombre: extra.nombre,
        precio: Number(extra.precio || 0),
        id_insumo: extra.id_insumo,
        insumo: extra.insumo,
        cantidad_insumo: Number(extra.cantidad_insumo || 0),
        stock_actual: Number(extra.stock_actual || 0),
        unidad_medida: extra.unidad_medida,
      }));

    const removableIngredients = !canCustomize
      ? []
      : ingredients
          .filter((ingredient) => isRemovableIngredient(ingredient.nombre))
          .map((ingredient) => ({
            id_insumo: ingredient.id_insumo,
            nombre: ingredient.nombre,
          }));

    const components = (combosByProduct.get(product.id_producto) || []).map((component) => ({
      id_producto: component.id_producto_componente,
      nombre: component.componente,
      cantidad: Number(component.cantidad || 0),
    }));

    const canOrder = product.disponible && ingredients.every(
      (ingredient) => Number(ingredient.stock_actual || 0) >= Number(ingredient.cantidad || 0)
    );

    const shortages = ingredients
      .filter((ingredient) => Number(ingredient.stock_actual || 0) < Number(ingredient.cantidad || 0))
      .map((ingredient) => ({
        id_insumo: ingredient.id_insumo,
        nombre: ingredient.nombre,
        stock_actual: Number(ingredient.stock_actual || 0),
        requerido: Number(ingredient.cantidad || 0),
      }));

    return {
      id_producto: product.id_producto,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: Number(product.precio || 0),
      categoria: product.categoria,
      es_combo: product.es_combo,
      disponible: product.disponible,
      componentes: components,
      ingredientes_base: ingredients,
      ingredientes_removibles: removableIngredients,
      extras_disponibles: availableExtras,
      can_order: canOrder,
      shortages,
    };
  });
}

async function loadCatalog(client, { onlyAvailable = false } = {}) {
  const productsRows = await orderModel.listCatalogProducts(client, onlyAvailable);
  const recipesRows = await orderModel.listRecipes(client);
  const combosRows = await orderModel.listComboItems(client);
  const extrasRows = await orderModel.listActiveExtras(client);

  const products = productsRows.map((row) => ({
    id_producto: Number(row.id_producto),
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio || 0),
    es_combo: row.es_combo,
    disponible: row.disponible,
    categoria: row.categoria,
  }));

  const productById = new Map(products.map((product) => [product.id_producto, product]));

  const recipesByProduct = new Map();
  recipesRows.forEach((row) => {
    const list = recipesByProduct.get(Number(row.id_producto)) || [];
    list.push({
      id_insumo: Number(row.id_insumo),
      nombre: row.nombre,
      unidad_medida: row.unidad_medida,
      stock_actual: Number(row.stock_actual || 0),
      cantidad: Number(row.cantidad || 0),
    });
    recipesByProduct.set(Number(row.id_producto), list);
  });

  const combosByProduct = new Map();
  combosRows.forEach((row) => {
    const list = combosByProduct.get(Number(row.id_producto_combo)) || [];
    list.push({
      id_producto_componente: Number(row.id_producto_componente),
      componente: row.componente,
      cantidad: Number(row.cantidad || 0),
    });
    combosByProduct.set(Number(row.id_producto_combo), list);
  });

  const extras = extrasRows.map((row) => ({
    id_extra: Number(row.id_extra),
    id_insumo: Number(row.id_insumo),
    nombre: row.nombre,
    precio: Number(row.precio || 0),
    cantidad_insumo: Number(row.cantidad_insumo || 0),
    insumo: row.insumo,
    stock_actual: Number(row.stock_actual || 0),
    unidad_medida: row.unidad_medida,
  }));

  const serializedProducts = serializeProducts(products, recipesByProduct, combosByProduct, extras, productById);
  const filteredProducts = onlyAvailable
    ? serializedProducts.filter((product) => product.disponible)
    : serializedProducts;

  const categories = [...new Set(filteredProducts.map((product) => product.categoria))];

  return {
    categories,
    products: filteredProducts,
    productById: new Map(filteredProducts.map((product) => [product.id_producto, product])),
    extrasById: new Map(extras.map((extra) => [extra.id_extra, extra])),
  };
}

async function getGeneralCustomerId(client) {
  const result = await orderModel.findGeneralCustomerId(client, GENERAL_CUSTOMER_EMAIL);

  if (!result) {
    throw orderError(500, 'No existe el cliente general configurado en la base de datos.');
  }

  return Number(result.id_cliente);
}

async function listCustomers(client) {
  return orderModel.listActiveCustomers(client, GENERAL_CUSTOMER_EMAIL);
}

async function resolveCustomer(client, { id_cliente, customer } = {}) {
  if (id_cliente) {
    const customerResult = await orderModel.findActiveCustomerById(client, Number(id_cliente));

    if (!customerResult) {
      throw orderError(404, 'El cliente seleccionado no existe o está inactivo.');
    }

    return Number(customerResult.id_cliente);
  }

  if (!customer?.nombre?.trim()) {
    return getGeneralCustomerId(client);
  }

  const names = splitCustomerName(customer);
  const telefono = String(customer.telefono || '').trim() || null;
  const direccion = String(customer.direccion || customer.referencia || '').trim() || null;
  const providedEmail = String(customer.email || '').trim().toLowerCase() || null;

  if (providedEmail) {
    const byEmail = await orderModel.findCustomerByEmail(client, providedEmail);

    if (byEmail) {
      await orderModel.updateCustomerById(client, [
        names.nombre,
        names.apellido,
        telefono,
        direccion,
        Number(byEmail.id_cliente),
      ]);
      return Number(byEmail.id_cliente);
    }
  }

  if (telefono) {
    const byIdentity = await orderModel.findCustomerByIdentity(client, [
      names.nombre,
      names.apellido,
      telefono,
    ]);

    if (byIdentity) {
      return Number(byIdentity.id_cliente);
    }
  }

  const email = providedEmail || makeGuestEmail(customer);
  const inserted = await orderModel.createCustomer(client, [
    names.nombre,
    names.apellido,
    email,
    telefono,
    direccion,
  ]);

  return Number(inserted.id_cliente);
}

function normalizeOrderItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw orderError(400, 'El pedido debe incluir al menos un producto.');
  }

  return rawItems.map((item, index) => {
    const idProducto = Number(item.id_producto);
    const cantidad = Number(item.cantidad);

    if (!Number.isInteger(idProducto) || idProducto <= 0) {
      throw orderError(400, `El producto de la línea ${index + 1} es inválido.`);
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw orderError(400, `La cantidad de la línea ${index + 1} debe ser un entero mayor a cero.`);
    }

    const extras = Array.isArray(item.extras)
      ? item.extras.map((extra, extraIndex) => {
          const idExtra = Number(extra.id_extra);
          const extraQuantity = Number(extra.cantidad || 1);

          if (!Number.isInteger(idExtra) || idExtra <= 0) {
            throw orderError(400, `El extra ${extraIndex + 1} de la línea ${index + 1} es inválido.`);
          }

          if (!Number.isInteger(extraQuantity) || extraQuantity <= 0) {
            throw orderError(400, `La cantidad del extra ${extraIndex + 1} de la línea ${index + 1} debe ser un entero mayor a cero.`);
          }

          return {
            id_extra: idExtra,
            cantidad: extraQuantity,
          };
        })
      : [];

    const removals = Array.isArray(item.removals)
      ? item.removals.map((removal, removalIndex) => {
          const idInsumo = Number(removal.id_insumo);

          if (!Number.isInteger(idInsumo) || idInsumo <= 0) {
            throw orderError(400, `La modificación de quitar ${removalIndex + 1} de la línea ${index + 1} es inválida.`);
          }

          return {
            id_insumo: idInsumo,
          };
        })
      : [];

    return {
      id_producto: idProducto,
      cantidad,
      extras,
      removals,
    };
  });
}

function buildIngredientMap(ingredients = []) {
  const map = new Map();
  ingredients.forEach((ingredient) => {
    map.set(ingredient.id_insumo, cloneIngredient(ingredient));
  });
  return map;
}

function calculateOrderDraft(catalog, normalizedItems) {
  const stockConsumption = new Map();
  const items = [];
  let subtotal = 0;
  let extrasTotal = 0;

  normalizedItems.forEach((rawItem, index) => {
    const product = catalog.productById.get(rawItem.id_producto);
    if (!product || !product.disponible) {
      throw orderError(404, `El producto de la línea ${index + 1} no existe o no está disponible.`);
    }

    const ingredientMap = buildIngredientMap(product.ingredientes_base);
    const removableById = new Map(product.ingredientes_removibles.map((ingredient) => [ingredient.id_insumo, ingredient]));
    const availableExtraById = new Map(product.extras_disponibles.map((extra) => [extra.id_extra, extra]));

    const appliedRemovals = [];
    rawItem.removals.forEach((removal) => {
      if (product.es_combo) {
        throw orderError(400, `El combo "${product.nombre}" no permite quitar ingredientes de forma directa.`);
      }

      const ingredient = removableById.get(removal.id_insumo);
      if (!ingredient) {
        throw orderError(400, `La modificación solicitada no aplica a "${product.nombre}".`);
      }

      const baseIngredient = ingredientMap.get(removal.id_insumo);
      if (baseIngredient) {
        baseIngredient.cantidad = 0;
      }

      appliedRemovals.push({
        id_insumo: ingredient.id_insumo,
        nombre: ingredient.nombre,
        descripcion: `Sin ${ingredient.nombre}`,
      });
    });

    const appliedExtras = [];
    rawItem.extras.forEach((extraInput) => {
      const extra = availableExtraById.get(extraInput.id_extra);
      if (!extra) {
        throw orderError(400, `El extra solicitado no aplica a "${product.nombre}".`);
      }

      appliedExtras.push({
        id_extra: extra.id_extra,
        id_insumo: extra.id_insumo,
        nombre: extra.nombre,
        insumo: extra.insumo,
        precio: Number(extra.precio || 0),
        cantidad_insumo: Number(extra.cantidad_insumo || 0),
        stock_actual: Number(extra.stock_actual || 0),
        unidad_medida: extra.unidad_medida,
        cantidad: extraInput.cantidad,
        descripcion: extraInput.cantidad > 1 ? `${extra.nombre} x${extraInput.cantidad}` : extra.nombre,
      });
    });

    ingredientMap.forEach((ingredient) => {
      const totalIngredient = Number(ingredient.cantidad || 0) * rawItem.cantidad;
      if (totalIngredient <= 0) {
        return;
      }

      const current = stockConsumption.get(ingredient.id_insumo) || {
        id_insumo: ingredient.id_insumo,
        nombre: ingredient.nombre,
        unidad_medida: ingredient.unidad_medida,
        stock_actual: Number(ingredient.stock_actual || 0),
        cantidad: 0,
      };

      current.cantidad += totalIngredient;
      stockConsumption.set(ingredient.id_insumo, current);
    });

    appliedExtras.forEach((extra) => {
      const current = stockConsumption.get(extra.id_insumo) || {
        id_insumo: extra.id_insumo,
        nombre: extra.insumo,
        unidad_medida: extra.unidad_medida,
        stock_actual: Number(extra.stock_actual || 0),
        cantidad: 0,
      };

      current.cantidad += Number(extra.cantidad_insumo || 0) * extra.cantidad * rawItem.cantidad;
      stockConsumption.set(extra.id_insumo, current);
    });

    const lineSubtotal = roundMoney(product.precio * rawItem.cantidad);
    const lineExtrasTotal = roundMoney(
      appliedExtras.reduce((acc, extra) => acc + (extra.precio * extra.cantidad * rawItem.cantidad), 0)
    );
    const lineTotal = roundMoney(lineSubtotal + lineExtrasTotal);

    subtotal += lineSubtotal;
    extrasTotal += lineExtrasTotal;

    items.push({
      id_producto: product.id_producto,
      nombre: product.nombre,
      categoria: product.categoria,
      precio_unitario: product.precio,
      cantidad: rawItem.cantidad,
      subtotal_linea: lineSubtotal,
      total_linea: lineTotal,
      extras_total: lineExtrasTotal,
      es_combo: product.es_combo,
      extras: appliedExtras,
      removals: appliedRemovals,
    });
  });

  const shortages = Array.from(stockConsumption.values())
    .filter((ingredient) => Number(ingredient.stock_actual || 0) < Number(ingredient.cantidad || 0))
    .map((ingredient) => ({
      id_insumo: ingredient.id_insumo,
      nombre: ingredient.nombre,
      requerido: Number(ingredient.cantidad || 0),
      disponible: Number(ingredient.stock_actual || 0),
    }));

  if (shortages.length > 0) {
    const firstShortage = shortages[0];
    throw orderError(
      409,
      `No hay stock suficiente para "${firstShortage.nombre}". Requerido: ${firstShortage.requerido.toFixed(2)} / disponible: ${firstShortage.disponible.toFixed(2)}.`
    );
  }

  return {
    items,
    stockConsumption: Array.from(stockConsumption.values()),
    subtotal: roundMoney(subtotal),
    total: roundMoney(subtotal + extrasTotal),
    extras_total: roundMoney(extrasTotal),
  };
}

async function createOrder(client, payload, actor = null) {
  const channel = payload.canal === 'mostrador' ? 'mostrador' : 'online';
  const paymentMethod = payload.metodo_pago === 'tarjeta' ? 'tarjeta' : 'efectivo';
  const normalizedItems = normalizeOrderItems(payload.items);
  const catalog = await loadCatalog(client, { onlyAvailable: false });
  const customerId = await resolveCustomer(client, {
    id_cliente: payload.id_cliente,
    customer: payload.customer,
  });
  const draft = calculateOrderDraft(catalog, normalizedItems);

  const initialStatus = channel === 'mostrador' ? 'aprobado' : 'pendiente';
  const paymentStatus = channel === 'mostrador' ? 'pagado' : 'pendiente';

  const order = await orderModel.createOrder(client, [
    customerId,
    channel === 'mostrador' ? actor?.id || null : null,
    channel,
    initialStatus,
    draft.subtotal.toFixed(2),
    draft.total.toFixed(2),
    String(payload.notas || payload.customer?.referencia || '').trim() || null,
    channel === 'mostrador' ? new Date() : null,
  ]);

  for (const item of draft.items) {
    const itemResult = await orderModel.createOrderItem(client, [
      Number(order.id_pedido),
      item.id_producto,
      item.cantidad,
      item.precio_unitario.toFixed(2),
      item.subtotal_linea.toFixed(2),
    ]);

    const pedidoItemId = Number(itemResult.id_pedido_item);

    for (const extra of item.extras) {
      await orderModel.createOrderItemModification(client, [
        pedidoItemId,
        extra.id_extra,
        'agregar',
        extra.descripcion,
        roundMoney(extra.precio * extra.cantidad * item.cantidad).toFixed(2),
      ]);
    }

    for (const removal of item.removals) {
      await orderModel.createOrderItemModification(client, [
        pedidoItemId,
        null,
        'quitar',
        removal.descripcion,
        0,
      ]);
    }
  }

  await orderModel.createPayment(client, [
    Number(order.id_pedido),
    paymentMethod,
    paymentStatus,
    draft.total.toFixed(2),
    paymentStatus === 'pagado' ? new Date() : null,
  ]);

  for (const ingredient of draft.stockConsumption) {
    await orderModel.decrementStock(client, ingredient.cantidad, ingredient.id_insumo);
    await orderModel.createInventoryMovement(client, [
      ingredient.id_insumo,
      actor?.id || null,
      Number(order.id_pedido),
      null,
      'salida',
      ingredient.cantidad,
      `Consumo por pedido #${order.id_pedido}`,
    ]);
  }

  return getOrderDetail(client, Number(order.id_pedido));
}

async function getOrderCore(client, idPedido) {
  const order = await orderModel.findOrderCore(client, idPedido);

  if (!order) {
    throw orderError(404, 'Pedido no encontrado.');
  }

  return order;
}

async function getOrderDetail(client, idPedido) {
  const order = await getOrderCore(client, idPedido);
  const itemsRows = await orderModel.listOrderItems(client, idPedido);
  const modificationsRows = await orderModel.listOrderModifications(client, idPedido);

  const modificationsByItem = new Map();
  modificationsRows.forEach((row) => {
    const list = modificationsByItem.get(Number(row.id_pedido_item)) || [];
    list.push({
      id_extra: row.id_extra ? Number(row.id_extra) : null,
      tipo: row.tipo,
      descripcion: row.descripcion,
      precio_extra: Number(row.precio_extra || 0),
    });
    modificationsByItem.set(Number(row.id_pedido_item), list);
  });

  const items = itemsRows.map((row) => {
    const modifications = modificationsByItem.get(Number(row.id_pedido_item)) || [];
    const extrasTotal = modifications.reduce((acc, modification) => acc + Number(modification.precio_extra || 0), 0);

    return {
      id_pedido_item: Number(row.id_pedido_item),
      id_producto: Number(row.id_producto),
      producto: row.producto,
      cantidad: Number(row.cantidad || 0),
      precio_unitario: Number(row.precio_unitario || 0),
      subtotal_linea: Number(row.subtotal_linea || 0),
      total_linea: roundMoney(Number(row.subtotal_linea || 0) + extrasTotal),
      modificaciones: modifications,
    };
  });

  return {
    id_pedido: Number(order.id_pedido),
    codigo: formatOrderCode(order.id_pedido),
    canal: order.canal,
    estado: order.estado,
    subtotal: Number(order.subtotal || 0),
    total: Number(order.total || 0),
    notas: order.notas,
    fecha_creacion: order.fecha_creacion,
    fecha_aprobado: order.fecha_aprobado,
    fecha_finalizado: order.fecha_finalizado,
    fecha_entregado: order.fecha_entregado,
    cliente: {
      id_cliente: Number(order.id_cliente),
      nombre: `${order.cliente_nombre} ${order.cliente_apellido}`.trim(),
      email: order.cliente_email,
      telefono: order.cliente_telefono,
    },
    pago: {
      metodo: order.metodo_pago,
      estado: order.estado_pago,
      monto: Number(order.monto_pago || 0),
    },
    cajero: order.cajero_nombre ? `${order.cajero_nombre} ${order.cajero_apellido}`.trim() : null,
    cocinero: order.cocinero_nombre ? `${order.cocinero_nombre} ${order.cocinero_apellido}`.trim() : null,
    items,
  };
}

async function getOrderByCode(client, rawCode) {
  const idPedido = parseOrderCode(rawCode);
  if (!idPedido) {
    throw orderError(400, 'El código del pedido es inválido.');
  }

  return getOrderDetail(client, idPedido);
}

async function listOrders(client, { limit = 80 } = {}) {
  const safeLimit = Math.max(1, Math.min(200, Number(limit) || 80));
  const rows = await orderModel.listOrders(client, safeLimit);

  return rows.map((row) => ({
    id_pedido: Number(row.id_pedido),
    codigo: formatOrderCode(row.id_pedido),
    fecha_creacion: row.fecha_creacion,
    canal: row.canal,
    estado_pedido: row.estado_pedido,
    notas: row.notas,
    id_cliente: Number(row.id_cliente),
    cliente: row.cliente,
    email_cliente: row.email_cliente,
    cajero: row.cajero,
    cocinero: row.cocinero,
    subtotal: Number(row.subtotal || 0),
    total: Number(row.total || 0),
    metodo_pago: row.metodo_pago,
    estado_pago: row.estado_pago,
    total_items: Number(row.total_items || 0),
    allowed_transitions: getAllowedTransitions(row.estado_pedido),
  }));
}

async function rebuildOrderConsumption(client, idPedido) {
  const catalog = await loadCatalog(client, { onlyAvailable: false });
  const itemsRows = await orderModel.listOrderConsumptionItems(client, idPedido);
  const modificationsRows = await orderModel.listOrderConsumptionModifications(client, idPedido);

  const modificationsByItem = new Map();
  modificationsRows.forEach((row) => {
    const list = modificationsByItem.get(Number(row.id_pedido_item)) || [];
    list.push({
      id_extra: row.id_extra ? Number(row.id_extra) : null,
      tipo: row.tipo,
      descripcion: row.descripcion,
      precio_extra: Number(row.precio_extra || 0),
    });
    modificationsByItem.set(Number(row.id_pedido_item), list);
  });

  const consumption = new Map();

  itemsRows.forEach((row) => {
    const product = catalog.productById.get(Number(row.id_producto));
    if (!product) {
      return;
    }

    const quantity = Number(row.cantidad || 0);
    const ingredientMap = buildIngredientMap(product.ingredientes_base);
    const removalNames = new Set();

    (modificationsByItem.get(Number(row.id_pedido_item)) || []).forEach((modification) => {
      if (modification.tipo === 'quitar') {
        const match = String(modification.descripcion || '').match(/^Sin\s+(.+)$/i);
        if (match?.[1]) {
          removalNames.add(canonicalIngredientName(match[1]));
        }
      }
    });

    ingredientMap.forEach((ingredient) => {
      if (removalNames.has(canonicalIngredientName(ingredient.nombre))) {
        ingredient.cantidad = 0;
      }

      const totalIngredient = Number(ingredient.cantidad || 0) * quantity;
      if (totalIngredient <= 0) {
        return;
      }

      const current = consumption.get(ingredient.id_insumo) || {
        id_insumo: ingredient.id_insumo,
        nombre: ingredient.nombre,
        cantidad: 0,
      };

      current.cantidad += totalIngredient;
      consumption.set(ingredient.id_insumo, current);
    });

    (modificationsByItem.get(Number(row.id_pedido_item)) || []).forEach((modification) => {
      if (modification.tipo !== 'agregar' || !modification.id_extra) {
        return;
      }

      const extra = catalog.extrasById.get(modification.id_extra);
      if (!extra) {
        return;
      }

      const unitsPerItem = Math.max(
        1,
        Math.round(Number(modification.precio_extra || 0) / (Number(extra.precio || 1) * quantity))
      );

      const current = consumption.get(extra.id_insumo) || {
        id_insumo: extra.id_insumo,
        nombre: extra.insumo,
        cantidad: 0,
      };

      current.cantidad += Number(extra.cantidad_insumo || 0) * unitsPerItem * quantity;
      consumption.set(extra.id_insumo, current);
    });
  });

  return Array.from(consumption.values());
}

function getAllowedTransitions(currentStatus) {
  const transitions = {
    pendiente: ['aprobado', 'cancelado'],
    aprobado: ['en_proceso', 'cancelado'],
    en_proceso: ['finalizado'],
    finalizado: ['entregado'],
    entregado: [],
    cancelado: [],
  };

  return transitions[currentStatus] || [];
}

async function updateOrderStatus(client, idPedido, nextStatus, actor = null) {
  const normalizedStatus = String(nextStatus || '').trim();
  const order = await getOrderCore(client, idPedido);
  const allowedTransitions = getAllowedTransitions(order.estado);

  if (!allowedTransitions.includes(normalizedStatus)) {
    throw orderError(409, `No se puede cambiar el pedido de "${order.estado}" a "${normalizedStatus}".`);
  }

  if (normalizedStatus === 'cancelado') {
    let consumption = (await orderModel.listOrderInventoryOutputs(client, idPedido)).map((row) => ({
      id_insumo: Number(row.id_insumo),
      cantidad: Number(row.cantidad || 0),
    }));

    // Compatibilidad con pedidos históricos que no tengan salidas registradas por insumo.
    if (consumption.length === 0) {
      consumption = await rebuildOrderConsumption(client, idPedido);
    }

    for (const ingredient of consumption) {
      await orderModel.incrementStock(client, ingredient.cantidad, ingredient.id_insumo);
      await orderModel.createInventoryMovement(client, [
        ingredient.id_insumo,
        actor?.id || null,
        idPedido,
        null,
        'ajuste',
        ingredient.cantidad,
        `Restitución por cancelación del pedido #${idPedido}`,
      ]);
    }

    if (order.estado_pago === 'pagado') {
      await orderModel.updatePaymentStatus(client, 'reembolsado', null, idPedido);
    }
  }

  const fields = ['estado = $1'];
  const values = [normalizedStatus];
  let paramIndex = values.length + 1;

  if (normalizedStatus === 'aprobado') {
    fields.push(`fecha_aprobado = COALESCE(fecha_aprobado, NOW())`);
    if (actor?.id) {
      fields.push(`id_cajero = COALESCE(id_cajero, $${paramIndex})`);
      values.push(actor.id);
      paramIndex += 1;
    }
  }

  if (normalizedStatus === 'en_proceso' && actor?.id) {
    fields.push(`id_cocinero = COALESCE(id_cocinero, $${paramIndex})`);
    values.push(actor.id);
    paramIndex += 1;
  }

  if (normalizedStatus === 'finalizado') {
    fields.push(`fecha_finalizado = COALESCE(fecha_finalizado, NOW())`);
    if (actor?.id) {
      fields.push(`id_cocinero = COALESCE(id_cocinero, $${paramIndex})`);
      values.push(actor.id);
      paramIndex += 1;
    }
  }

  if (normalizedStatus === 'entregado') {
    fields.push(`fecha_entregado = COALESCE(fecha_entregado, NOW())`);
    if (order.estado_pago === 'pendiente') {
      await orderModel.updatePaymentStatus(client, 'pagado', new Date(), idPedido);
    }
  }

  await orderModel.updateOrderFields(client, idPedido, fields, values);

  return getOrderDetail(client, idPedido);
}

module.exports = {
  loadCatalog,
  createOrder,
  getOrderByCode,
  getOrderDetail,
  listOrders,
  listCustomers,
  updateOrderStatus,
  formatOrderCode,
  parseOrderCode,
  orderError,
};
