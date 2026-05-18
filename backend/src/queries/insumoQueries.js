module.exports = {
  listSuppliers: `
    SELECT id_proveedor, nombre
    FROM proveedor
    WHERE activo = TRUE
    ORDER BY nombre
  `,
  listInsumos: `
    SELECT
      i.id_insumo,
      i.nombre,
      i.unidad_medida,
      i.stock_actual,
      i.stock_minimo,
      i.costo_unitario,
      i.activo,
      p.nombre AS proveedor
    FROM insumo i
    JOIN proveedor p ON p.id_proveedor = i.id_proveedor
    ORDER BY i.nombre
  `,
  findInsumoById: `
    SELECT *
    FROM insumo
    WHERE id_insumo = $1
  `,
  insertInsumo: `
    INSERT INTO insumo (id_proveedor, nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,
  updateInsumo: `
    UPDATE insumo
    SET id_proveedor = $1,
        nombre = $2,
        unidad_medida = $3,
        stock_actual = $4,
        stock_minimo = $5,
        costo_unitario = $6
    WHERE id_insumo = $7
    RETURNING *
  `,
  deleteInsumo: `
    DELETE FROM insumo
    WHERE id_insumo = $1
  `,
};
