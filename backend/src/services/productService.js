const productModel = require('../models/productModel');
const { AppError } = require('../utils/appError');
const { withTransaction } = require('../utils/transaction');
const { uploadProductImage, safeDeleteProductImage } = require('./productImageService');

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isComboCategory(categoryName) {
  return /\bcombo/.test(normalizeText(categoryName));
}

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

function assertUnique(items, key, message) {
  const values = items.map((item) => item[key]);
  if (new Set(values).size !== values.length) throw new AppError(400, message);
}

function parseRecipeItems(lines = []) {
  if (!Array.isArray(lines)) throw new AppError(400, 'La receta debe enviarse como una lista.');

  const recipe = lines
    .map((line, index) => {
      const hasAnyValue = line && (line.id_insumo !== undefined || line.cantidad !== undefined);
      if (!hasAnyValue) return null;

      const idInsumo = Number(line.id_insumo);
      const cantidad = Number.parseFloat(line.cantidad);

      if (!Number.isInteger(idInsumo) || idInsumo <= 0 || !Number.isFinite(cantidad) || cantidad <= 0) {
        throw new AppError(400, `La línea ${index + 1} de la receta es inválida.`);
      }

      return { id_insumo: idInsumo, cantidad };
    })
    .filter(Boolean);

  assertUnique(recipe, 'id_insumo', 'No puedes repetir el mismo insumo dentro de la receta.');
  return recipe;
}

function parseComboItems(lines = []) {
  if (!Array.isArray(lines)) throw new AppError(400, 'Los componentes del combo deben enviarse como una lista.');

  const components = lines
    .map((line, index) => {
      const productValue = line?.id_producto ?? line?.id_producto_componente;
      const hasAnyValue = productValue !== undefined || line?.cantidad !== undefined;
      if (!hasAnyValue) return null;

      const idProducto = Number(productValue);
      const cantidad = Number.parseInt(line.cantidad, 10);

      if (!Number.isInteger(idProducto) || idProducto <= 0 || !Number.isInteger(cantidad) || cantidad <= 0) {
        throw new AppError(400, `La línea ${index + 1} de componentes del combo es inválida.`);
      }

      return { id_producto: idProducto, cantidad };
    })
    .filter(Boolean);

  assertUnique(components, 'id_producto', 'No puedes repetir el mismo producto dentro del combo.');
  return components;
}

function parseProductPayload(payload = {}) {
  const idCategoria = Number(payload.id_categoria_producto);
  const nombre = String(payload.nombre || '').trim();
  const descripcion = String(payload.descripcion || '').trim() || null;
  const precio = Number.parseFloat(payload.precio);
  const disponible = parseBoolean(payload.disponible, true);
  const esCombo = parseBoolean(payload.es_combo, false);
  const receta = parseRecipeItems(payload.receta || []);
  const componentesCombo = parseComboItems(payload.componentes_combo || payload.componentesCombo || []);

  // imagen: string (data URL) → subir nueva imagen
  //         null/'' → borrar imagen actual
  //         undefined (campo ausente) → no tocar imagen
  const imagen = Object.prototype.hasOwnProperty.call(payload, 'imagen')
    ? (payload.imagen || null)
    : undefined;

  if (!Number.isInteger(idCategoria) || idCategoria <= 0 || !nombre || !Number.isFinite(precio) || precio < 0) {
    throw new AppError(400, 'Categoría, nombre y precio válidos son obligatorios.');
  }

  return {
    id_categoria_producto: idCategoria,
    nombre,
    descripcion,
    precio,
    disponible,
    es_combo: esCombo,
    receta,
    componentes_combo: componentesCombo,
    imagen,
  };
}

async function hydrateProduct(product, executor) {
  if (!product) return null;

  const [receta, componentesCombo] = await Promise.all([
    productModel.listProductRecipe(product.id_producto, executor),
    productModel.listProductComboItems(product.id_producto, executor),
  ]);

  return {
    ...product,
    receta: receta.map((item) => ({
      id_insumo: Number(item.id_insumo),
      nombre: item.nombre,
      unidad_medida: item.unidad_medida,
      cantidad: Number(item.cantidad),
    })),
    componentes_combo: componentesCombo.map((item) => ({
      id_producto: Number(item.id_producto),
      nombre: item.nombre,
      categoria: item.categoria,
      es_combo: item.es_combo,
      cantidad: Number(item.cantidad),
    })),
  };
}

