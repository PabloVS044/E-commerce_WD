const { URL } = require('url');

function shouldUseSslFromUrl(connectionString) {
  try {
    const parsed = new URL(connectionString);
    const sslMode = parsed.searchParams.get('sslmode');

    return sslMode === 'require' || parsed.hostname.endsWith('.neon.tech');
  } catch {
    return false;
  }
}

function buildDbConfig() {
  const connectionString = process.env.DATABASE_URL || '';

  if (connectionString) {
    const config = { connectionString };

    if (shouldUseSslFromUrl(connectionString)) {
      config.ssl = {
        rejectUnauthorized: false,
      };
    }

    return config;
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
}

module.exports = {
  buildDbConfig,
};
