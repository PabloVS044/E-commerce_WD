module.exports = {
  listCategories: `
    SELECT id_categoria_producto, nombre
    FROM categoria_producto
    ORDER BY nombre
  `,
  findCategoryById: `
    SELECT id_categoria_producto, nombre
    FROM categoria_producto
    WHERE id_categoria_producto = $1
  `,
  listProducts: `
    SELECT
      p.id_producto,
      p.id_categoria_producto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.disponible,
      p.es_combo,
      cat.nombre AS categoria
    FROM producto p
    JOIN categoria_producto cat ON cat.id_categoria_producto = p.id_categoria_producto
    ORDER BY cat.nombre, p.nombre
  `,
  findProductById: `
    SELECT
      p.id_producto,
      p.id_categoria_producto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.disponible,
      p.es_combo,
      cat.nombre AS categoria
    FROM producto p
    JOIN categoria_producto cat ON cat.id_categoria_producto = p.id_categoria_producto
    WHERE p.id_producto = $1
  `,
  listProductRecipe: `
    SELECT
      r.id_insumo,
      i.nombre,
      i.unidad_medida,
      r.cantidad
    FROM receta r
    JOIN insumo i ON i.id_insumo = r.id_insumo
    WHERE r.id_producto = $1
    ORDER BY i.nombre
  `,
  listProductComboItems: `
    SELECT
      ci.id_producto_componente AS id_producto,
      p.nombre,
      p.es_combo,
      cat.nombre AS categoria,
      ci.cantidad
    FROM combo_item ci
    JOIN producto p ON p.id_producto = ci.id_producto_componente
    JOIN categoria_producto cat ON cat.id_categoria_producto = p.id_categoria_producto
    WHERE ci.id_producto_combo = $1
    ORDER BY p.nombre
  `,
  listAllComboItems: `
    SELECT id_producto_combo, id_producto_componente
    FROM combo_item
  `,
  insertProduct: `
    INSERT INTO producto (id_categoria_producto, nombre, descripcion, precio, es_combo, disponible)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id_producto,
      id_categoria_producto,
      nombre,
      descripcion,
      precio,
      disponible,
      es_combo
  `,
  updateProduct: `
    UPDATE producto
    SET id_categoria_producto = $1,
        nombre = $2,
        descripcion = $3,
        precio = $4,
        es_combo = $5,
        disponible = $6
    WHERE id_producto = $7
    RETURNING
      id_producto,
      id_categoria_producto,
      nombre,
      descripcion,
      precio,
      disponible,
      es_combo
  `,
  deleteProductRecipe: `
    DELETE FROM receta
    WHERE id_producto = $1
  `,
  insertRecipeItem: `
    INSERT INTO receta (id_producto, id_insumo, cantidad)
    VALUES ($1, $2, $3)
  `,
  deleteProductComboItems: `
    DELETE FROM combo_item
    WHERE id_producto_combo = $1
  `,
  insertComboItem: `
    INSERT INTO combo_item (id_producto_combo, id_producto_componente, cantidad)
    VALUES ($1, $2, $3)
  `,
  deleteProduct: `
    DELETE FROM producto
    WHERE id_producto = $1
  `,
};
