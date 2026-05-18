BEGIN;

-- empleado
INSERT INTO empleado (nombre, apellido, dpi, email, password_hash, rol, fecha_ingreso) VALUES
('José', 'Pérez Ramírez', '2501234567890', 'jose.perez@tacospepe.gt', '$2b$10$hashadminejemplo01', 'admin', '2024-01-15'),
('María', 'González López', '2501234567891', 'maria.gonzalez@tacospepe.gt', '$2b$10$hashadminejemplo02', 'admin', '2024-02-01'),
('Carlos', 'Hernández Mejía', '2501234567892', 'carlos.hernandez@tacospepe.gt', '$2b$10$hashcajeroejemp01', 'cajero', '2024-03-10'),
('Ana', 'Morales Ruiz', '2501234567893', 'ana.morales@tacospepe.gt', '$2b$10$hashcajeroejemp02', 'cajero', '2024-04-05'),
('Luis', 'Ramírez Vega', '2501234567894', 'luis.ramirez@tacospepe.gt', '$2b$10$hashcajeroejemp03', 'cajero', '2024-04-12'),
('Sofía', 'Castillo Díaz', '2501234567895', 'sofia.castillo@tacospepe.gt', '$2b$10$hashcajeroejemp04', 'cajero', '2024-05-20'),
('Diego', 'Flores Muñoz', '2501234567896', 'diego.flores@tacospepe.gt', '$2b$10$hashcajeroejemp05', 'cajero', '2024-06-01'),
('Valeria', 'Cruz Rivas', '2501234567897', 'valeria.cruz@tacospepe.gt', '$2b$10$hashcajeroejemp06', 'cajero', '2024-06-15'),
('Fernando', 'Jiménez Paz', '2501234567898', 'fernando.jimenez@tacospepe.gt', '$2b$10$hashcajeroejemp07', 'cajero', '2024-07-01'),
('Isabel', 'Reyes Soto', '2501234567899', 'isabel.reyes@tacospepe.gt', '$2b$10$hashcajeroejemp08', 'cajero', '2024-07-20'),
('Ricardo', 'Aguilar Núñez', '2501234567800', 'ricardo.aguilar@tacospepe.gt', '$2b$10$hashcajeroejemp09', 'cajero', '2024-08-05'),
('Patricia', 'Orellana Mora', '2501234567801', 'patricia.orellana@tacospepe.gt', '$2b$10$hashcajeroejemp10', 'cajero', '2024-09-01'),
('Roberto', 'Villalobos Gil', '2501234567802', 'roberto.villalobos@tacospepe.gt','$2b$10$hashcocinerejemp01','cocinero', '2024-02-15'),
('Lucía', 'Martínez Paredes', '2501234567803', 'lucia.martinez@tacospepe.gt', '$2b$10$hashcocinerejemp02','cocinero', '2024-03-01'),
('Andrés', 'Sánchez Roca', '2501234567804', 'andres.sanchez@tacospepe.gt', '$2b$10$hashcocinerejemp03','cocinero', '2024-03-20'),
('Gabriela', 'Torres Ávila', '2501234567805', 'gabriela.torres@tacospepe.gt', '$2b$10$hashcocinerejemp04','cocinero', '2024-04-15'),
('Miguel', 'Fuentes Cano', '2501234567806', 'miguel.fuentes@tacospepe.gt', '$2b$10$hashcocinerejemp05','cocinero', '2024-05-01'),
('Carmen', 'Escobar Molina', '2501234567807', 'carmen.escobar@tacospepe.gt', '$2b$10$hashcocinerejemp06','cocinero', '2024-05-25'),
('Javier', 'Mendoza Arias', '2501234567808', 'javier.mendoza@tacospepe.gt', '$2b$10$hashcocinerejemp07','cocinero', '2024-06-10'),
('Daniela', 'Salazar Ortiz', '2501234567809', 'daniela.salazar@tacospepe.gt', '$2b$10$hashcocinerejemp08','cocinero', '2024-06-25'),
('Pablo', 'Cabrera Luna', '2501234567810', 'pablo.cabrera@tacospepe.gt', '$2b$10$hashcocinerejemp09','cocinero', '2024-07-10'),
('Alejandra', 'Navas Pineda', '2501234567811', 'alejandra.navas@tacospepe.gt', '$2b$10$hashcocinerejemp10','cocinero', '2024-07-30'),
('Héctor', 'Quiñónez Barrios', '2501234567812', 'hector.quinonez@tacospepe.gt', '$2b$10$hashcocinerejemp11','cocinero', '2024-08-15'),
('Rosa', 'Godoy Mendizábal', '2501234567813', 'rosa.godoy@tacospepe.gt', '$2b$10$hashcocinerejemp12','cocinero', '2024-09-05'),
('Enrique', 'Solís Herrera', '2501234567814', 'enrique.solis@tacospepe.gt', '$2b$10$hashcocinerejemp13','cocinero', '2024-09-20'),
('Mónica', 'Batres Rodas', '2501234567815', 'monica.batres@tacospepe.gt', '$2b$10$hashcocinerejemp14','cocinero', '2024-10-10'),
('Víctor', 'Chacón Alfaro', '2501234567816', 'victor.chacon@tacospepe.gt', '$2b$10$hashcocinerejemp15','cocinero', '2024-11-01'),
('Rebeca', 'Monzón Del Valle', '2501234567817', 'rebeca.monzon@tacospepe.gt', '$2b$10$hashcocinerejemp16','cocinero', '2025-01-10');

