import { useEffect, useState } from 'react';
import Icon from './Icon';
import { getProductGlyph } from '../utils/catalog';

export default function ProductImage({
  product = {},
  src,
  alt,
  className = '',
  imageClassName = 'h-full w-full object-cover',
  iconClassName = 'h-8 w-8',
  fallbackClassName = 'text-[var(--brand)]',
}) {
  const initialSource = String(src || product.imagen_url || '').trim();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [initialSource]);

  const safeSource = hasError ? '' : initialSource;
  const label = alt || product.nombre || 'Producto';

  return (
    <div className={`overflow-hidden bg-[var(--app-surface-soft)] ${className}`.trim()}>
      {safeSource ? (
        <img
          src={safeSource}
          alt={label}
          className={imageClassName}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${fallbackClassName}`.trim()}>
          <Icon name={getProductGlyph(product)} className={iconClassName} />
        </div>
      )}
    </div>
  );
}
