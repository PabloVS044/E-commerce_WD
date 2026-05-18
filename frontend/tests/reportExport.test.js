import { describe, expect, it } from 'vitest';
import { buildCsvRow, buildSectionedCsv } from '../src/utils/reportExport';

describe('reportExport helpers', () => {
  it('escapa correctamente comas y comillas en una fila CSV', () => {
    const row = buildCsvRow(['Combo "Premium"', 'Q1,250.00', '2']);

    expect(row).toBe('"Combo ""Premium""","Q1,250.00",2');
  });

  it('genera un CSV con varias secciones y encabezados', () => {
    const csv = buildSectionedCsv([
      {
        title: 'Ventas por producto',
        columns: [
          { key: 'producto', label: 'Producto' },
          { key: 'total', label: 'Total' },
        ],
        rows: [{ producto: 'Taco al pastor', total: 'Q55.00' }],
      },
      {
        title: 'Clientes frecuentes',
        columns: [{ key: 'cliente', label: 'Cliente' }],
        rows: [{ cliente: 'Ana Perez' }],
      },
    ]);

    expect(csv).toContain('Ventas por producto');
    expect(csv).toContain('Producto,Total');
    expect(csv).toContain('Taco al pastor,Q55.00');
    expect(csv).toContain('Clientes frecuentes');
  });
});