-- cliente
INSERT INTO cliente (nombre, apellido, email, telefono, password_hash, direccion) VALUES
('Cliente', 'General', 'general@tacospepe.gt', NULL, NULL, NULL),
('Juan', 'López Gómez', 'juan.lopez@gmail.com', '50212345001', '$2b$10$hashcliente001', 'Zona 10, Guatemala'),
('Laura', 'Pineda Méndez', 'laura.pineda@gmail.com', '50212345002', '$2b$10$hashcliente002', 'Zona 14, Guatemala'),
('Pedro', 'Santos Barrios', 'pedro.santos@gmail.com', '50212345003', '$2b$10$hashcliente003', 'Zona 15, Guatemala'),
('Mariana', 'Estrada Tello', 'mariana.estrada@gmail.com', '50212345004', '$2b$10$hashcliente004', 'Zona 16, Guatemala'),
('Eduardo', 'Paz Interiano', 'eduardo.paz@gmail.com', '50212345005', '$2b$10$hashcliente005', 'Mixco'),
('Claudia', 'Herrera Segura', 'claudia.herrera@gmail.com', '50212345006', '$2b$10$hashcliente006', 'Villa Nueva'),
('Julio', 'Monroy Acevedo', 'julio.monroy@gmail.com', '50212345007', '$2b$10$hashcliente007', 'Zona 11, Guatemala'),
('Ximena', 'Portillo Díaz', 'ximena.portillo@gmail.com', '50212345008', '$2b$10$hashcliente008', 'Zona 13, Guatemala'),
('Roberto', 'Galindo Mejía', 'roberto.galindo@gmail.com', '50212345009', '$2b$10$hashcliente009', 'Zona 9, Guatemala'),
('Andrea', 'Linares Ruano', 'andrea.linares@gmail.com', '50212345010', '$2b$10$hashcliente010', 'Carretera a El Salvador'),
('Oscar', 'Contreras Juárez', 'oscar.contreras@gmail.com', '50212345011', '$2b$10$hashcliente011', 'San Cristóbal, Mixco'),
('Paula', 'Véliz Cardona', 'paula.veliz@gmail.com', '50212345012', '$2b$10$hashcliente012', 'Zona 12, Guatemala'),
('Esteban', 'Marroquín Samayoa','esteban.marroquin@gmail.com', '50212345013', '$2b$10$hashcliente013', 'Zona 2, Guatemala'),
('Natalia', 'Cifuentes Vides', 'natalia.cifuentes@gmail.com', '50212345014', '$2b$10$hashcliente014', 'Antigua Guatemala'),
('Gustavo', 'Del Cid Porras', 'gustavo.delcid@gmail.com', '50212345015', '$2b$10$hashcliente015', 'Zona 4, Guatemala'),
('Renata', 'Aragón Bonilla', 'renata.aragon@gmail.com', '50212345016', '$2b$10$hashcliente016', 'Zona 1, Guatemala'),
('Marco', 'Juárez Escobar', 'marco.juarez@gmail.com', '50212345017', '$2b$10$hashcliente017', 'Zona 7, Guatemala'),
('Valentina', 'Ovalle Cano', 'valentina.ovalle@gmail.com', '50212345018', '$2b$10$hashcliente018', 'Zona 10, Guatemala'),
('Sergio', 'Arévalo López', 'sergio.arevalo@gmail.com', '50212345019', '$2b$10$hashcliente019', 'Fraijanes'),
('Camila', 'Rodas Peralta', 'camila.rodas@gmail.com', '50212345020', '$2b$10$hashcliente020', 'Zona 10, Guatemala'),
('Bruno', 'Letona Villeda', 'bruno.letona@gmail.com', '50212345021', '$2b$10$hashcliente021', 'Zona 14, Guatemala'),
('Alicia', 'Cerezo Montenegro','alicia.cerezo@gmail.com', '50212345022', '$2b$10$hashcliente022', 'Zona 15, Guatemala'),
('Rodrigo', 'Mazariegos Ayala', 'rodrigo.mazariegos@gmail.com','50212345023', '$2b$10$hashcliente023', 'Zona 16, Guatemala'),
('Fátima', 'Cobos Granados', 'fatima.cobos@gmail.com', '50212345024', '$2b$10$hashcliente024', 'Mixco'),
('Alberto', 'Paredes Trujillo', 'alberto.paredes@gmail.com', '50212345025', '$2b$10$hashcliente025', 'Zona 11, Guatemala'),
('Ingrid', 'Sandoval Escalante','ingrid.sandoval@gmail.com', '50212345026', '$2b$10$hashcliente026', 'Zona 12, Guatemala'),
('Manuel', 'Folgar Cuéllar', 'manuel.folgar@gmail.com', '50212345027', '$2b$10$hashcliente027', 'Zona 6, Guatemala'),
('Beatriz', 'Luján Morataya', 'beatriz.lujan@gmail.com', '50212345028', '$2b$10$hashcliente028', 'Santa Catarina Pinula'),
('Jorge', 'Asturias Urrutia', 'jorge.asturias@gmail.com', '50212345029', '$2b$10$hashcliente029', 'Zona 10, Guatemala');

-- proveedor
INSERT INTO proveedor (nombre, nit, telefono, email, direccion, contacto_nombre) VALUES
('Carnicería Don Beto', '1234567-8', '50222221001', 'ventas@donbeto.gt', 'Mercado Central, Zona 1', 'Humberto Palma'),
('Tortillería La Abuela', '2345678-9', '50222221002', 'pedidos@laabuela.gt', 'Zona 6, Guatemala', 'Doña Elena'),
('Distribuidora Chapina', '3456789-0', '50222221003', 'ventas@chapina.gt', 'Calzada Roosevelt', 'Marvin Castillo'),
('Verduras Frescas Xela', '4567890-1', '50222221004', 'info@verdurasxela.gt', 'CENMA, Villa Nueva', 'Rosa Pérez'),
('Lácteos San Miguel', '5678901-2', '50222221005', 'ventas@sanmiguel.gt', 'Escuintla', 'Luis Alfaro'),
('Salsas La Picante', '6789012-3', '50222221006', 'contacto@lapicante.gt', 'Zona 12, Guatemala', 'Fernanda Ríos'),
('Bebidas Tropicales SA', '7890123-4', '50222221007', 'ventas@tropicales.gt', 'Amatitlán', 'Carlos Quintanilla'),
('Panificadora El Trigal', '8901234-5', '50222221008', 'pedidos@eltrigal.gt', 'Zona 11, Guatemala', 'Mario Fuentes'),
('Especias y Más', '9012345-6', '50222221009', 'ventas@especiasymas.gt', 'Mercado La Terminal', 'Alicia Molina'),
('Aceites Olimpo', '0123456-7', '50222221010', 'contacto@olimpo.gt', 'Zona 4, Guatemala', 'Eduardo Ortiz'),
('Granos del Altiplano', '1122334-5', '50222221011', 'ventas@altiplano.gt', 'Totonicapán', 'Ingrid Pacheco'),
('Frutas Selectas', '2233445-6', '50222221012', 'pedidos@frutasselectas.gt','CENMA', 'Juan Carlos Ardón'),
('Embutidos El Chino', '3344556-7', '50222221013', 'ventas@embutidoschino.gt','Zona 7, Guatemala', 'Wei Lin'),
('Productos del Mar Atlántico', '4455667-8', '50222221014', 'ventas@mar.gt', 'Puerto Barrios', 'Mauricio Paz'),
('Congelados del Pacífico', '5566778-9', '50222221015', 'info@congpac.gt', 'Puerto Quetzal', 'Sandra Méndez'),
('Quesos Artesanales Zacapa', '6677889-0', '50222221016', 'ventas@quesoszacapa.gt', 'Zacapa', 'Don Ramiro'),
('Limones y Cítricos', '7788990-1', '50222221017', 'ventas@limones.gt', 'Sanarate, El Progreso', 'Rony Vásquez'),
('Aguacates Atitlán', '8899001-2', '50222221018', 'pedidos@aguacates.gt', 'Sololá', 'María Xón'),
('Chiles Selectos', '9900112-3', '50222221019', 'ventas@chiles.gt', 'Jalapa', 'Otto García'),
('Distribuidora de Servilletas', '1011121-4', '50222221020', 'ventas@servilletas.gt', 'Zona 12, Guatemala', 'Claudia Pérez'),
('Empaques Ecológicos GT', '1213141-5', '50222221021', 'info@empaquesgt.gt', 'Zona 18, Guatemala', 'Alberto Solórzano'),
('Café de la Montaña', '1415161-6', '50222221022', 'ventas@cafemontana.gt', 'Huehuetenango', 'Doña Rufina'),
('Hielo Polar SA', '1617181-7', '50222221023', 'pedidos@hielopolar.gt', 'Zona 8, Guatemala', 'Rafael Girón'),
('Dulces Típicos Guate', '1819202-8', '50222221024', 'ventas@dulcestipicos.gt', 'Antigua Guatemala', 'Lucía Barrios'),
('Pollos El Granjero', '2021222-9', '50222221025', 'ventas@elgranjero.gt', 'Mixco', 'Felipe Aguilar');