async function validateCategoryConsistency(payload, executor) {
  const category = await productModel.findCategoryById(payload.id_categoria_producto, executor);
  if (!category) throw new AppError(400, 'La categoría seleccionada no existe.');

  const categoryIsCombo = isComboCategory(category.nombre);
  if (payload.es_combo && !categoryIsCombo) throw new AppError(400, 'Los productos tipo combo deben registrarse en la categoría Combos.');
  if (!payload.es_combo && categoryIsCombo) throw new AppError(400, 'La categoría Combos solo admite productos marcados como combo.');
}

function validateDefinitionShape(payload) {
  if (payload.es_combo) {
    if (payload.receta.length > 0) throw new AppError(400, 'Los combos no deben registrar receta directa de insumos.');
    if (payload.componentes_combo.length === 0) throw new AppError(400, 'Debes agregar al menos un producto al combo.');
    return;
  }
  if (payload.componentes_combo.length > 0) throw new AppError(400, 'Los productos individuales no deben registrar componentes de combo.');
  if (payload.receta.length === 0) throw new AppError(400, 'Debes agregar al menos un insumo a la receta del producto.');
}

function ensureNoSelfReference(idProducto, components) {
  if (components.some((c) => c.id_producto === idProducto)) {
    throw new AppError(400, 'Un combo no puede contenerse a sí mismo como componente.');
  }
}

