module.exports = {
  joinPedidosResumen: `
    SELECT
      p.id_pedido,
      p.fecha_creacion AS fecha,
      c.nombre || ' ' || c.apellido AS cliente,
      COALESCE(e.nombre || ' ' || e.apellido, 'Sin asignar') AS cajero,
      p.canal,
      p.estado AS estado_pedido,
      p.total,
      pg.metodo AS metodo_pago,
      pg.estado AS estado_pago
    FROM pedido p
    JOIN cliente c ON c.id_cliente = p.id_cliente
    LEFT JOIN empleado e ON e.id_empleado = p.id_cajero
    LEFT JOIN pago pg ON pg.id_pedido = p.id_pedido
    ORDER BY p.fecha_creacion DESC
  `,
  joinComprasResumen: `
    SELECT
      ci.id_compra_insumo,
      ci.fecha,
      prov.nombre AS proveedor,
      emp.nombre || ' ' || emp.apellido AS empleado,
      COUNT(cid.id_insumo) AS lineas_detalle,
      SUM(cid.cantidad * cid.costo_unitario) AS total_calculado,
      ci.total AS total_registrado
    FROM compra_insumo ci
    JOIN proveedor prov ON prov.id_proveedor = ci.id_proveedor
    JOIN empleado emp ON emp.id_empleado = ci.id_empleado
    JOIN compra_insumo_detalle cid ON cid.id_compra_insumo = ci.id_compra_insumo
    GROUP BY ci.id_compra_insumo, ci.fecha, prov.nombre, emp.id_empleado, emp.nombre, emp.apellido, ci.total
    ORDER BY ci.fecha DESC
  `,
  subqueryClientesConPagos: `
    SELECT
      c.id_cliente,
      c.nombre || ' ' || c.apellido AS cliente,
      c.email,
      c.telefono
    FROM cliente c
    WHERE EXISTS (
      SELECT 1
      FROM pedido p
      JOIN pago pg ON pg.id_pedido = p.id_pedido
      WHERE p.id_cliente = c.id_cliente
        AND pg.estado = 'pagado'
    )
    ORDER BY c.nombre, c.apellido
  `,
  subqueryProveedoresGasto: `
    SELECT
      prov.id_proveedor,
      prov.nombre AS proveedor,
      prov.contacto_nombre AS contacto,
      prov.email,
      resumen.num_compras,
      resumen.gasto_total
    FROM proveedor prov
    JOIN (
      SELECT
        id_proveedor,
        COUNT(*) AS num_compras,
        SUM(total) AS gasto_total
      FROM compra_insumo
      GROUP BY id_proveedor
    ) AS resumen ON resumen.id_proveedor = prov.id_proveedor
    ORDER BY resumen.gasto_total DESC, prov.nombre
  `,
  subqueryProductosSinVentas: `
    SELECT
      pr.id_producto,
      cat.nombre AS categoria,
      pr.nombre AS producto,
      pr.precio,
      pr.disponible
    FROM producto pr
    JOIN categoria_producto cat ON cat.id_categoria_producto = pr.id_categoria_producto
    WHERE NOT EXISTS (
      SELECT 1
      FROM pedido_item pi
      WHERE pi.id_producto = pr.id_producto
    )
    ORDER BY cat.nombre, pr.nombre
  `,
  viewPedidosResumen: `
    SELECT *
    FROM v_resumen_pedidos
    ORDER BY fecha_creacion DESC
    LIMIT 50
  `,
  viewStockCritico: `
    SELECT *
    FROM v_stock_critico
    ORDER BY deficit DESC, insumo
  `,
};
