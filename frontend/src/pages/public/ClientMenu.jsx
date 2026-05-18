import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import LoadingScreen from '../../components/LoadingScreen';
import ProductCustomizer from '../../components/ProductCustomizer';
import { useCustomerUi } from '../../context/CustomerUiContext';
import { getProductGlyph } from '../../utils/catalog';
import { formatMoney, summarizeCartLine } from '../../utils/orders';

function ProductCard({ product, onSelect }) {
  const shortageText = product.shortages?.[0]
    ? `Sin stock suficiente de ${product.shortages[0].nombre}`
    : 'No disponible en este momento';

  return (
    <button
      type="button"
      className={[
        'group flex min-h-[14.25rem] flex-col justify-between rounded-[1.5rem] border p-4 text-left shadow-[var(--shadow-soft)] transition',
        product.can_order
          ? 'border-[var(--app-border)] bg-white hover:-translate-y-0.5 hover:border-[var(--brand)] active:scale-[0.99]'
          : 'cursor-not-allowed border-red-200 bg-red-50/80 opacity-80',
      ].join(' ')}
      onClick={() => product.can_order && onSelect(product)}
      disabled={!product.can_order}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--app-surface-soft)] text-3xl text-[var(--brand)]">
            <Icon name={getProductGlyph(product)} className="h-8 w-8" />
          </span>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--app-text-muted)]">
              {product.categoria}
            </span>
            {product.es_combo && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-amber-700">
                Combo
              </span>
            )}
          </div>
        </div>

        <div className="text-[1.15rem] font-bold leading-[1.12] text-[var(--app-text)]">
          {product.nombre}
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">
          {product.descripcion || 'Disponible para pedir desde la terminal de cliente.'}
        </p>

        {product.componentes?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.componentes.slice(0, 3).map((component) => (
              <span key={`${product.id_producto}-${component.id_producto}`} className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
                {component.cantidad} x {component.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
            Precio
          </div>
          <div className="mt-1 text-[1.65rem] font-extrabold leading-none text-[var(--brand)]">
            {formatMoney(product.precio)}
          </div>
        </div>

        {product.can_order ? (
          <span className="inline-flex min-h-[3rem] items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 text-sm font-bold text-[var(--brand)] transition group-hover:border-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white">
            <Icon name="sliders" className="h-4 w-4" />
            Elegir
          </span>
        ) : (
          <span className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {shortageText}
          </span>
        )}
      </div>
    </button>
  );
}

export default function ClientMenu() {
  const {
    catalog,
    categories,
    loadingCatalog,
    catalogError,
    cartItems,
    cartCount,
    subtotal,
    total,
    hasBlockedItems,
    addConfiguredProduct,
    updateCartItem,
    removeCartItem,
    clearCart,
  } = useCustomerUi();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return catalog.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
      const matchesSearch = !normalizedSearch
        || product.nombre.toLowerCase().includes(normalizedSearch)
        || product.descripcion?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [catalog, search, selectedCategory]);

  if (loadingCatalog) {
    return <LoadingScreen label="Cargando menú del cliente..." />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcf9f8_0%,#f5efed_100%)]">
      <header className="sticky top-0 z-30 border-b border-[var(--app-border)] bg-white/95 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] text-xl text-white shadow-[var(--shadow-soft)]">
              <Icon name="shop" className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                Pedido autoservicio
              </div>
              <div className="text-xl font-extrabold text-[var(--brand)]">Tacos El Pepe</div>
            </div>
          </div>

          <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
            <Link to="/cliente/seguimiento" className="btn btn-brand-outline w-full sm:w-auto">
              <Icon name="mapPin" className="h-4 w-4" />
              Seguir pedido
            </Link>
            <Link to="/login" className="btn btn-brand-outline w-full sm:w-auto">
              <Icon name="lockUser" className="h-4 w-4" />
              Empleados
            </Link>
            <Link to="/cliente/checkout" className={`btn btn-brand w-full sm:w-auto ${cartCount === 0 || hasBlockedItems ? 'disabled pointer-events-none opacity-60' : ''}`}>
              <Icon name="bagCheck" className="h-4 w-4" />
              Ver carrito ({cartCount})
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-4 lg:py-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
              Menú digital
            </div>
            <h1 className="mt-1 text-[clamp(2rem,6vw,3.15rem)] font-extrabold leading-[0.98] text-[var(--brand)]">
              Toca un producto y arma tu pedido
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-text-muted)]">
              Selecciona, personaliza y confirma. El carrito se actualiza al instante con tu total real.
            </p>
          </div>
        </div>

        {catalogError && <div className="alert alert-danger">{catalogError}</div>}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <section className="min-w-0">
            <div className="surface-card p-4 sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                <div>
                  <div className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                    Buscar
                  </div>
                  <input
                    className="form-control form-control-lg mt-2"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Taco, bebida, combo..."
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[18rem]">
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Productos
                    </div>
                    <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{visibleProducts.length}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      En carrito
                    </div>
                    <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{cartCount}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Total
                    </div>
                    <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{formatMoney(total)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 -mx-1 overflow-x-auto pb-1">
                <div className="flex min-w-max gap-2 px-1">
                  {['Todos', ...categories].map((category) => {
                    const active = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        className={[
                          'inline-flex min-h-[3.15rem] items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                          active
                            ? 'border-[var(--brand)] bg-[var(--brand)] text-white shadow-[0_10px_24px_rgba(114,14,16,0.18)]'
                            : 'border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-[var(--brand)] hover:text-[var(--brand)]',
                        ].join(' ')}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5">
              {!visibleProducts.length ? (
                <div className="surface-card p-5">
                  <div className="empty-state">
                    <div className="fs-2 mb-2"><Icon name="grid3" className="mx-auto h-8 w-8" /></div>
                    <p className="mb-2 fw-semibold">No encontramos productos para este filtro</p>
                    <p className="mb-0 text-muted">Prueba otra categoría o cambia el texto de búsqueda.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id_producto} product={product} onSelect={setActiveProduct} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
            <div className="surface-card p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="small text-uppercase text-muted fw-semibold">Tu carrito</div>
                  <h2 className="h4 mb-0">{cartCount} artículos</h2>
                </div>
                {cartItems.length > 0 && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearCart}>
                    Vaciar
                  </button>
                )}
              </div>

              {hasBlockedItems && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Hay productos sin stock suficiente en tu carrito. Corrígelos antes de continuar.
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <div className="fs-2 mb-2"><Icon name="bag" className="mx-auto h-8 w-8" /></div>
                  <p className="mb-2 fw-semibold">Todavía no has agregado nada</p>
                  <p className="mb-0 text-muted">Toca un producto del menú para empezar.</p>
                </div>
              ) : (
                <>
                  <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const selections = summarizeCartLine(item);

                      return (
                        <div key={item.key} className="surface-panel px-3 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--app-text)]">{item.nombre}</div>
                              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                                {formatMoney(item.unit_total)} por unidad
                              </div>
                            </div>
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-[var(--app-text-muted)] transition hover:border-red-200 hover:text-red-700"
                              onClick={() => removeCartItem(item.key)}
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </div>

                          {selections.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selections.map((selection) => (
                                <span key={`${item.key}-${selection}`} className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
                                  {selection}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                onClick={() => updateCartItem(item.key, item.cantidad - 1)}
                              >
                                -
                              </button>
                              <div className="min-w-[3.25rem] rounded-xl border border-[var(--app-border)] bg-white px-4 py-2 text-center font-semibold text-[var(--app-text)]">
                                {item.cantidad}
                              </div>
                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                onClick={() => updateCartItem(item.key, item.cantidad + 1)}
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-[var(--app-text-muted)]">Subtotal</div>
                              <div className="font-bold text-[var(--app-text)]">{formatMoney(item.subtotal)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm text-[var(--app-text-muted)]">
                      <span>Artículos</span>
                      <span>{cartCount}</span>
                      <span>Subtotal</span>
                      <span>{formatMoney(subtotal)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[1.05rem] font-bold text-[var(--app-text)]">
                      <span>Total</span>
                      <span>{formatMoney(total)}</span>
                    </div>
                  </div>
                </>
              )}

              <Link
                to="/cliente/checkout"
                className={`btn btn-brand btn-lg mt-4 w-100 ${cartItems.length === 0 || hasBlockedItems ? 'disabled pointer-events-none opacity-60' : ''}`}
              >
                Continuar al checkout
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <ProductCustomizer
        product={activeProduct}
        open={Boolean(activeProduct)}
        title="Configura tu producto"
        submitLabel="Agregar al carrito"
        onClose={() => setActiveProduct(null)}
        onSubmit={(config) => {
          addConfiguredProduct(activeProduct, config);
          setActiveProduct(null);
        }}
      />
    </div>
  );
}
