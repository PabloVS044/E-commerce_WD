\set ON_ERROR_STOP on

\echo Inicializando esquema de Tacos El Pepe...
\i /docker-entrypoint-initdb.d/sql/estructura_bd.sql
\i /docker-entrypoint-initdb.d/sql/indices.sql
\i /docker-entrypoint-initdb.d/sql/views.sql
\i /docker-entrypoint-initdb.d/sql/datos_prueba.sql
