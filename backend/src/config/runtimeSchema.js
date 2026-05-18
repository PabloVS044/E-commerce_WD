const PRODUCT_IMAGE_COLUMNS = [
  'ALTER TABLE producto ADD COLUMN IF NOT EXISTS imagen_url TEXT',
  'ALTER TABLE producto ADD COLUMN IF NOT EXISTS imagen_public_id VARCHAR(255)',
];

async function ensureRuntimeSchema(executor) {
  for (const statement of PRODUCT_IMAGE_COLUMNS) {
    await executor.query(statement);
  }
}

module.exports = {
  ensureRuntimeSchema,
};
