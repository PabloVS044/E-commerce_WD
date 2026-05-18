module.exports = {
  findActiveProviderById: `
    SELECT id_proveedor, nombre
    FROM proveedor
    WHERE id_proveedor = $1
      AND activo = TRUE
  `,
  findActiveEmployeeById: `
    SELECT id_empleado
    FROM empleado
    WHERE id_empleado = $1
      AND activo = TRUE
  `,
  findActiveInsumosByIds: `
    SELECT id_insumo, id_proveedor, nombre
    FROM insumo
    WHERE id_insumo = ANY($1::int[])
      AND activo = TRUE
  `,
  insertCompraInsumo: `
    INSERT INTO compra_insumo (id_proveedor, id_empleado, fecha, total, observaciones)
    VALUES ($1, $2, NOW(), $3, $4)
    RETURNING id_compra_insumo, fecha, total, observaciones
  `,
  insertCompraInsumoDetalle: `
    INSERT INTO compra_insumo_detalle (id_compra_insumo, id_insumo, cantidad, costo_unitario)
    VALUES ($1, $2, $3, $4)
  `,
  increaseInsumoStock: `
    UPDATE insumo
    SET stock_actual = stock_actual + $1
    WHERE id_insumo = $2
  `,
  insertInventoryEntry: `
    INSERT INTO movimiento_inventario
      (id_insumo, id_empleado, id_compra_insumo, tipo, cantidad, motivo, fecha)
    VALUES ($1, $2, $3, 'entrada', $4, $5, NOW())
  `,
};
