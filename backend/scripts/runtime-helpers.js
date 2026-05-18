const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { buildDbConfig } = require('../src/config/dbConfig');

const DEFAULT_EMPLOYEE_PASSWORD = 'admin123';
const DEFAULT_MAX_ATTEMPTS = 30;
const DEFAULT_RETRY_MS = 2000;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function buildConnectionConfig() {
  return buildDbConfig();
}

async function createReadyClient(options = {}) {
  const maxAttempts = options.maxAttempts || DEFAULT_MAX_ATTEMPTS;
  const retryMs = options.retryMs || DEFAULT_RETRY_MS;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const client = new Client(buildConnectionConfig());

    try {
      await client.connect();
      const result = await client.query('SELECT COUNT(*)::int AS total FROM empleado');
      const total = Number(result.rows[0]?.total || 0);

      if (total > 0) {
        return client;
      }

      console.log(`BD conectada, esperando datos semilla (intento ${attempt}/${maxAttempts})...`);
    } catch (error) {
      lastError = error;
      console.log(`Esperando base de datos (intento ${attempt}/${maxAttempts}): ${error.message}`);
    }

    await client.end().catch(() => {});

    if (attempt < maxAttempts) {
      await delay(retryMs);
    }
  }

  throw lastError || new Error('No se pudo preparar la base de datos.');
}

async function syncEmployeePasswords(client, { forceAll = false, password = DEFAULT_EMPLOYEE_PASSWORD } = {}) {
  const result = forceAll
    ? await client.query('SELECT id_empleado FROM empleado ORDER BY id_empleado')
    : await client.query(`
        SELECT id_empleado
        FROM empleado
        WHERE password_hash IS NULL
           OR length(password_hash) <> 60
        ORDER BY id_empleado
      `);

  const ids = result.rows.map((row) => Number(row.id_empleado));

  if (ids.length === 0) {
    return 0;
  }

  const hash = await bcrypt.hash(password, 10);
  await client.query(
    'UPDATE empleado SET password_hash = $1 WHERE id_empleado = ANY($2::int[])',
    [hash, ids]
  );

  return ids.length;
}

module.exports = {
  DEFAULT_EMPLOYEE_PASSWORD,
  buildConnectionConfig,
  createReadyClient,
  syncEmployeePasswords,
};