-- insumo
INSERT INTO insumo (id_proveedor, nombre, unidad_medida, stock_actual, stock_minimo, costo_unitario) VALUES
(1, 'Carne de res para bistec', 'gramo', 15000.000, 5000.000, 0.0650),
(1, 'Carne de cerdo al pastor', 'gramo', 12000.000, 4000.000, 0.0580),
(1, 'Chorizo artesanal', 'gramo', 8000.000, 2500.000, 0.0720),
(1, 'Lengua de res', 'gramo', 5000.000, 1500.000, 0.0900),
(2, 'Tortilla de maíz', 'unidad', 2000.000, 500.000, 0.7500),
(2, 'Tortilla de harina', 'unidad', 1500.000, 400.000, 1.0000),
(3, 'Sal refinada', 'gramo', 10000.000, 2000.000, 0.0050),
(3, 'Azúcar blanca', 'gramo', 10000.000, 2000.000, 0.0075),
(4, 'Cebolla blanca', 'gramo', 8000.000, 2000.000, 0.0090),
(4, 'Cilantro fresco', 'gramo', 650.000, 800.000, 0.0180),
(4, 'Tomate roma', 'gramo', 9000.000, 2500.000, 0.0100),
(4, 'Lechuga romana', 'gramo', 4000.000, 1000.000, 0.0120),
(5, 'Queso fresco', 'gramo', 6000.000, 1500.000, 0.0350),
(5, 'Crema agria', 'ml', 4000.000, 1000.000, 0.0200),
(6, 'Salsa roja picante', 'ml', 5000.000, 1500.000, 0.0150),
(6, 'Salsa verde tomatillo', 'ml', 5000.000, 1500.000, 0.0160),
(6, 'Chile habanero molido', 'ml', 2000.000, 500.000, 0.0400),
(7, 'Horchata concentrada', 'ml', 8000.000, 2000.000, 0.0120),
(7, 'Jamaica concentrada', 'ml', 6000.000, 1500.000, 0.0130),
(7, 'Coca-Cola (355ml)', 'unidad', 300.000, 100.000, 4.5000),
(9, 'Comino en polvo', 'gramo', 1500.000, 300.000, 0.0800),
(9, 'Achiote en pasta', 'gramo', 2000.000, 500.000, 0.0600),
(10, 'Aceite vegetal', 'ml', 15000.000, 3000.000, 0.0180),
(11, 'Arroz', 'gramo', 12000.000, 3000.000, 0.0120),
(11, 'Frijol negro', 'gramo', 10000.000, 2500.000, 0.0140),
(12, 'Piña fresca', 'gramo', 5000.000, 1500.000, 0.0090),
(12, 'Limón', 'unidad', 100.000, 150.000, 0.5000),
(16, 'Queso Oaxaca', 'gramo', 3000.000, 800.000, 0.0600),
(18, 'Aguacate hass', 'unidad', 45.000, 60.000, 3.5000),
(25, 'Pollo deshebrado', 'gramo', 8000.000, 2000.000, 0.0550);

-- categoria_producto
INSERT INTO categoria_producto (nombre, descripcion) VALUES
('Tacos', 'Tacos individuales de diferentes carnes y preparaciones'),
('Bebidas', 'Refrescos, aguas frescas y bebidas embotelladas'),
('Combos', 'Combinaciones con descuento de tacos y bebidas'),
('Postres', 'Dulces típicos y postres'),
('Extras', 'Acompañamientos adicionales al pedido'),
('Tacos Especiales', 'Tacos de edición limitada o de autor'),
('Tacos de Mariscos', 'Tacos de pescado, camarón, pulpo'),
('Tacos Vegetarianos', 'Tacos sin carne, opciones vegetales'),
('Tacos Veganos', 'Tacos 100% veganos sin derivados animales'),
('Quesadillas', 'Tortillas rellenas y selladas con queso'),
('Tortas', 'Emparedados tradicionales mexicanos'),
('Sopes y Huaraches', 'Preparaciones de masa gruesa con toppings'),
('Burritos', 'Burritos estilo norteño'),
('Entradas', 'Aperitivos y botanas'),
('Ensaladas', 'Opciones frescas y saludables'),
('Sopas', 'Caldos, pozoles y sopas tradicionales'),
('Aguas Frescas', 'Aguas naturales de frutas y flores'),
('Cervezas', 'Cervezas nacionales e importadas'),
('Cocteles', 'Bebidas con alcohol, margaritas y palomas'),
('Café y Té', 'Bebidas calientes de cafetería'),
('Desayunos', 'Platillos de desayuno hasta mediodía'),
('Menú Infantil', 'Porciones y opciones para niños'),
('Promociones', 'Productos con descuento limitado'),
('Temporada', 'Platillos de temporada específica'),
('Merchandising', 'Artículos de marca: camisetas, gorras, tazas');

-- producto
INSERT INTO producto (id_categoria_producto, nombre, descripcion, precio, es_combo) VALUES
(1, 'Taco al Pastor', 'Taco de cerdo al pastor con piña, cebolla y cilantro', 12.00, FALSE),
(1, 'Taco de Bistec', 'Taco de carne de res asada con cebolla y cilantro', 14.00, FALSE),
(1, 'Taco de Chorizo', 'Taco de chorizo artesanal con cebolla y cilantro', 13.00, FALSE),
(1, 'Taco de Lengua', 'Taco de lengua de res guisada', 16.00, FALSE),
(1, 'Taco de Pollo', 'Taco de pollo deshebrado con cebolla y cilantro', 11.00, FALSE),
(1, 'Taco Vegetariano', 'Taco de frijol con queso, aguacate y salsa verde', 10.00, FALSE),
(1, 'Taco Campechano', 'Taco mixto de bistec y chorizo', 15.00, FALSE),
(1, 'Taco Gringa', 'Taco al pastor con queso derretido en tortilla de harina', 17.00, FALSE),
(1, 'Taco Dorado de Pollo', 'Taco frito de pollo con lechuga, crema y queso', 13.00, FALSE),
(1, 'Taco de Suadero', 'Taco de suadero de res', 14.00, FALSE),
(1, 'Taco Especial del Pepe', 'Taco con mezcla secreta de tres carnes', 18.00, FALSE),
(1, 'Taco de Cochinita Pibil', 'Taco de cerdo marinado en achiote al estilo yucateco', 15.00, FALSE),
(2, 'Horchata Grande', 'Agua de horchata 500ml', 8.00, FALSE),
(2, 'Agua de Jamaica', 'Agua de jamaica 500ml', 8.00, FALSE),
(2, 'Coca-Cola', 'Coca-Cola 355ml en lata', 7.00, FALSE),
(2, 'Agua Pura', 'Agua purificada 500ml', 5.00, FALSE),
(2, 'Limonada con Chía', 'Limonada fresca con semillas de chía', 9.00, FALSE),
(2, 'Café de Olla', 'Café tradicional endulzado con piloncillo', 6.00, FALSE),
(3, 'Combo Clásico', '3 tacos al pastor + horchata grande', 40.00, TRUE),
(3, 'Combo Familiar', '10 tacos variados + 2 horchatas + 2 aguas de jamaica', 130.00, TRUE),
(3, 'Combo del Pepe', '2 tacos especiales del Pepe + coca-cola', 40.00, TRUE),
(3, 'Combo Vegetariano', '3 tacos vegetarianos + limonada con chía', 35.00, TRUE),
(4, 'Flan Napolitano', 'Flan casero porción individual', 15.00, FALSE),
(4, 'Churros con Chocolate', '5 churros con salsa de chocolate', 18.00, FALSE),
(4, 'Arroz con Leche', 'Arroz con leche tradicional', 12.00, FALSE);

