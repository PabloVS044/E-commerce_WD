const pool = require('../config/db');
const queries = require('../queries/authQueries');

async function findActiveEmployeeByEmail(email, executor = pool) {
  const result = await executor.query(queries.findActiveEmployeeByEmail, [email]);
  return result.rows[0] || null;
}

module.exports = {
  findActiveEmployeeByEmail,
};