function hasCycleFrom(graph, startNode) {
  const visited = new Set();
  const active = new Set();

  function visit(node) {
    if (active.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    active.add(node);

    for (const neighbor of (graph.get(node) || [])) {
      if (visit(neighbor)) return true;
    }

    active.delete(node);
    return false;
  }

  return visit(startNode);
}

async function validateNoComboCycles(idProducto, executor) {
  const rows = await productModel.listAllComboItems(executor);
  const graph = rows.reduce((acc, row) => {
    const comboId = Number(row.id_producto_combo);
    const componentId = Number(row.id_producto_componente);
    acc.set(comboId, [...(acc.get(comboId) || []), componentId]);
    return acc;
  }, new Map());

  if (hasCycleFrom(graph, idProducto)) {
    throw new AppError(400, 'La composición del combo genera una referencia circular.');
  }
}

async function syncProductDefinition(idProducto, payload, executor) {
  await productModel.clearProductRecipe(idProducto, executor);
  await productModel.clearProductComboItems(idProducto, executor);

  if (payload.es_combo) {
    ensureNoSelfReference(idProducto, payload.componentes_combo);
    for (const c of payload.componentes_combo) {
      await productModel.addProductComboItem(idProducto, c.id_producto, c.cantidad, executor);
    }
    await validateNoComboCycles(idProducto, executor);
    return;
  }

  for (const ing of payload.receta) {
    await productModel.addRecipeItem(idProducto, ing.id_insumo, ing.cantidad, executor);
  }
}

/**
 * Maneja el upload/delete de imagen FUERA de la transacción principal de BD.
 *   imagen === undefined  → no se tocó el campo, no hacer nada
 *   imagen === null/''    → borrar imagen actual de Cloudinary y limpiar columnas
 *   imagen === 'data:...' → borrar imagen anterior y subir la nueva
 */
async function handleImageUpdate(idProducto, nextImagen, currentPublicId, productName) {
  if (nextImagen === undefined) return;

  if (!nextImagen) {
    await safeDeleteProductImage(currentPublicId);
    await productModel.clearProductImage(idProducto);
    return;
  }

  await safeDeleteProductImage(currentPublicId);
  const uploaded = await uploadProductImage(nextImagen, { productName });
  if (uploaded) {
    await productModel.updateProductImage(idProducto, uploaded.imagen_url, uploaded.imagen_public_id);
  }
}

// ─── Servicios públicos ────────────────────────────────────────────────────

async function listCategories() {
  return productModel.listCategories();
}

async function listProducts() {
  return productModel.listProducts();
}

async function getProduct(idProducto) {
  const product = await productModel.findProductById(Number(idProducto));
  if (!product) throw new AppError(404, 'Producto no encontrado.');
  return hydrateProduct(product);
}

async function createProduct(payload) {
  const normalized = parseProductPayload(payload);
  validateDefinitionShape(normalized);

  let created;

  try {
    created = await withTransaction(async (client) => {
      await validateCategoryConsistency(normalized, client);

      const row = await productModel.createProduct([
        normalized.id_categoria_producto,
        normalized.nombre,
        normalized.descripcion,
        normalized.precio,
        normalized.es_combo,
        normalized.disponible,
      ], client);

      await syncProductDefinition(row.id_producto, normalized, client);
      const product = await productModel.findProductById(row.id_producto, client);
      return hydrateProduct(product, client);
    });
  } catch (error) {
    if (error.code === '23505') throw new AppError(409, 'Ya existe un producto con ese nombre.');
    if (error.code === '23503') {
      throw new AppError(400, normalized.es_combo
        ? 'Alguno de los productos seleccionados para el combo no existe.'
        : 'Alguno de los insumos seleccionados para la receta no existe.');
    }
    throw error;
  }

  // Imagen fuera de la transacción para no bloquear si Cloudinary tarda
  if (normalized.imagen) {
    await handleImageUpdate(created.id_producto, normalized.imagen, null, normalized.nombre);
    const refreshed = await productModel.findProductById(created.id_producto);
    return hydrateProduct(refreshed);
  }

  return created;
}

async function updateProduct(idProducto, payload) {
  const normalized = parseProductPayload(payload);
  const numericId = Number(idProducto);
  validateDefinitionShape(normalized);

  let updated;

  try {
    updated = await withTransaction(async (client) => {
      await validateCategoryConsistency(normalized, client);

      const row = await productModel.updateProduct(numericId, [
        normalized.id_categoria_producto,
        normalized.nombre,
        normalized.descripcion,
        normalized.precio,
        normalized.es_combo,
        normalized.disponible,
      ], client);

      if (!row) throw new AppError(404, 'Producto no encontrado.');

      await syncProductDefinition(numericId, normalized, client);
      const product = await productModel.findProductById(numericId, client);
      return hydrateProduct(product, client);
    });
  } catch (error) {
    if (error.code === '23505') throw new AppError(409, 'Ya existe un producto con ese nombre.');
    if (error.code === '23503') {
      throw new AppError(400, normalized.es_combo
        ? 'Alguno de los productos seleccionados para el combo no existe o está en uso de forma incompatible.'
        : 'Alguno de los insumos seleccionados para la receta no existe.');
    }
    throw error;
  }

  // Imagen fuera de la transacción
  if (normalized.imagen !== undefined) {
    await handleImageUpdate(numericId, normalized.imagen, updated.imagen_public_id || null, normalized.nombre);
    const refreshed = await productModel.findProductById(numericId);
    return hydrateProduct(refreshed);
  }

  return updated;
}

async function deleteProductImage(idProducto) {
  const product = await productModel.findProductById(Number(idProducto));
  if (!product) throw new AppError(404, 'Producto no encontrado.');
  await safeDeleteProductImage(product.imagen_public_id);
  return productModel.clearProductImage(Number(idProducto));
}

async function deleteProduct(idProducto) {
  const product = await productModel.findProductById(Number(idProducto));
  if (product?.imagen_public_id) {
    await safeDeleteProductImage(product.imagen_public_id);
  }

  try {
    const deletedRows = await productModel.deleteProduct(Number(idProducto));
    if (deletedRows === 0) throw new AppError(404, 'Producto no encontrado.');
  } catch (error) {
    if (error.code === '23503') {
      throw new AppError(409, 'No se puede eliminar: el producto tiene pedidos, recetas o combos relacionados.');
    }
    throw error;
  }
}

module.exports = {
  listCategories,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProductImage,
  deleteProduct,
};