-- receta
INSERT INTO receta (id_producto, id_insumo, cantidad) VALUES
(1, 2, 80), (1, 5, 2), (1, 9, 10), (1, 10, 5), (1, 26, 15), (1, 15, 10),
(2, 1, 90), (2, 5, 2), (2, 9, 10), (2, 10, 5), (2, 15, 10),
(3, 3, 85), (3, 5, 2), (3, 9, 10), (3, 10, 5),
(4, 4, 90), (4, 5, 2), (4, 9, 10), (4, 10, 5),
(5, 30, 80), (5, 5, 2), (5, 9, 10), (5, 10, 5),
(6, 5, 2), (6, 25, 60), (6, 13, 20), (6, 29, 1), (6, 16, 10),
(7, 1, 50), (7, 3, 50), (7, 5, 2), (7, 9, 10), (7, 10, 5),
(8, 2, 70), (8, 6, 2), (8, 28, 40), (8, 9, 10), (8, 26, 10),
(9, 30, 70), (9, 5, 2), (9, 12, 20), (9, 14, 15), (9, 13, 15), (9, 23, 10),
(10, 1, 90), (10, 5, 2), (10, 9, 10), (10, 10, 5),
(11, 1, 40), (11, 2, 40), (11, 3, 40), (11, 5, 2), (11, 9, 10), (11, 28, 20),
(12, 2, 90), (12, 22, 8), (12, 5, 2), (12, 9, 10),
(13, 18, 100),
(14, 19, 100),
(15, 20, 1),
(17, 27, 2),
(23, 8, 50), (23, 14, 50),
(24, 23, 30), (24, 8, 20),
(25, 24, 60), (25, 8, 30);

-- producto
INSERT INTO producto (id_categoria_producto, nombre, descripcion, precio, es_combo) VALUES
(3, 'Combo Pareja', '4 tacos variados + 2 horchatas', 60.00, TRUE),
(3, 'Combo Ejecutivo', '2 tacos al pastor + 1 bistec + coca-cola', 45.00, TRUE),
(3, 'Combo Picante', '3 tacos de chorizo + chile habanero + jamaica', 48.00, TRUE),
(3, 'Combo Postre', 'Combo clásico + flan napolitano', 52.00, TRUE),
(3, 'Combo Desayuno', '2 tacos de bistec + 1 café de olla + 1 flan', 45.00, TRUE);

-- combo_item
INSERT INTO combo_item (id_producto_combo, id_producto_componente, cantidad) VALUES
(19, 1, 3), (19, 13, 1),
(20, 1, 3), (20, 2, 3), (20, 3, 2), (20, 5, 2), (20, 13, 2), (20, 14, 2),
(21, 11, 2), (21, 15, 1),
(22, 6, 3), (22, 17, 1),
(26, 1, 2), (26, 2, 2), (26, 13, 2),
(27, 1, 2), (27, 2, 1), (27, 15, 1),
(28, 3, 3), (28, 14, 1),
(29, 1, 3), (29, 13, 1), (29, 23, 1),
(30, 2, 2), (30, 18, 1), (30, 23, 1);

-- extra
INSERT INTO extra (id_insumo, nombre, precio, cantidad_insumo) VALUES
(13, 'Extra queso fresco', 3.00, 20),
(28, 'Extra queso Oaxaca', 5.00, 30),
(14, 'Extra crema', 2.50, 15),
(29, 'Extra aguacate', 6.00, 1),
(9, 'Extra cebolla', 1.00, 15),
(10, 'Extra cilantro', 1.00, 8),
(15, 'Salsa roja extra', 1.50, 20),
(16, 'Salsa verde extra', 1.50, 20),
(17, 'Chile habanero extra', 2.00, 10),
(27, 'Rodaja de limón extra', 1.00, 1),
(5, 'Tortilla de maíz extra', 2.00, 1),
(6, 'Tortilla de harina extra', 3.00, 1),
(26, 'Piña extra', 2.00, 20),
(11, 'Pico de gallo', 3.50, 30),
(25, 'Frijolitos de acompañamiento', 4.00, 60),
(1, 'Extra de bistec', 7.00, 40),
(2, 'Extra de pastor', 6.00, 40),
(3, 'Extra de chorizo', 6.50, 40),
(30, 'Extra de pollo', 5.50, 40),
(13, 'Doble porción de queso fresco', 5.00, 40),
(11, 'Tomate picado extra', 1.50, 25),
(12, 'Lechuga extra', 1.00, 20),
(24, 'Arroz rojo de acompañamiento', 4.50, 80),
(22, 'Achiote extra (preparación)', 2.50, 5),
(21, 'Comino extra (preparación)', 1.50, 3);

-- compra_insumo
INSERT INTO compra_insumo (id_proveedor, id_empleado, fecha, total, observaciones) VALUES
(1, 1, '2026-03-01 08:00-06', 1950.00, 'Compra semanal de carnes'),
(2, 1, '2026-03-01 09:00-06', 450.00, 'Tortillas para la semana'),
(4, 1, '2026-03-02 07:30-06', 320.00, 'Verduras frescas'),
(5, 2, '2026-03-03 08:15-06', 240.00, 'Lácteos'),
(6, 2, '2026-03-03 10:00-06', 180.00, 'Salsas'),
(1, 1, '2026-03-08 08:00-06', 2100.00, 'Compra semanal de carnes'),
(2, 1, '2026-03-08 09:00-06', 450.00, 'Tortillas'),
(7, 2, '2026-03-09 11:00-06', 540.00, 'Bebidas embotelladas'),
(4, 1, '2026-03-09 07:45-06', 280.00, 'Verduras'),
(3, 2, '2026-03-10 10:00-06', 120.00, 'Sal y azúcar'),
(1, 1, '2026-03-15 08:00-06', 2000.00, 'Compra semanal'),
(12, 1, '2026-03-15 09:30-06', 300.00, 'Frutas'),
(16, 2, '2026-03-16 10:45-06', 420.00, 'Quesos artesanales'),
(18, 1, '2026-03-17 07:00-06', 280.00, 'Aguacates'),
(25, 2, '2026-03-18 08:30-06', 450.00, 'Pollo'),
(1, 1, '2026-03-22 08:00-06', 1850.00, 'Compra semanal'),
(2, 1, '2026-03-22 09:00-06', 450.00, 'Tortillas'),
(9, 2, '2026-03-23 11:00-06', 160.00, 'Especias'),
(10, 2, '2026-03-24 10:00-06', 270.00, 'Aceite'),
(11, 1, '2026-03-25 07:30-06', 340.00, 'Granos'),
(1, 1, '2026-04-01 08:00-06', 2050.00, 'Compra semanal'),
(5, 2, '2026-04-02 09:00-06', 260.00, 'Lácteos'),
(6, 2, '2026-04-03 10:30-06', 200.00, 'Salsas'),
(17, 1, '2026-04-04 08:00-06', 250.00, 'Limones'),
(19, 2, '2026-04-05 09:00-06', 160.00, 'Chiles');

