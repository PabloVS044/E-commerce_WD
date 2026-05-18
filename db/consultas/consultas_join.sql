SELECT
    p.id_pedido,
    p.fecha_creacion AS fecha,
    c.nombre || ' ' || c.apellido AS cliente,
    e.nombre || ' ' || e.apellido AS cajero,
    p.canal,
    p.estado AS estado_pedido,
    p.total,
    pg.metodo AS metodo_pago,
    pg.estado AS estado_pago
FROM pedido p
JOIN cliente c ON c.id_cliente = p.id_cliente
LEFT JOIN empleado e ON e.id_empleado = p.id_cajero
LEFT JOIN pago pg ON pg.id_pedido = p.id_pedido
ORDER BY p.fecha_creacion DESC;


SELECT
    cat.nombre AS categoria,
    pr.nombre AS producto,
    pr.precio AS precio_unitario,
    SUM(pi.cantidad) AS unidades_vendidas,
    SUM(pi.subtotal_linea) AS ingresos_totales
FROM pedido_item pi
JOIN pedido ped ON ped.id_pedido = pi.id_pedido
JOIN producto pr ON pr.id_producto = pi.id_producto
JOIN categoria_producto cat ON cat.id_categoria_producto = pr.id_categoria_producto
WHERE ped.estado IN ('finalizado', 'entregado')
GROUP BY cat.nombre, pr.id_producto, pr.nombre, pr.precio
ORDER BY ingresos_totales DESC;


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
ORDER BY ci.fecha DESC;
