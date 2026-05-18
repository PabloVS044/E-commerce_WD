const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const ENV_CANDIDATES = [
  path.join(__dirname, '../../.env'),
  path.join(__dirname, '../../../.env'),
];

function loadBackendEnv() {
  for (const envPath of ENV_CANDIDATES) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      return envPath;
    }
  }

  dotenv.config();
  return null;
}

module.exports = {
  loadBackendEnv,
};