-- compra_insumo_detalle
INSERT INTO compra_insumo_detalle (id_compra_insumo, id_insumo, cantidad, costo_unitario) VALUES
(1, 1, 15000, 0.0650),
(1, 2, 12000, 0.0580),
(1, 3, 5000, 0.0720),
(2, 5, 1500, 0.7500),
(2, 6, 1000, 1.0000),
(3, 9, 5000, 0.0090),
(3, 10, 2000, 0.0180),
(3, 11, 6000, 0.0100),
(3, 12, 3000, 0.0120),
(4, 13, 3000, 0.0350),
(4, 14, 2000, 0.0200),
(5, 15, 3000, 0.0150),
(5, 16, 3000, 0.0160),
(5, 17, 1000, 0.0400),
(6, 1, 18000, 0.0650),
(6, 2, 10000, 0.0580),
(7, 5, 1500, 0.7500),
(8, 18, 5000, 0.0120),
(8, 19, 4000, 0.0130),
(8, 20, 100, 4.5000),
(9, 9, 6000, 0.0090),
(9, 10, 2500, 0.0180),
(10, 7, 10000, 0.0050),
(10, 8, 10000, 0.0075),
(11, 1, 14000, 0.0650),
(11, 2, 14000, 0.0580),
(12,26, 4000, 0.0090),
(13,28, 2500, 0.0600),
(14,29, 80, 3.5000),
(15,30, 6000, 0.0550);

UPDATE compra_insumo ci
SET total = resumen.total_calculado
FROM (
    SELECT
        id_compra_insumo,
        ROUND(SUM(cantidad * costo_unitario), 2) AS total_calculado
    FROM compra_insumo_detalle
    GROUP BY id_compra_insumo
) AS resumen
WHERE resumen.id_compra_insumo = ci.id_compra_insumo;

-- pedido
INSERT INTO pedido (id_cliente, id_cajero, id_cocinero, canal, estado, subtotal, total, fecha_creacion, fecha_aprobado, fecha_finalizado, fecha_entregado, notas) VALUES
(2, 3, 13, 'online', 'entregado', 36.00, 36.00, '2026-03-05 12:15-06', '2026-03-05 12:17-06', '2026-03-05 12:35-06', '2026-03-05 12:45-06', 'Para llevar'),
(3, 3, 13, 'online', 'entregado', 41.00, 41.00, '2026-03-05 13:00-06', '2026-03-05 13:02-06', '2026-03-05 13:18-06', '2026-03-05 13:30-06', NULL),
(1, 4, 14, 'mostrador', 'entregado', 28.00, 28.00, '2026-03-06 19:00-06', '2026-03-06 19:00-06', '2026-03-06 19:10-06', '2026-03-06 19:12-06', NULL),
(1, 4, 14, 'mostrador', 'entregado', 59.00, 59.00, '2026-03-06 19:15-06', '2026-03-06 19:15-06', '2026-03-06 19:30-06', '2026-03-06 19:32-06', NULL),
(4, 5, 15, 'online', 'entregado', 40.00, 40.00, '2026-03-07 12:30-06', '2026-03-07 12:33-06', '2026-03-07 12:55-06', '2026-03-07 13:05-06', 'Sin cilantro'),
(5, 5, 15, 'online', 'entregado', 22.00, 22.00, '2026-03-07 13:45-06', '2026-03-07 13:47-06', '2026-03-07 14:00-06', '2026-03-07 14:10-06', NULL),
(1, 6, 16, 'mostrador', 'entregado', 30.00, 30.00, '2026-03-08 18:00-06', '2026-03-08 18:00-06', '2026-03-08 18:15-06', '2026-03-08 18:17-06', NULL),
(6, 6, 16, 'online', 'entregado', 53.00, 53.00, '2026-03-08 19:30-06', '2026-03-08 19:32-06', '2026-03-08 19:50-06', '2026-03-08 20:00-06', NULL),
(7, 7, 17, 'online', 'entregado', 130.00, 130.00, '2026-03-10 12:00-06', '2026-03-10 12:03-06', '2026-03-10 12:40-06', '2026-03-10 12:50-06', 'Pedido familiar'),
(8, 7, 17, 'online', 'entregado', 18.00, 18.00, '2026-03-10 12:05-06', '2026-03-10 12:07-06', '2026-03-10 12:20-06', '2026-03-10 12:30-06', NULL),
(9, 8, 18, 'online', 'entregado', 35.00, 35.00, '2026-03-10 12:15-06', '2026-03-10 12:17-06', '2026-03-10 12:30-06', '2026-03-10 12:40-06', NULL),
(1, 8, 18, 'mostrador', 'entregado', 24.00, 24.00, '2026-03-10 12:30-06', '2026-03-10 12:30-06', '2026-03-10 12:45-06', '2026-03-10 12:47-06', NULL),
(10, 9, 19, 'online', 'entregado', 40.00, 40.00, '2026-03-12 13:00-06', '2026-03-12 13:02-06', '2026-03-12 13:18-06', '2026-03-12 13:30-06', NULL),
(11, 9, 19, 'online', 'entregado', 52.00, 52.00, '2026-03-12 14:15-06', '2026-03-12 14:17-06', '2026-03-12 14:38-06', '2026-03-12 14:50-06', 'Extra picante'),
(12, 10, 20,'online', 'entregado', 33.00, 33.00, '2026-03-14 12:45-06', '2026-03-14 12:47-06', '2026-03-14 13:05-06', '2026-03-14 13:15-06', NULL),
(1, 10, 20,'mostrador', 'entregado', 42.00, 42.00, '2026-03-14 20:00-06', '2026-03-14 20:00-06', '2026-03-14 20:18-06', '2026-03-14 20:20-06', NULL),
(13, 11, 21,'online', 'entregado', 30.00, 30.00, '2026-03-16 12:30-06', '2026-03-16 12:32-06', '2026-03-16 12:45-06', '2026-03-16 12:55-06', NULL),
(14, 11, 21,'online', 'entregado', 50.00, 50.00, '2026-03-16 13:00-06', '2026-03-16 13:02-06', '2026-03-16 13:20-06', '2026-03-16 13:32-06', NULL),
(15, 12, 22,'online', 'entregado', 70.00, 70.00, '2026-03-18 13:30-06', '2026-03-18 13:33-06', '2026-03-18 14:00-06', '2026-03-18 14:10-06', 'Oficina'),
(16, 3, 23,'online', 'entregado', 40.00, 40.00, '2026-04-02 12:00-06', '2026-04-02 12:03-06', '2026-04-02 12:20-06', '2026-04-02 12:30-06', NULL),
(17, 3, 23,'online', 'entregado', 32.00, 32.00, '2026-04-02 13:15-06', '2026-04-02 13:17-06', '2026-04-02 13:32-06', '2026-04-02 13:40-06', NULL),
(1, 4, 24,'mostrador', 'entregado', 38.00, 38.00, '2026-04-03 19:30-06', '2026-04-03 19:30-06', '2026-04-03 19:50-06', '2026-04-03 19:52-06', NULL),
(18, 4, 24,'online', 'entregado', 45.00, 45.00, '2026-04-05 12:45-06', '2026-04-05 12:48-06', '2026-04-05 13:05-06', '2026-04-05 13:15-06', NULL),
(19, 5, 25,'online', 'entregado', 55.00, 55.00, '2026-04-08 13:00-06', '2026-04-08 13:03-06', '2026-04-08 13:22-06', '2026-04-08 13:35-06', 'Picante moderado'),
(20, 5, 25,'online', 'entregado', 28.00, 28.00, '2026-04-08 14:00-06', '2026-04-08 14:02-06', '2026-04-08 14:15-06', '2026-04-08 14:25-06', NULL),
(21, 6, 26,'online', 'entregado', 70.00, 70.00, '2026-04-10 12:30-06', '2026-04-10 12:33-06', '2026-04-10 13:00-06', '2026-04-10 13:10-06', NULL),
(22, 6, 26,'online', 'entregado', 35.00, 35.00, '2026-04-10 13:30-06', '2026-04-10 13:32-06', '2026-04-10 13:48-06', '2026-04-10 14:00-06', NULL),
(23, 7, NULL,'online', 'cancelado', 48.00, 48.00, '2026-04-12 12:00-06', NULL, NULL, NULL, 'Pago rechazado'),
(24, 7, 27,'online', 'finalizado',40.00, 40.00, '2026-04-20 12:30-06', '2026-04-20 12:32-06', '2026-04-20 12:50-06', NULL, NULL),
(25, 8, 27,'online', 'en_proceso',55.00, 55.00, '2026-04-22 12:15-06', '2026-04-22 12:17-06', NULL, NULL, 'Sin cebolla'),
(26, 8, NULL,'online', 'aprobado', 33.00, 33.00, '2026-04-22 12:45-06', '2026-04-22 12:47-06', NULL, NULL, NULL),
(27, 9, NULL,'online', 'pendiente', 22.00, 22.00, '2026-04-23 11:45-06', NULL, NULL, NULL, NULL),
(28, 9, NULL,'online', 'pendiente', 45.00, 45.00, '2026-04-23 12:00-06', NULL, NULL, NULL, NULL),
(1, 10, 28,'mostrador', 'en_proceso',30.00, 30.00, '2026-04-23 12:15-06', '2026-04-23 12:15-06', NULL, NULL, NULL),
(29, 10, NULL,'online', 'pendiente', 60.00, 60.00, '2026-04-23 12:30-06', NULL, NULL, NULL, 'Cumpleaños');

