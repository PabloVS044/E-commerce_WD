BEGIN;

WITH detalles (id_insumo, cantidad, costo_unitario) AS (
    VALUES
        (1, 10000.000::NUMERIC, 0.0650::NUMERIC),
        (2, 8000.000::NUMERIC, 0.0580::NUMERIC),
        (3, 4000.000::NUMERIC, 0.0720::NUMERIC)
),
nueva_compra AS (
    INSERT INTO compra_insumo (id_proveedor, id_empleado, fecha, total, observaciones)
    SELECT
        1,
        1,
        NOW(),
        SUM(d.cantidad * d.costo_unitario),
        'Reabastecimiento semanal de carnes'
    FROM detalles d
    RETURNING id_compra_insumo, id_empleado
),
insertar_detalle AS (
    INSERT INTO compra_insumo_detalle (id_compra_insumo, id_insumo, cantidad, costo_unitario)
    SELECT
        nc.id_compra_insumo,
        d.id_insumo,
        d.cantidad,
        d.costo_unitario
    FROM nueva_compra nc
    CROSS JOIN detalles d
    RETURNING id_insumo, cantidad
),
actualizar_stock AS (
    UPDATE insumo i
    SET stock_actual = i.stock_actual + d.cantidad
    FROM detalles d
    WHERE i.id_insumo = d.id_insumo
    RETURNING i.id_insumo, d.cantidad
)
INSERT INTO movimiento_inventario (id_insumo, id_empleado, id_compra_insumo, tipo, cantidad, motivo, fecha)
SELECT
    a.id_insumo,
    nc.id_empleado,
    nc.id_compra_insumo,
    'entrada',
    a.cantidad,
    'Compra semanal de reabastecimiento',
    NOW()
FROM actualizar_stock a
CROSS JOIN nueva_compra nc;

COMMIT;

-- La aplicación ejecuta esta misma lógica con BEGIN/COMMIT/ROLLBACK
-- desde backend/src/routes/comprasInsumos.js y revierte toda la compra
-- si falla cualquier validación o sentencia SQL.
