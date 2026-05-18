import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import LoadingScreen from '../../components/LoadingScreen';
import { useCustomerUi } from '../../context/CustomerUiContext';
import { getProductGlyph } from '../../utils/catalog';
import { formatMoney, summarizeCartLine } from '../../utils/orders';

const EMPTY_FORM = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  direccion: '',
  referencia: '',
  metodo_pago: 'efectivo',
};

export default function ClientCheckout() {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    total,
    hasBlockedItems,
    loadingCatalog,
    updateCartItem,
    removeCartItem,
    placeOrder,
  } = useCustomerUi();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.cantidad, 0),
    [cartItems]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!cartItems.length) {
      setError('Agrega al menos un producto antes de confirmar.');
      return;
    }

    if (hasBlockedItems) {
      setError('Hay productos sin stock suficiente en tu carrito.');
      return;
    }

    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError('Nombre y teléfono son obligatorios.');
      return;
    }

    setSubmitting(true);

    try {
      const order = await placeOrder({
        ...form,
        notas: form.referencia,
      });
      navigate(`/cliente/seguimiento?codigo=${order.codigo}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCatalog) {
    return <LoadingScreen label="Preparando checkout..." />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcf9f8_0%,#f5efed_100%)] py-4">
      <div className="container">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="small text-uppercase text-muted fw-semibold">Checkout</div>
            <h1 className="mb-0 text-[clamp(2rem,6vw,2.85rem)] font-extrabold leading-tight text-brand">
              Confirma tu pedido
            </h1>
          </div>
          <Link to="/" className="btn btn-brand-outline w-100 sm:w-auto">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)]">
          <div className="min-w-0">
            <div className="surface-card p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="small text-uppercase text-muted fw-semibold">Resumen</div>
                  <h2 className="h4 mb-0">Productos seleccionados</h2>
                </div>
                <span className="badge rounded-pill soft-secondary px-3 py-2">
                  {itemCount} artículos
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <div className="fs-2 mb-2"><Icon name="bag" className="mx-auto h-8 w-8" /></div>
                  <p className="fw-semibold mb-2">Tu carrito está vacío</p>
                  <p className="text-muted mb-3">Vuelve al menú para elegir algo del catálogo.</p>
                  <Link to="/" className="btn btn-brand">Ir al menú</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const selections = summarizeCartLine(item);

                    return (
                      <div key={item.key} className="surface-panel p-3 sm:p-4">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div className="flex min-w-0 gap-3">
                            <div className="product-icon shrink-0 text-[var(--brand)]">
                              <Icon name={getProductGlyph(item)} className="h-8 w-8" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--app-text)]">{item.nombre}</div>
                              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                                {item.descripcion || 'Pedido preparado según tu selección.'}
                              </div>
                              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                                {formatMoney(item.unit_total)} por unidad
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
                            </div>
                          </div>

                          <div className="text-end sm:shrink-0">
                            <div className="font-bold text-brand">{formatMoney(item.subtotal)}</div>
                            <div className="mt-3 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                onClick={() => updateCartItem(item.key, item.cantidad - 1)}
                              >
                                -
                              </button>
                              <div className="min-w-[3rem] rounded-xl border border-[var(--app-border)] bg-white px-3 py-2 text-center font-semibold text-[var(--app-text)]">
                                {item.cantidad}
                              </div>
                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                onClick={() => updateCartItem(item.key, item.cantidad + 1)}
                              >
                                +
                              </button>
                              <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
                                onClick={() => removeCartItem(item.key)}
                              >
                                <Icon name="trash" className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="surface-card p-4 sm:p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="small text-uppercase text-muted fw-semibold">Datos del pedido</div>
                  <h2 className="h4 mb-0">Cliente y pago</h2>
                </div>
                <div className="product-icon text-[var(--brand)]">
                  <Icon name="receipt" className="h-8 w-8" />
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {hasBlockedItems && (
                <div className="alert alert-danger">
                  Hay productos sin stock suficiente en tu carrito. Ajusta el pedido antes de confirmar.
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="form-label">Nombre *</label>
                    <input
                      className="form-control"
                      value={form.nombre}
                      onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="form-label">Apellido</label>
                    <input
                      className="form-control"
                      value={form.apellido}
                      onChange={(event) => setForm((current) => ({ ...current, apellido: event.target.value }))}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="form-label">Teléfono *</label>
                    <input
                      className="form-control"
                      value={form.telefono}
                      onChange={(event) => setForm((current) => ({ ...current, telefono: event.target.value }))}
                      placeholder="502..."
                    />
                  </div>
                  <div>
                    <label className="form-label">Correo</label>
                    <input
                      className="form-control"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Dirección o referencia</label>
                  <input
                    className="form-control"
                    value={form.direccion}
                    onChange={(event) => setForm((current) => ({ ...current, direccion: event.target.value }))}
                    placeholder="Sucursal, dirección o punto de referencia"
                  />
                </div>

                <div>
                  <label className="form-label">Notas del pedido</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={form.referencia}
                    onChange={(event) => setForm((current) => ({ ...current, referencia: event.target.value }))}
                    placeholder="Ej. poca salsa, para llevar, entregar en mostrador..."
                  />
                </div>

                <div>
                  <label className="form-label">Método de pago</label>
                  <select
                    className="form-select"
                    value={form.metodo_pago}
                    onChange={(event) => setForm((current) => ({ ...current, metodo_pago: event.target.value }))}
                  >
                    <option value="efectivo">Efectivo al recoger</option>
                    <option value="tarjeta">Tarjeta en local</option>
                  </select>
                </div>

                <div className="surface-panel p-3">
                  <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm text-[var(--app-text-muted)]">
                    <span>Artículos</span>
                    <span>{itemCount}</span>
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[1.05rem] font-bold text-[var(--app-text)]">
                    <span>Total</span>
                    <span>{formatMoney(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-brand btn-lg"
                  disabled={submitting || !cartItems.length || hasBlockedItems}
                >
                  {submitting ? 'Confirmando...' : 'Confirmar pedido'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
