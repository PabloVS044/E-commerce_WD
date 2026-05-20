-- Migración: agrega soporte de imagen a productos terminados.
-- Ejecutar en Neon (producción) o en la BD local ya inicializada.
-- Idempotente: usa IF NOT EXISTS para no fallar si ya existe.

ALTER TABLE producto
  ADD COLUMN IF NOT EXISTS imagen_url        VARCHAR(500),
  ADD COLUMN IF NOT EXISTS imagen_public_id  VARCHAR(255);
