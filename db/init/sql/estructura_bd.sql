BEGIN;

DROP VIEW IF EXISTS v_resumen_pedidos CASCADE;
DROP VIEW IF EXISTS v_stock_critico CASCADE;
DROP TABLE IF EXISTS pago CASCADE;
DROP TABLE IF EXISTS pedido_item_modificacion CASCADE;
DROP TABLE IF EXISTS pedido_item CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS movimiento_inventario CASCADE;
DROP TABLE IF EXISTS compra_insumo_detalle CASCADE;
DROP TABLE IF EXISTS compra_insumo CASCADE;
DROP TABLE IF EXISTS combo_item CASCADE;
DROP TABLE IF EXISTS receta CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS categoria_producto CASCADE;
DROP TABLE IF EXISTS extra CASCADE;
DROP TABLE IF EXISTS insumo CASCADE;
DROP TABLE IF EXISTS proveedor CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TYPE IF EXISTS tipo_rol_empleado CASCADE;
DROP TYPE IF EXISTS tipo_canal_pedido CASCADE;
DROP TYPE IF EXISTS tipo_estado_pedido CASCADE;
DROP TYPE IF EXISTS tipo_metodo_pago CASCADE;
DROP TYPE IF EXISTS tipo_estado_pago CASCADE;
DROP TYPE IF EXISTS tipo_movimiento_inv CASCADE;
DROP TYPE IF EXISTS tipo_modificacion CASCADE;

CREATE TYPE tipo_rol_empleado AS ENUM ('admin', 'cajero', 'cocinero');
CREATE TYPE tipo_canal_pedido AS ENUM ('online', 'mostrador');
CREATE TYPE tipo_estado_pedido AS ENUM (
'pendiente',
'aprobado',
'en_proceso',
'finalizado',
'entregado',
'cancelado'
);
CREATE TYPE tipo_metodo_pago AS ENUM ('efectivo', 'tarjeta');
CREATE TYPE tipo_estado_pago AS ENUM ('pendiente', 'pagado', 'fallido', 'reembolsado');
CREATE TYPE tipo_movimiento_inv AS ENUM ('entrada', 'salida', 'ajuste');
CREATE TYPE tipo_modificacion AS ENUM ('quitar', 'agregar');

