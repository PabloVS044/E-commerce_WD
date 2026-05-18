BEGIN;

CREATE INDEX idx_pedido_fecha_creacion
ON pedido (fecha_creacion DESC);
CREATE INDEX idx_pedido_estado
ON pedido (estado);
CREATE INDEX idx_pedido_item_producto
ON pedido_item (id_producto);
CREATE INDEX idx_movimiento_inventario_insumo_fecha
ON movimiento_inventario (id_insumo, fecha DESC);
CREATE INDEX idx_pedido_cliente
ON pedido (id_cliente, fecha_creacion DESC);

COMMIT;
