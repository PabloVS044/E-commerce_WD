import { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import { getProductGlyph } from '../utils/catalog';
import { formatMoney } from '../utils/orders';

function QuantityButton({ children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function ProductCustomizer({
  product,
  open,
  title = 'Personaliza tu pedido',
  submitLabel = 'Agregar al pedido',
  initialConfig = null,
  onClose,
  onSubmit,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [extraCounts, setExtraCounts] = useState({});

  useEffect(() => {
    if (!open || !product) {
      return;
    }

    const quantity = Math.max(1, Number.parseInt(initialConfig?.cantidad, 10) || 1);
    const removals = Array.isArray(initialConfig?.removals)
      ? initialConfig.removals
          .map((removal) => Number(removal.id_insumo))
          .filter((idInsumo) => Number.isInteger(idInsumo) && idInsumo > 0)
      : [];
    const extras = Array.isArray(initialConfig?.extras)
      ? initialConfig.extras.reduce((acc, extra) => {
          const idExtra = Number(extra.id_extra);
          const cantidad = Math.max(1, Number.parseInt(extra.cantidad, 10) || 1);

          if (Number.isInteger(idExtra) && idExtra > 0) {
            acc[idExtra] = cantidad;
          }

          return acc;
        }, {})
      : {};

    setQuantity(quantity);
    setSelectedRemovals(removals);
    setExtraCounts(extras);
  }, [initialConfig, open, product]);

  const selectedExtras = useMemo(() => (
    (product?.extras_disponibles || [])
      .map((extra) => ({
        ...extra,
        cantidad: extraCounts[extra.id_extra] || 0,
      }))
      .filter((extra) => extra.cantidad > 0)
  ), [extraCounts, product]);

  const unitExtrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + (Number(extra.precio || 0) * extra.cantidad),
    0
  );
  const unitTotal = Number(product?.precio || 0) + unitExtrasTotal;
  const lineTotal = unitTotal * quantity;

  if (!open || !product) {
    return null;
  }

  const removableIngredients = product.ingredientes_removibles || [];
  const availableExtras = product.extras_disponibles || [];
  const components = product.componentes || [];
  const hasCustomization = removableIngredients.length > 0 || availableExtras.length > 0;

  const toggleRemoval = (idInsumo) => {
    setSelectedRemovals((current) => (
      current.includes(idInsumo)
        ? current.filter((value) => value !== idInsumo)
        : [...current, idInsumo]
    ));
  };

  const setExtraQuantity = (extraId, nextQuantity) => {
    setExtraCounts((current) => {
      if (nextQuantity <= 0) {
        const { [extraId]: removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [extraId]: nextQuantity,
      };
    });
  };

  const handleSubmit = () => {
    onSubmit({
      cantidad: quantity,
      removals: selectedRemovals.map((id_insumo) => ({ id_insumo })),
      extras: selectedExtras.map((extra) => ({
        id_extra: extra.id_extra,
        cantidad: extra.cantidad,
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-stretch justify-end bg-[rgba(22,15,15,0.52)] backdrop-blur-sm">
      <button type="button" className="flex-1 cursor-default" aria-label="Cerrar personalización" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[32rem] flex-col overflow-hidden border-l border-[var(--app-border)] bg-[linear-gradient(180deg,#fff_0%,#fcf7f6_100%)] shadow-[-18px_0_42px_rgba(17,10,10,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--app-border)] px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <div className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
              {title}
            </div>
            <h2 className="mt-2 text-[1.65rem] font-extrabold leading-tight text-[var(--app-text)]">
              {product.nombre}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">
              {product.descripcion || 'Personaliza la cantidad y los cambios antes de agregarlo.'}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white text-xl text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            onClick={onClose}
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="surface-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--app-surface-soft)] text-4xl text-[var(--brand)]">
                  <Icon name={getProductGlyph(product)} className="h-9 w-9" />
                </span>
                <div>
                  <div className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                    {product.categoria}
                  </div>
                  <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                    {product.es_combo ? 'Combo compuesto' : 'Producto individual'}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--app-border)] bg-white px-4 py-3 text-right">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                  Base
                </div>
                <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">
                  {formatMoney(product.precio)}
                </div>
              </div>
            </div>

            {!product.can_order && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Este producto no tiene stock suficiente en este momento.
              </div>
            )}
          </div>

          {components.length > 0 && (
            <section className="surface-card p-4">
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Incluye
              </div>
              <div className="mt-3 grid gap-2">
                {components.map((component) => (
                  <div key={`${product.id_producto}-${component.id_producto}`} className="surface-panel flex items-center justify-between px-3 py-3">
                    <span className="font-semibold text-[var(--app-text)]">{component.nombre}</span>
                    <span className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-sm font-semibold text-[var(--brand)]">
                      x{component.cantidad}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {removableIngredients.length > 0 && (
            <section className="surface-card p-4">
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Quitar ingredientes
              </div>
              <div className="mt-3 grid gap-2">
                {removableIngredients.map((ingredient) => {
                  const active = selectedRemovals.includes(ingredient.id_insumo);

                  return (
                    <button
                      key={ingredient.id_insumo}
                      type="button"
                      className={[
                        'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
                        active
                          ? 'border-[var(--brand)] bg-[rgba(114,14,16,0.06)] text-[var(--brand)]'
                          : 'border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-[var(--brand)]',
                      ].join(' ')}
                      onClick={() => toggleRemoval(ingredient.id_insumo)}
                    >
                      <span className="font-semibold">Sin {ingredient.nombre}</span>
                      <Icon name={active ? 'checkFilled' : 'circle'} className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {availableExtras.length > 0 && (
            <section className="surface-card p-4">
              <div className="text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Extras disponibles
              </div>
              <div className="mt-3 grid gap-3">
                {availableExtras.map((extra) => {
                  const currentQuantity = extraCounts[extra.id_extra] || 0;

                  return (
                    <div key={extra.id_extra} className="surface-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-[var(--app-text)]">{extra.nombre}</div>
                        <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                          {formatMoney(extra.precio)} por unidad
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <QuantityButton onClick={() => setExtraQuantity(extra.id_extra, currentQuantity - 1)} disabled={currentQuantity === 0}>
                          -
                        </QuantityButton>
                        <div className="min-w-[3rem] rounded-2xl border border-[var(--app-border)] bg-white px-3 py-2 text-center font-semibold text-[var(--app-text)]">
                          {currentQuantity}
                        </div>
                        <QuantityButton onClick={() => setExtraQuantity(extra.id_extra, currentQuantity + 1)}>
                          +
                        </QuantityButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!hasCustomization && components.length === 0 && (
            <section className="surface-card p-4 text-sm leading-6 text-[var(--app-text-muted)]">
              Este producto no tiene cambios opcionales en el modelo actual. Solo ajusta la cantidad y agrégalo al pedido.
            </section>
          )}
        </div>

        <div className="border-t border-[var(--app-border)] bg-white px-5 py-5 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Cantidad
              </div>
              <div className="mt-2 flex items-center gap-2">
                <QuantityButton onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  -
                </QuantityButton>
                <div className="min-w-[3.5rem] rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-2 text-center text-lg font-bold text-[var(--app-text)]">
                  {quantity}
                </div>
                <QuantityButton onClick={() => setQuantity((current) => current + 1)}>
                  +
                </QuantityButton>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Total de la línea
              </div>
              <div className="mt-1 text-[1.9rem] font-extrabold leading-none text-[var(--brand)]">
                {formatMoney(lineTotal)}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <button
              type="button"
              className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-[var(--app-border-strong)] bg-white px-5 text-sm font-semibold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[var(--brand)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSubmit}
              disabled={!product.can_order}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
