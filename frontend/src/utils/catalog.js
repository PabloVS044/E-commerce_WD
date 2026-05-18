function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getProductGlyph(product = {}) {
  const text = normalize(`${product.categoria || ''} ${product.nombre || ''}`);

  if (text.includes('combo')) return 'box';
  if (text.includes('bebida') || text.includes('horchata') || text.includes('jamaica') || text.includes('coca') || text.includes('agua')) return 'cup';
  if (text.includes('postre') || text.includes('pastel') || text.includes('flan')) return 'gift';
  if (text.includes('quesadilla')) return 'squareCircle';
  if (text.includes('torta') || text.includes('sandwich')) return 'basket';
  if (text.includes('tostada')) return 'square';
  if (text.includes('pollo')) return 'circle';
  if (text.includes('res') || text.includes('bistec') || text.includes('carne')) return 'hexagon';
  if (text.includes('cerdo') || text.includes('pastor')) return 'triangle';

  return 'shop';
}
