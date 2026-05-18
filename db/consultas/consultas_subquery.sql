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
ORDER BY c.nombre;


SELECT
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
ORDER BY resumen.gasto_total DESC;


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
ORDER BY cat.nombre, pr.nombre;