-- pedido_item
INSERT INTO pedido_item (id_pedido, id_producto, cantidad, precio_unitario, subtotal_linea) VALUES
(1, 1, 3, 12.00, 36.00),
(2, 2, 2, 14.00, 28.00),
(2, 13, 1, 8.00, 8.00),
(2, 15, 1, 5.00, 5.00),
(3, 2, 2, 14.00, 28.00),
(4, 19, 1, 40.00, 40.00),
(4, 1, 1, 12.00, 12.00),
(4, 15, 1, 7.00, 7.00),
(5, 19, 1, 40.00, 40.00),
(6, 5, 2, 11.00, 22.00),
(7, 2, 2, 14.00, 28.00),
(7, 16, 1, 2.00, 2.00),
(8, 21, 1, 40.00, 40.00),
(8, 3, 1, 13.00, 13.00),
(9, 20, 1, 130.00, 130.00),
(10, 24, 1, 18.00, 18.00),
(11, 22, 1, 35.00, 35.00),
(12, 1, 2, 12.00, 24.00),
(13, 19, 1, 40.00, 40.00),
(14, 11, 2, 18.00, 36.00),
(14, 13, 2, 8.00, 16.00),
(15, 5, 3, 11.00, 33.00),
(16, 2, 3, 14.00, 42.00),
(17, 6, 3, 10.00, 30.00),
(18, 8, 2, 17.00, 34.00),
(18, 14, 2, 8.00, 16.00),
(19, 1, 5, 12.00, 60.00),
(19, 13, 1, 8.00, 8.00),
(19, 16, 1, 2.00, 2.00),
(20, 19, 1, 40.00, 40.00),
(21, 3, 2, 13.00, 26.00),
(21, 5, 1, 6.00, 6.00),
(22, 1, 2, 12.00, 24.00),
(22, 12, 1, 14.00, 14.00),
(23, 11, 2, 18.00, 36.00),
(23, 13, 1, 8.00, 8.00),
(23, 17, 1, 4.00, 4.00),
(24, 19, 1, 40.00, 40.00),
(25, 2, 3, 14.00, 42.00),
(25, 14, 1, 8.00, 8.00),
(25, 15, 1, 5.00, 5.00),
(26, 5, 3, 11.00, 33.00),
(27, 5, 2, 11.00, 22.00),
(28, 22, 1, 35.00, 35.00),
(28, 24, 1, 10.00, 10.00),
(29, 1, 3, 12.00, 36.00),
(30, 20, 1, 60.00, 60.00);

