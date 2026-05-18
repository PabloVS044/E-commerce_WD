const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const {
  getCloudinaryConfig,
  hasCloudinaryConfig,
  normalizeCloudinaryUploadPrefix,
} = require('../src/config/cloudinary');

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

test('normalizeCloudinaryUploadPrefix elimina slash final', () => {
  assert.equal(
    normalizeCloudinaryUploadPrefix('https://api-eu.cloudinary.com/'),
    'https://api-eu.cloudinary.com'
  );
});

test('hasCloudinaryConfig exige cloud name, api key y api secret', () => {
  process.env.CLOUDINARY_CLOUD_NAME = 'demo';
  process.env.CLOUDINARY_API_KEY = '123';
  delete process.env.CLOUDINARY_API_SECRET;

  assert.equal(hasCloudinaryConfig(), false);

  process.env.CLOUDINARY_API_SECRET = 'secret';
  assert.equal(hasCloudinaryConfig(), true);
});

test('getCloudinaryConfig aplica carpeta por defecto', () => {
  delete process.env.CLOUDINARY_PRODUCT_FOLDER;

  const config = getCloudinaryConfig();

  assert.equal(config.folder, 'tacos-el-pepe/productos');
});
