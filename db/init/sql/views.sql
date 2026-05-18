CREATE OR REPLACE VIEW v_resumen_pedidos AS
SELECT
    p.id_pedido,
    p.fecha_creacion,
    p.canal,
    p.estado AS estado_pedido,
    p.notas,
    c.id_cliente,
    c.nombre || ' ' || c.apellido AS cliente,
    c.email AS email_cliente,
    caj.nombre || ' ' || caj.apellido AS cajero,
    coc.nombre || ' ' || coc.apellido AS cocinero,
    p.subtotal,
    p.total,
    pg.metodo AS metodo_pago,
    pg.estado AS estado_pago,
    pg.fecha_confirmacion AS fecha_pago,
    pg.referencia_externa
FROM pedido p
JOIN cliente c ON c.id_cliente = p.id_cliente
LEFT JOIN empleado caj ON caj.id_empleado = p.id_cajero
LEFT JOIN empleado coc ON coc.id_empleado = p.id_cocinero
LEFT JOIN pago pg ON pg.id_pedido = p.id_pedido;

CREATE OR REPLACE VIEW v_stock_critico AS
SELECT
    i.id_insumo,
    i.nombre AS insumo,
    i.unidad_medida,
    i.stock_actual,
    i.stock_minimo,
    ROUND(i.stock_minimo - i.stock_actual, 3) AS deficit,
    p.id_proveedor,
    p.nombre AS proveedor,
    p.telefono,
    p.email,
    p.contacto_nombre AS contacto
FROM insumo i
JOIN proveedor p ON p.id_proveedor = i.id_proveedor
WHERE i.stock_actual <= i.stock_minimo
  AND i.activo = TRUE;