-- pedido_item_modificacion
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 1, 'agregar', 'Extra queso fresco', 3.00
FROM pedido_item pi WHERE pi.id_pedido = 2 AND pi.id_producto = 2 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 4, 'agregar', 'Extra aguacate', 6.00
FROM pedido_item pi WHERE pi.id_pedido = 5 AND pi.id_producto = 19 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, NULL, 'quitar', 'Sin cilantro', 0.00
FROM pedido_item pi WHERE pi.id_pedido = 5 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 7, 'agregar', 'Salsa roja extra', 1.50
FROM pedido_item pi WHERE pi.id_pedido = 8 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 9, 'agregar', 'Chile habanero extra', 2.00
FROM pedido_item pi WHERE pi.id_pedido = 14 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 5, 'agregar', 'Extra cebolla', 1.00
FROM pedido_item pi WHERE pi.id_pedido = 15 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, NULL, 'quitar', 'Sin cebolla', 0.00
FROM pedido_item pi WHERE pi.id_pedido = 25 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 1, 'agregar', 'Extra queso fresco', 3.00
FROM pedido_item pi WHERE pi.id_pedido = 10 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 3, 'agregar', 'Extra crema', 2.50
FROM pedido_item pi WHERE pi.id_pedido = 11 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 13, 'agregar', 'Piña extra', 2.00
FROM pedido_item pi WHERE pi.id_pedido = 1 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 8, 'agregar', 'Salsa verde extra', 1.50
FROM pedido_item pi WHERE pi.id_pedido = 6 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 10, 'agregar', 'Limón extra', 1.00
FROM pedido_item pi WHERE pi.id_pedido = 17 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 2, 'agregar', 'Extra queso Oaxaca', 5.00
FROM pedido_item pi WHERE pi.id_pedido = 18 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, NULL, 'quitar', 'Sin picante', 0.00
FROM pedido_item pi WHERE pi.id_pedido = 19 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 14, 'agregar', 'Pico de gallo', 3.50
FROM pedido_item pi WHERE pi.id_pedido = 20 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 6, 'agregar', 'Extra cilantro', 1.00
FROM pedido_item pi WHERE pi.id_pedido = 9 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 15, 'agregar', 'Frijolitos de acompañamiento', 4.00
FROM pedido_item pi WHERE pi.id_pedido = 4 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 11, 'agregar', 'Tortilla de maíz extra', 2.00
FROM pedido_item pi WHERE pi.id_pedido = 12 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 1, 'agregar', 'Extra queso fresco', 3.00
FROM pedido_item pi WHERE pi.id_pedido = 22 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 4, 'agregar', 'Extra aguacate', 6.00
FROM pedido_item pi WHERE pi.id_pedido = 24 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, NULL, 'quitar', 'Sin salsa', 0.00
FROM pedido_item pi WHERE pi.id_pedido = 7 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 9, 'agregar', 'Chile habanero extra', 2.00
FROM pedido_item pi WHERE pi.id_pedido = 28 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 5, 'agregar', 'Extra cebolla', 1.00
FROM pedido_item pi WHERE pi.id_pedido = 26 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, 13, 'agregar', 'Piña extra', 2.00
FROM pedido_item pi WHERE pi.id_pedido = 29 LIMIT 1;
INSERT INTO pedido_item_modificacion (id_pedido_item, id_extra, tipo, descripcion, precio_extra)
SELECT pi.id_pedido_item, NULL, 'quitar', 'Sin piña', 0.00
FROM pedido_item pi WHERE pi.id_pedido = 13 LIMIT 1;

UPDATE pedido p
SET
    subtotal = resumen.total_items,
    total = resumen.total_items + resumen.total_extras
FROM (
    SELECT
        ped.id_pedido,
        COALESCE((
            SELECT ROUND(SUM(pi.subtotal_linea), 2)
            FROM pedido_item pi
            WHERE pi.id_pedido = ped.id_pedido
        ), 0) AS total_items,
        COALESCE((
            SELECT ROUND(SUM(pim.precio_extra), 2)
            FROM pedido_item pi
            JOIN pedido_item_modificacion pim ON pim.id_pedido_item = pi.id_pedido_item
            WHERE pi.id_pedido = ped.id_pedido
        ), 0) AS total_extras
    FROM pedido ped
    WHERE EXISTS (
        SELECT 1
        FROM pedido_item pi
        WHERE pi.id_pedido = ped.id_pedido
    )
) AS resumen
WHERE resumen.id_pedido = p.id_pedido;

-- pago
INSERT INTO pago (id_pedido, metodo, estado, monto, referencia_externa, fecha_intento, fecha_confirmacion, mensaje_error) VALUES
(1, 'tarjeta', 'pagado', 36.00, 'ref_001_VISA_4242', '2026-03-05 12:16-06', '2026-03-05 12:16-06', NULL),
(2, 'tarjeta', 'pagado', 41.00, 'ref_002_MC_5555', '2026-03-05 13:01-06', '2026-03-05 13:01-06', NULL),
(3, 'efectivo', 'pagado', 28.00, NULL, '2026-03-06 19:00-06', '2026-03-06 19:00-06', NULL),
(4, 'efectivo', 'pagado', 59.00, NULL, '2026-03-06 19:15-06', '2026-03-06 19:15-06', NULL),
(5, 'tarjeta', 'pagado', 40.00, 'ref_005_VISA_1111', '2026-03-07 12:32-06', '2026-03-07 12:32-06', NULL),
(6, 'tarjeta', 'pagado', 22.00, 'ref_006_VISA_2222', '2026-03-07 13:46-06', '2026-03-07 13:46-06', NULL),
(7, 'efectivo', 'pagado', 30.00, NULL, '2026-03-08 18:00-06', '2026-03-08 18:00-06', NULL),
(8, 'tarjeta', 'pagado', 53.00, 'ref_008_MC_3333', '2026-03-08 19:31-06', '2026-03-08 19:31-06', NULL),
(9, 'tarjeta', 'pagado', 130.00, 'ref_009_VISA_4444', '2026-03-10 12:02-06', '2026-03-10 12:02-06', NULL),
(10, 'tarjeta', 'pagado', 18.00, 'ref_010_VISA_5555', '2026-03-10 12:06-06', '2026-03-10 12:06-06', NULL),
(11, 'tarjeta', 'pagado', 35.00, 'ref_011_MC_6666', '2026-03-10 12:16-06', '2026-03-10 12:16-06', NULL),
(12, 'efectivo', 'pagado', 24.00, NULL, '2026-03-10 12:30-06', '2026-03-10 12:30-06', NULL),
(13, 'tarjeta', 'pagado', 40.00, 'ref_013_VISA_7777', '2026-03-12 13:01-06', '2026-03-12 13:01-06', NULL),
(14, 'tarjeta', 'pagado', 52.00, 'ref_014_AMEX_8888', '2026-03-12 14:16-06', '2026-03-12 14:16-06', NULL),
(15, 'tarjeta', 'pagado', 33.00, 'ref_015_VISA_9999', '2026-03-14 12:46-06', '2026-03-14 12:46-06', NULL),
(16, 'efectivo', 'pagado', 42.00, NULL, '2026-03-14 20:00-06', '2026-03-14 20:00-06', NULL),
(17, 'tarjeta', 'pagado', 30.00, 'ref_017_MC_1010', '2026-03-16 12:31-06', '2026-03-16 12:31-06', NULL),
(18, 'tarjeta', 'pagado', 50.00, 'ref_018_VISA_2020', '2026-03-16 13:01-06', '2026-03-16 13:01-06', NULL),
(19, 'tarjeta', 'pagado', 70.00, 'ref_019_MC_3030', '2026-03-18 13:32-06', '2026-03-18 13:32-06', NULL),
(20, 'tarjeta', 'pagado', 40.00, 'ref_020_VISA_4040', '2026-04-02 12:02-06', '2026-04-02 12:02-06', NULL),
(21, 'tarjeta', 'pagado', 32.00, 'ref_021_VISA_5050', '2026-04-02 13:16-06', '2026-04-02 13:16-06', NULL),
(22, 'efectivo', 'pagado', 38.00, NULL, '2026-04-03 19:30-06', '2026-04-03 19:30-06', NULL),
(23, 'tarjeta', 'pagado', 45.00, 'ref_023_MC_6060', '2026-04-05 12:47-06', '2026-04-05 12:47-06', NULL),
(24, 'tarjeta', 'pagado', 55.00, 'ref_024_VISA_7070', '2026-04-08 13:02-06', '2026-04-08 13:02-06', NULL),
(25, 'tarjeta', 'pagado', 28.00, 'ref_025_VISA_8080', '2026-04-08 14:01-06', '2026-04-08 14:01-06', NULL),
(26, 'tarjeta', 'pagado', 70.00, 'ref_026_MC_9090', '2026-04-10 12:32-06', '2026-04-10 12:32-06', NULL),
(27, 'tarjeta', 'pagado', 35.00, 'ref_027_VISA_1122', '2026-04-10 13:31-06', '2026-04-10 13:31-06', NULL),
(28, 'tarjeta', 'fallido', 48.00, 'ref_028_VISA_DECL', '2026-04-12 12:01-06', NULL, 'Tarjeta rechazada por el banco emisor'),
(29, 'tarjeta', 'pagado', 40.00, 'ref_029_VISA_3344', '2026-04-20 12:31-06', '2026-04-20 12:31-06', NULL),
(30, 'tarjeta', 'pagado', 55.00, 'ref_030_MC_5566', '2026-04-22 12:16-06', '2026-04-22 12:16-06', NULL),
(31, 'tarjeta', 'pagado', 33.00, 'ref_031_VISA_7788', '2026-04-22 12:46-06', '2026-04-22 12:46-06', NULL),
(32, 'tarjeta', 'pendiente', 22.00, NULL, '2026-04-23 11:45-06', NULL, NULL),
(33, 'tarjeta', 'pendiente', 45.00, NULL, '2026-04-23 12:00-06', NULL, NULL),
(34, 'efectivo', 'pagado', 30.00, NULL, '2026-04-23 12:15-06', '2026-04-23 12:15-06', NULL),
(35, 'tarjeta', 'pendiente', 60.00, NULL, '2026-04-23 12:30-06', NULL, NULL);

