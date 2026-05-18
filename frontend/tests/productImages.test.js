import { describe, expect, it } from 'vitest';
import { validateProductImageFile } from '../src/utils/productImages';

describe('validateProductImageFile', () => {
  it('acepta formatos soportados dentro del límite', () => {
    const file = {
      type: 'image/png',
      size: 1024,
    };

    expect(validateProductImageFile(file)).toBe('');
  });

  it('rechaza formatos no soportados', () => {
    const file = {
      type: 'image/svg+xml',
      size: 1024,
    };

    expect(validateProductImageFile(file)).toBe('La imagen debe ser PNG, JPG, WEBP o GIF.');
  });

  it('rechaza archivos demasiado grandes', () => {
    const file = {
      type: 'image/jpeg',
      size: 5 * 1024 * 1024,
    };

    expect(validateProductImageFile(file)).toBe('La imagen supera el máximo permitido de 4 MB.');
  });
});
