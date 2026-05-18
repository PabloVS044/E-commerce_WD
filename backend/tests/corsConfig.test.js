const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const {
  getAllowedOrigins,
  isAllowedOrigin,
  normalizeOrigin,
} = require('../src/config/cors');

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

test('normalizeOrigin elimina slash final', () => {
  assert.equal(normalizeOrigin('https://e-commerce-wd.vercel.app/'), 'https://e-commerce-wd.vercel.app');
});

test('getAllowedOrigins soporta FRONTEND_URL sin slash final', () => {
  process.env.FRONTEND_URL = 'https://e-commerce-wd.vercel.app/';
  assert.deepEqual(getAllowedOrigins(), ['https://e-commerce-wd.vercel.app']);
});

test('isAllowedOrigin compara origins normalizados', () => {
  assert.equal(
    isAllowedOrigin('https://e-commerce-wd.vercel.app', ['https://e-commerce-wd.vercel.app']),
    true
  );
  assert.equal(
    isAllowedOrigin('https://e-commerce-wd.vercel.app/', ['https://e-commerce-wd.vercel.app']),
    true
  );
});