UPDATE pago pg
SET monto = p.total
FROM pedido p
WHERE p.id_pedido = pg.id_pedido;

-- movimiento_inventario
INSERT INTO movimiento_inventario (id_insumo, id_empleado, id_compra_insumo, tipo, cantidad, motivo, fecha) VALUES
(1, 1, 1, 'entrada', 15000, 'Compra a Carnicería Don Beto', '2026-03-01 08:30-06'),
(2, 1, 1, 'entrada', 12000, 'Compra a Carnicería Don Beto', '2026-03-01 08:30-06'),
(3, 1, 1, 'entrada', 5000, 'Compra a Carnicería Don Beto', '2026-03-01 08:30-06'),
(5, 1, 2, 'entrada', 1500, 'Compra a Tortillería La Abuela', '2026-03-01 09:15-06'),
(6, 1, 2, 'entrada', 1000, 'Compra a Tortillería La Abuela', '2026-03-01 09:15-06'),
(9, 1, 3, 'entrada', 5000, 'Compra a Verduras Frescas Xela', '2026-03-02 08:00-06'),
(10, 1, 3, 'entrada', 2000, 'Compra a Verduras Frescas Xela', '2026-03-02 08:00-06'),
(11, 1, 3, 'entrada', 6000, 'Compra a Verduras Frescas Xela', '2026-03-02 08:00-06'),
(13, 2, 4, 'entrada', 3000, 'Compra a Lácteos San Miguel', '2026-03-03 08:30-06'),
(15, 2, 5, 'entrada', 3000, 'Compra a Salsas La Picante', '2026-03-03 10:15-06'),
(1, 1, 6, 'entrada', 18000, 'Compra semanal', '2026-03-08 08:30-06'),
(2, 1, 6, 'entrada', 10000, 'Compra semanal', '2026-03-08 08:30-06'),
(5, 1, 7, 'entrada', 1500, 'Compra tortillas', '2026-03-08 09:15-06'),
(18, 2, 8, 'entrada', 5000, 'Compra bebidas', '2026-03-09 11:15-06'),
(20, 2, 8, 'entrada', 100, 'Compra coca-cola', '2026-03-09 11:15-06');
INSERT INTO movimiento_inventario (id_insumo, id_empleado, id_pedido, tipo, cantidad, motivo, fecha) VALUES
(2, 13, 1, 'salida', 240, 'Venta pedido #1', '2026-03-05 12:35-06'),
(5, 13, 1, 'salida', 6, 'Venta pedido #1', '2026-03-05 12:35-06'),
(1, 13, 2, 'salida', 180, 'Venta pedido #2', '2026-03-05 13:18-06'),
(5, 13, 2, 'salida', 4, 'Venta pedido #2', '2026-03-05 13:18-06'),
(18, 13, 2, 'salida', 100, 'Venta pedido #2', '2026-03-05 13:18-06'),
(1, 14, 3, 'salida', 180, 'Venta mostrador pedido #3', '2026-03-06 19:10-06'),
(5, 14, 3, 'salida', 4, 'Venta mostrador pedido #3', '2026-03-06 19:10-06'),
(2, 14, 4, 'salida', 320, 'Venta mostrador pedido #4', '2026-03-06 19:30-06'),
(5, 14, 4, 'salida', 8, 'Venta mostrador pedido #4', '2026-03-06 19:30-06'),
(18, 14, 4, 'salida', 100, 'Venta mostrador pedido #4', '2026-03-06 19:30-06'),
(20, 14, 4, 'salida', 1, 'Venta mostrador pedido #4', '2026-03-06 19:30-06'),
(2, 15, 5, 'salida', 240, 'Venta pedido #5', '2026-03-07 12:55-06'),
(30, 15, 6, 'salida', 160, 'Venta pedido #6', '2026-03-07 14:00-06'),
(1, 16, 7, 'salida', 180, 'Venta pedido #7', '2026-03-08 18:15-06'),
(2, 17, 9, 'salida', 400, 'Venta pedido #9 combo familiar', '2026-03-10 12:40-06'),
(1, 18, 12,'salida', 180, 'Venta pedido #12', '2026-03-10 12:45-06'),
(2, 20, 15,'salida', 240, 'Venta pedido #15', '2026-03-14 13:05-06');
INSERT INTO movimiento_inventario (id_insumo, id_empleado, tipo, cantidad, motivo, fecha) VALUES
(10, 1, 'ajuste', 150, 'Merma cilantro echado a perder', '2026-03-15 22:00-06'),
(26, 1, 'ajuste', 200, 'Piña madurada en exceso, descarte','2026-04-01 20:00-06'),
(4, 2, 'ajuste', 100, 'Corte de inventario mensual', '2026-04-15 21:00-06');
COMMIT;
DO $$ BEGIN RAISE NOTICE 'Datos de prueba cargados exitosamente.'; END $$;
