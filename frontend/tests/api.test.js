import { describe, expect, it } from 'vitest';
import { normalizeApiBase } from '../src/api/api';

describe('normalizeApiBase', () => {
  it('mantiene /api para desarrollo local por defecto', () => {
    expect(normalizeApiBase()).toBe('/api');
    expect(normalizeApiBase('/api')).toBe('/api');
  });

  it('agrega /api cuando la variable apunta al host del backend sin path', () => {
    expect(normalizeApiBase('https://e-commerce-wd-backend.vercel.app'))
      .toBe('https://e-commerce-wd-backend.vercel.app/api');
  });

  it('respeta un backend externo ya configurado con /api', () => {
    expect(normalizeApiBase('https://e-commerce-wd-backend.vercel.app/api/'))
      .toBe('https://e-commerce-wd-backend.vercel.app/api');
  });
});
