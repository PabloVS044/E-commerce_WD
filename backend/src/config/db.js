const { Pool } = require('pg');
const { buildDbConfig } = require('./dbConfig');

const pool = new Pool(buildDbConfig());

pool.on('error', (err) => {
  console.error('Error en el pool de conexiones:', err.message);
});

module.exports = pool;
