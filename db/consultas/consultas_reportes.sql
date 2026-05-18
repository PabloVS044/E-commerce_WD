SELECT
    DATE(p.fecha_creacion AT TIME ZONE 'America/Guatemala') AS fecha,
    COUNT(p.id_pedido) AS num_pedidos,
    SUM(p.total) AS total_ventas,
    SUM(CASE WHEN p.canal = 'online' THEN 1 ELSE 0 END) AS pedidos_online,
    SUM(CASE WHEN p.canal = 'mostrador' THEN 1 ELSE 0 END) AS pedidos_mostrador,
    ROUND(AVG(p.total), 2) AS ticket_promedio
FROM pedido p
WHERE p.estado IN ('finalizado', 'entregado')
GROUP BY DATE(p.fecha_creacion AT TIME ZONE 'America/Guatemala')
ORDER BY fecha DESC;


SELECT
    c.nombre || ' ' || c.apellido AS cliente,
    c.email,
    COUNT(p.id_pedido) AS total_pedidos,
    SUM(p.total) AS gasto_total,
    ROUND(AVG(p.total), 2) AS gasto_promedio
FROM cliente c
JOIN pedido p ON p.id_cliente = c.id_cliente
JOIN pago pg ON pg.id_pedido = p.id_pedido
WHERE pg.estado = 'pagado'
  AND p.estado IN ('finalizado', 'entregado')
GROUP BY c.id_cliente, c.nombre, c.apellido, c.email
HAVING COUNT(p.id_pedido) >= 2
ORDER BY total_pedidos DESC, gasto_total DESC;


WITH ventas_producto AS (
    SELECT
        pi.id_producto,
        SUM(pi.cantidad) AS unidades_vendidas,
        SUM(pi.subtotal_linea) AS ingresos
    FROM pedido_item pi
    JOIN pedido p ON p.id_pedido = pi.id_pedido
    WHERE p.estado IN ('finalizado', 'entregado')
    GROUP BY pi.id_producto
),
total_ingresos AS (
    SELECT SUM(ingresos) AS total FROM ventas_producto
)
SELECT
    RANK() OVER (ORDER BY vp.ingresos DESC) AS ranking,
    pr.nombre AS producto,
    cat.nombre AS categoria,
    vp.unidades_vendidas,
    vp.ingresos,
    ROUND((vp.ingresos / NULLIF(ti.total, 0)) * 100, 2) AS pct_del_total
FROM ventas_producto vp
JOIN producto pr ON pr.id_producto = vp.id_producto
JOIN categoria_producto cat ON cat.id_categoria_producto = pr.id_categoria_producto
CROSS JOIN total_ingresos ti
ORDER BY ranking;
