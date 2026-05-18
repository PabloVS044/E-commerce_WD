const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const { buildDbConfig } = require('../src/config/dbConfig');

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

test('buildDbConfig usa DATABASE_URL y activa SSL para Neon', () => {
  process.env.DATABASE_URL = 'postgresql://user:pass@ep-sample.us-east-1.aws.neon.tech/neondb?sslmode=require';

  const config = buildDbConfig();

  assert.equal(config.connectionString, process.env.DATABASE_URL);
  assert.deepEqual(config.ssl, { rejectUnauthorized: false });
});

test('buildDbConfig vuelve a host y puerto cuando DATABASE_URL no existe', () => {
  delete process.env.DATABASE_URL;
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5433';
  process.env.POSTGRES_DB = 'tacospepe';
  process.env.POSTGRES_USER = 'proy2';
  process.env.POSTGRES_PASSWORD = 'secret';

  const config = buildDbConfig();

  assert.equal(config.host, 'localhost');
  assert.equal(config.port, 5433);
  assert.equal(config.database, 'tacospepe');
  assert.equal(config.user, 'proy2');
});
