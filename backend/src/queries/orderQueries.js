function listCatalogProducts(onlyAvailable) {
  return `
    SELECT
      p.id_producto,
      p.nombre,
      p.descripcion,
      p.precio,
      p.es_combo,
      p.disponible,
      cat.nombre AS categoria
    FROM producto p
    JOIN categoria_producto cat ON cat.id_categoria_producto = p.id_categoria_producto
    ${onlyAvailable ? 'WHERE p.disponible = TRUE' : ''}
    ORDER BY cat.nombre, p.nombre
  `;
}

module.exports = {
  listCatalogProducts,
  listRecipes: `
    SELECT
      r.id_producto,
      r.id_insumo,
      r.cantidad,
      i.nombre,
      i.unidad_medida,
      i.stock_actual
    FROM receta r
    JOIN insumo i ON i.id_insumo = r.id_insumo
  `,
  listComboItems: `
    SELECT
      ci.id_producto_combo,
      ci.id_producto_componente,
      ci.cantidad,
      p.nombre AS componente
    FROM combo_item ci
    JOIN producto p ON p.id_producto = ci.id_producto_componente
  `,
  listActiveExtras: `
    SELECT
      e.id_extra,
      e.id_insumo,
      e.nombre,
      e.precio,
      e.cantidad_insumo,
      i.nombre AS insumo,
      i.stock_actual,
      i.unidad_medida
    FROM extra e
    JOIN insumo i ON i.id_insumo = e.id_insumo
    WHERE e.activo = TRUE
      AND i.activo = TRUE
    ORDER BY e.nombre
  `,
  findGeneralCustomerId: `
    SELECT id_cliente
    FROM cliente
    WHERE email = $1
    LIMIT 1
  `,
  findActiveCustomerById: `
    SELECT id_cliente
    FROM cliente
    WHERE id_cliente = $1
      AND activo = TRUE
  `,
  listActiveCustomers: `
    SELECT
      id_cliente,
      nombre || ' ' || apellido AS cliente,
      email,
      telefono,
      direccion
    FROM cliente
    WHERE activo = TRUE
      AND email <> $1
    ORDER BY nombre, apellido
  `,
  findCustomerByEmail: `
    SELECT id_cliente
    FROM cliente
    WHERE email = $1
    LIMIT 1
  `,
  updateCustomerById: `
    UPDATE cliente
    SET nombre = $1,
        apellido = $2,
        telefono = COALESCE($3, telefono),
        direccion = COALESCE($4, direccion),
        activo = TRUE
    WHERE id_cliente = $5
  `,
  findCustomerByIdentity: `
    SELECT id_cliente
    FROM cliente
    WHERE lower(nombre) = lower($1)
      AND lower(apellido) = lower($2)
      AND telefono = $3
    LIMIT 1
  `,
  insertCustomer: `
    INSERT INTO cliente (nombre, apellido, email, telefono, direccion, activo)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    RETURNING id_cliente
  `,
  insertOrder: `
    INSERT INTO pedido
      (id_cliente, id_cajero, canal, estado, subtotal, total, notas, fecha_aprobado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id_pedido, fecha_creacion, estado, subtotal, total, notas, canal
  `,
  insertOrderItem: `
    INSERT INTO pedido_item
      (id_pedido, id_producto, cantidad, precio_unitario, subtotal_linea)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_pedido_item
  `,
  insertOrderItemModification: `
    INSERT INTO pedido_item_modificacion
      (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
    VALUES ($1, $2, $3, $4, $5)
  `,
  insertPayment: `
    INSERT INTO pago
      (id_pedido, metodo, estado, monto, fecha_confirmacion)
    VALUES ($1, $2, $3, $4, $5)
  `,
  decrementStock: `
    UPDATE insumo
    SET stock_actual = stock_actual - $1
    WHERE id_insumo = $2
  `,
  incrementStock: `
    UPDATE insumo
    SET stock_actual = stock_actual + $1
    WHERE id_insumo = $2
  `,
  insertInventoryMovement: `
    INSERT INTO movimiento_inventario
      (id_insumo, id_empleado, id_pedido, id_compra_insumo, tipo, cantidad, motivo, fecha)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  `,
  findOrderCore: `
    SELECT
      p.id_pedido,
      p.canal,
      p.estado,
      p.subtotal,
      p.total,
      p.notas,
      p.fecha_creacion,
      p.fecha_aprobado,
      p.fecha_finalizado,
      p.fecha_entregado,
      c.id_cliente,
      c.nombre AS cliente_nombre,
      c.apellido AS cliente_apellido,
      c.email AS cliente_email,
      c.telefono AS cliente_telefono,
      pg.metodo AS metodo_pago,
      pg.estado AS estado_pago,
      pg.monto AS monto_pago,
      e.nombre AS cajero_nombre,
      e.apellido AS cajero_apellido,
      co.nombre AS cocinero_nombre,
      co.apellido AS cocinero_apellido
    FROM pedido p
    JOIN cliente c ON c.id_cliente = p.id_cliente
    LEFT JOIN pago pg ON pg.id_pedido = p.id_pedido
    LEFT JOIN empleado e ON e.id_empleado = p.id_cajero
    LEFT JOIN empleado co ON co.id_empleado = p.id_cocinero
    WHERE p.id_pedido = $1
  `,
  listOrderItems: `
    SELECT
      pi.id_pedido_item,
      pi.id_producto,
      pr.nombre AS producto,
      pi.cantidad,
      pi.precio_unitario,
      pi.subtotal_linea
    FROM pedido_item pi
    JOIN producto pr ON pr.id_producto = pi.id_producto
    WHERE pi.id_pedido = $1
    ORDER BY pi.id_pedido_item
  `,
  listOrderModifications: `
    SELECT
      pim.id_pedido_item,
      pim.id_extra,
      pim.tipo,
      pim.descripcion,
      pim.precio_extra,
      ex.nombre AS extra_nombre
    FROM pedido_item_modificacion pim
    LEFT JOIN extra ex ON ex.id_extra = pim.id_extra
    JOIN pedido_item pi ON pi.id_pedido_item = pim.id_pedido_item
    WHERE pi.id_pedido = $1
    ORDER BY pim.id_pedido_item_modificacion
  `,
  listOrders: `
    SELECT
      vrp.id_pedido,
      vrp.fecha_creacion,
      vrp.canal,
      vrp.estado_pedido,
      vrp.notas,
      vrp.id_cliente,
      vrp.cliente,
      vrp.email_cliente,
      vrp.cajero,
      vrp.cocinero,
      vrp.subtotal,
      vrp.total,
      vrp.metodo_pago,
      vrp.estado_pago,
      COALESCE(items.total_items, 0) AS total_items
    FROM v_resumen_pedidos vrp
    LEFT JOIN (
      SELECT id_pedido, SUM(cantidad) AS total_items
      FROM pedido_item
      GROUP BY id_pedido
    ) items ON items.id_pedido = vrp.id_pedido
    ORDER BY vrp.fecha_creacion DESC
    LIMIT $1
  `,
  listOrderConsumptionItems: `
    SELECT
      pi.id_pedido_item,
      pi.id_producto,
      pi.cantidad
    FROM pedido_item pi
    WHERE pi.id_pedido = $1
  `,
  listOrderConsumptionModifications: `
    SELECT
      pim.id_pedido_item,
      pim.id_extra,
      pim.tipo,
      pim.descripcion,
      pim.precio_extra
    FROM pedido_item_modificacion pim
    JOIN pedido_item pi ON pi.id_pedido_item = pim.id_pedido_item
    WHERE pi.id_pedido = $1
  `,
  listOrderInventoryOutputs: `
    SELECT
      id_insumo,
      SUM(cantidad) AS cantidad
    FROM movimiento_inventario
    WHERE id_pedido = $1
      AND tipo = 'salida'
    GROUP BY id_insumo
    ORDER BY id_insumo
  `,
  updatePaymentStatus: `
    UPDATE pago
    SET estado = $1,
        fecha_confirmacion = $2
    WHERE id_pedido = $3
  `,
};
