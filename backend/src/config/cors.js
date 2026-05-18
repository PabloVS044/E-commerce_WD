function normalizeOrigin(origin = '') {
  return String(origin || '').trim().replace(/\/+$/, '');
}

function getAllowedOrigins() {
  const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';

  return rawOrigins
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
}

function isAllowedOrigin(requestOrigin, allowedOrigins = getAllowedOrigins()) {
  if (!requestOrigin) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(requestOrigin));
}

function createCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    credentials: true,
    origin(origin, callback) {
      if (isAllowedOrigin(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin no permitido: ${origin}`));
    },
  };
}

module.exports = {
  createCorsOptions,
  getAllowedOrigins,
  isAllowedOrigin,
  normalizeOrigin,
};