-- empleado
CREATE TABLE empleado (
id_empleado SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
dpi VARCHAR(20) NOT NULL UNIQUE,
email VARCHAR(150) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
rol tipo_rol_empleado NOT NULL,
activo BOOLEAN NOT NULL DEFAULT TRUE,
fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- cliente
CREATE TABLE cliente (
id_cliente SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
telefono VARCHAR(20),
password_hash VARCHAR(255), -- NULL permitido solo para "Cliente General"
direccion VARCHAR(255),
activo BOOLEAN NOT NULL DEFAULT TRUE,
creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- proveedor
CREATE TABLE proveedor (
id_proveedor SERIAL PRIMARY KEY,
nombre VARCHAR(150) NOT NULL,
nit VARCHAR(20) NOT NULL UNIQUE,
telefono VARCHAR(20),
email VARCHAR(150),
direccion VARCHAR(255),
contacto_nombre VARCHAR(150),
activo BOOLEAN NOT NULL DEFAULT TRUE,
creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- insumo
CREATE TABLE insumo (
id_insumo SERIAL PRIMARY KEY,
id_proveedor INTEGER NOT NULL REFERENCES proveedor(id_proveedor),
nombre VARCHAR(150) NOT NULL UNIQUE,
unidad_medida VARCHAR(20) NOT NULL, -- 'gramo', 'unidad', 'ml', 'kg'...
stock_actual NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
stock_minimo NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
costo_unitario NUMERIC(10,4) NOT NULL DEFAULT 0 CHECK (costo_unitario >= 0),
activo BOOLEAN NOT NULL DEFAULT TRUE,
creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- categoria_producto
CREATE TABLE categoria_producto (
id_categoria_producto SERIAL PRIMARY KEY,
nombre VARCHAR(80) NOT NULL UNIQUE,
descripcion VARCHAR(255)
);

-- producto
CREATE TABLE producto (
id_producto SERIAL PRIMARY KEY,
id_categoria_producto INTEGER NOT NULL REFERENCES categoria_producto(id_categoria_producto),
nombre VARCHAR(150) NOT NULL UNIQUE,
descripcion TEXT,
precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
es_combo BOOLEAN NOT NULL DEFAULT FALSE,
disponible BOOLEAN NOT NULL DEFAULT TRUE,
creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- receta
CREATE TABLE receta (
id_producto INTEGER NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
id_insumo INTEGER NOT NULL REFERENCES insumo(id_insumo),
cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
PRIMARY KEY (id_producto, id_insumo)
);

-- combo_item
CREATE TABLE combo_item (
id_producto_combo INTEGER NOT NULL REFERENCES producto(id_producto) ON DELETE CASCADE,
id_producto_componente INTEGER NOT NULL REFERENCES producto(id_producto),
cantidad INTEGER NOT NULL CHECK (cantidad > 0),
PRIMARY KEY (id_producto_combo, id_producto_componente),
CHECK (id_producto_combo <> id_producto_componente)
);

-- extra
CREATE TABLE extra (
id_extra SERIAL PRIMARY KEY,
id_insumo INTEGER NOT NULL REFERENCES insumo(id_insumo),
nombre VARCHAR(100) NOT NULL UNIQUE,
precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
cantidad_insumo NUMERIC(12,3) NOT NULL CHECK (cantidad_insumo > 0),
activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- compra_insumo
CREATE TABLE compra_insumo (
id_compra_insumo SERIAL PRIMARY KEY,
id_proveedor INTEGER NOT NULL REFERENCES proveedor(id_proveedor),
id_empleado INTEGER NOT NULL REFERENCES empleado(id_empleado),
fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
observaciones TEXT
);

-- compra_insumo_detalle
CREATE TABLE compra_insumo_detalle (
id_compra_insumo INTEGER NOT NULL REFERENCES compra_insumo(id_compra_insumo) ON DELETE CASCADE,
id_insumo INTEGER NOT NULL REFERENCES insumo(id_insumo),
cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
costo_unitario NUMERIC(10,4) NOT NULL CHECK (costo_unitario >= 0),
PRIMARY KEY (id_compra_insumo, id_insumo)
);

-- pedido
CREATE TABLE pedido (
id_pedido SERIAL PRIMARY KEY,
id_cliente INTEGER NOT NULL REFERENCES cliente(id_cliente),
id_cajero INTEGER REFERENCES empleado(id_empleado),
id_cocinero INTEGER REFERENCES empleado(id_empleado),
canal tipo_canal_pedido NOT NULL,
estado tipo_estado_pedido NOT NULL DEFAULT 'pendiente',
subtotal NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
notas TEXT,
fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
fecha_aprobado TIMESTAMPTZ,
fecha_finalizado TIMESTAMPTZ,
fecha_entregado TIMESTAMPTZ
);

-- pedido_item
CREATE TABLE pedido_item (
id_pedido_item SERIAL PRIMARY KEY,
id_pedido INTEGER NOT NULL REFERENCES pedido(id_pedido) ON DELETE CASCADE,
id_producto INTEGER NOT NULL REFERENCES producto(id_producto),
cantidad INTEGER NOT NULL CHECK (cantidad > 0),
precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
subtotal_linea NUMERIC(12,2) NOT NULL CHECK (subtotal_linea >= 0)
);

-- pedido_item_modificacion
CREATE TABLE pedido_item_modificacion (
id_pedido_item_modificacion SERIAL PRIMARY KEY,
id_pedido_item INTEGER NOT NULL REFERENCES pedido_item(id_pedido_item) ON DELETE CASCADE,
id_extra INTEGER REFERENCES extra(id_extra),
tipo tipo_modificacion NOT NULL,
descripcion VARCHAR(150) NOT NULL,
precio_extra NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (precio_extra >= 0),
CHECK (
(tipo = 'agregar' AND id_extra IS NOT NULL)
OR
(tipo = 'quitar' AND id_extra IS NULL)
)
);

-- pago
CREATE TABLE pago (
id_pago SERIAL PRIMARY KEY,
id_pedido INTEGER NOT NULL UNIQUE REFERENCES pedido(id_pedido) ON DELETE CASCADE,
metodo tipo_metodo_pago NOT NULL,
estado tipo_estado_pago NOT NULL DEFAULT 'pendiente',
monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
referencia_externa VARCHAR(100),
fecha_intento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
fecha_confirmacion TIMESTAMPTZ,
mensaje_error TEXT
);

-- movimiento_inventario
CREATE TABLE movimiento_inventario (
id_movimiento_inventario SERIAL PRIMARY KEY,
id_insumo INTEGER NOT NULL REFERENCES insumo(id_insumo),
id_empleado INTEGER REFERENCES empleado(id_empleado),
id_pedido INTEGER REFERENCES pedido(id_pedido),
id_compra_insumo INTEGER REFERENCES compra_insumo(id_compra_insumo),
tipo tipo_movimiento_inv NOT NULL,
cantidad NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
motivo VARCHAR(255),
fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMIT;
