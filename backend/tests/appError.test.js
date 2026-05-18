const test = require('node:test');
const assert = require('node:assert/strict');
const { AppError, isAppError } = require('../src/utils/appError');

test('AppError conserva status y mensaje', () => {
  const error = new AppError(422, 'Payload invalido');

  assert.equal(error.status, 422);
  assert.equal(error.message, 'Payload invalido');
});

test('isAppError distingue errores de aplicacion', () => {
  assert.equal(isAppError(new AppError(404, 'No encontrado')), true);
  assert.equal(isAppError(new Error('Genérico')), false);
});
