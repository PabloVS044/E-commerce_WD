import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import StatusBadge from '../../components/StatusBadge';
import { useCustomerUi } from '../../context/CustomerUiContext';
import { formatMoney, ORDER_TIMELINE, summarizeOrderModifications } from '../../utils/orders';

function StepCard({ label, active }) {
  return (
    <div className={`rounded-3xl border p-3 ${active ? 'border-emerald-200 bg-emerald-50' : 'border-[var(--app-border)] bg-white'}`}>
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
        Etapa
      </div>
      <div className={`mt-1 font-semibold ${active ? 'text-emerald-700' : 'text-[var(--app-text-muted)]'}`}>
        {label.replaceAll('_', ' ')}
      </div>
    </div>
  );
}

export default function ClientTracking() {
  const [searchParams] = useSearchParams();
  const { latestOrderCode, fetchOrderByCode } = useCustomerUi();
  const defaultCode = searchParams.get('codigo') || latestOrderCode || '';

  const [inputCode, setInputCode] = useState(defaultCode);
  const [activeCode, setActiveCode] = useState(defaultCode);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(defaultCode));
  const [error, setError] = useState('');

  const currentStep = useMemo(
    () => (order ? ORDER_TIMELINE.indexOf(order.estado) : -1),
    [order]
  );

  const loadOrder = async (code) => {
    const trimmed = String(code || '').trim().toUpperCase();
    if (!trimmed) {
      setOrder(null);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetchOrderByCode(trimmed);
      setOrder(response);
    } catch (requestError) {
      setOrder(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder(activeCode);
  }, [activeCode]);

  useEffect(() => {
    if (!order || ['entregado', 'cancelado'].includes(order.estado)) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      loadOrder(activeCode);
    }, 15000);

    return () => window.clearInterval(timer);
  }, [activeCode, order]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcf9f8_0%,#f5efed_100%)] py-4">
      <div className="container">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="small text-uppercase text-muted fw-semibold">Seguimiento</div>
            <h1 className="mb-0 max-w-[14ch] text-[clamp(2rem,7vw,2.85rem)] font-extrabold leading-tight text-brand">
              Revisa el estado de tu pedido
            </h1>
          </div>
          <Link to="/" className="btn btn-brand-outline w-100 sm:w-auto">
            <Icon name="grid" className="h-4 w-4" />
            Volver al menú
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="surface-card p-4">
              <h2 className="h5 mb-3">Buscar pedido</h2>
              <form
                className="grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  setActiveCode(inputCode.trim().toUpperCase());
                }}
              >
                <div>
                  <label className="form-label">Código</label>
                  <input
                    className="form-control"
                    value={inputCode}
                    onChange={(event) => setInputCode(event.target.value.toUpperCase())}
                    placeholder="PEPE-000123"
                  />
                </div>
                <button type="submit" className="btn btn-brand" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar pedido'}
                </button>
              </form>

              {!activeCode && latestOrderCode && (
                <div className="mt-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm text-[var(--app-text-muted)]">
                  Último código registrado: <span className="font-semibold text-[var(--app-text)]">{latestOrderCode}</span>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            {!activeCode ? (
              <div className="surface-card p-5 empty-state">
                <div className="fs-2 mb-2"><Icon name="mapPin" className="mx-auto h-8 w-8" /></div>
                <p className="fw-semibold mb-2">Ingresa un código para consultar</p>
                <p className="text-muted mb-0">Después de confirmar tu pedido verás aquí el seguimiento.</p>
              </div>
            ) : loading ? (
              <div className="surface-card p-5 empty-state">
                <div className="fs-2 mb-2"><Icon name="clock" className="mx-auto h-8 w-8" /></div>
                <p className="fw-semibold mb-2">Consultando pedido...</p>
                <p className="text-muted mb-0">Estamos revisando el estado más reciente.</p>
              </div>
            ) : error ? (
              <div className="surface-card p-5 empty-state">
                <div className="fs-2 mb-2"><Icon name="mapPin" className="mx-auto h-8 w-8" /></div>
                <p className="fw-semibold mb-2">No encontramos ese pedido</p>
                <p className="text-muted mb-0">{error}</p>
              </div>
            ) : (
              <div className="surface-card p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="small text-uppercase text-muted fw-semibold">Código</div>
                    <div className="h3 mb-2">{order.codigo}</div>
                    <div className="text-muted">
                      Creado el {new Date(order.fecha_creacion).toLocaleString('es-GT')}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge value={order.estado} />
                    <StatusBadge value={order.pago?.estado} />
                  </div>
                </div>

                <div className="surface-panel p-3 mb-4">
                  <div className="grid gap-3 md:grid-cols-5">
                    {ORDER_TIMELINE.map((status, index) => (
                      <StepCard key={status} label={status} active={index <= currentStep} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Cliente
                    </div>
                    <div className="mt-1 font-semibold text-[var(--app-text)]">{order.cliente.nombre}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Canal
                    </div>
                    <div className="mt-1 font-semibold text-[var(--app-text)]">{order.canal}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Pago
                    </div>
                    <div className="mt-1 font-semibold text-[var(--app-text)]">{order.pago?.metodo || 'Sin definir'}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Total
                    </div>
                    <div className="mt-1 font-semibold text-[var(--brand)]">{formatMoney(order.total)}</div>
                  </div>
                </div>

                {order.notas && (
                  <div className="mt-4 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3 text-sm leading-6 text-[var(--app-text-muted)]">
                    <span className="font-semibold text-[var(--app-text)]">Notas:</span> {order.notas}
                  </div>
                )}

                <h2 className="mt-5 h5 mb-3">Detalle del pedido</h2>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const modifications = summarizeOrderModifications(item.modificaciones);

                    return (
                      <div key={item.id_pedido_item} className="surface-panel p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-[var(--app-text)]">{item.producto}</div>
                            <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                              {item.cantidad} x {formatMoney(item.precio_unitario)}
                            </div>
                            {modifications.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {modifications.map((entry) => (
                                  <span key={`${item.id_pedido_item}-${entry}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
                                    {entry}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-[var(--app-text)]">{formatMoney(item.total_linea)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="surface-panel w-full p-3 sm:w-auto" style={{ minWidth: 280 }}>
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm text-[var(--app-text-muted)]">
                      <span>Subtotal</span>
                      <span>{formatMoney(order.subtotal)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[1.05rem] font-bold text-[var(--app-text)]">
                      <span>Total</span>
                      <span>{formatMoney(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
