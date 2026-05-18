import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import Icon from '../../components/Icon';
import LoadingScreen from '../../components/LoadingScreen';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import {
  formatMoney,
  getActionLabel,
  getAllowedTransitions,
  summarizeOrderModifications,
} from '../../utils/orders';

const STATUS_COLUMNS = [
  { key: 'pendiente', title: 'Pendientes', tone: 'text-amber-700 bg-amber-100' },
  { key: 'aprobado', title: 'Aprobados', tone: 'text-violet-700 bg-violet-100' },
  { key: 'en_proceso', title: 'En proceso', tone: 'text-sky-700 bg-sky-100' },
  { key: 'finalizado', title: 'Finalizados', tone: 'text-stone-700 bg-stone-200' },
  { key: 'entregado', title: 'Entregados', tone: 'text-emerald-700 bg-emerald-100' },
  { key: 'cancelado', title: 'Cancelados', tone: 'text-red-700 bg-red-100' },
];

function formatHour(value) {
  return new Date(value).toLocaleTimeString('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(value) {
  return new Date(value).toLocaleString('es-GT');
}

function canRunTransition(role, transition) {
  if (role === 'admin') {
    return true;
  }

  if (role === 'cocinero') {
    return ['en_proceso', 'finalizado'].includes(transition);
  }

  return ['aprobado', 'cancelado', 'en_proceso', 'finalizado', 'entregado'].includes(transition);
}

export default function OrdersBoard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [detailsById, setDetailsById] = useState({});
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const loadOrders = async ({ keepLoading = false } = {}) => {
    if (!keepLoading) {
      setLoading(true);
    }

    try {
      const response = await api.get('/pedidos?limit=120');
      setOrders(response.pedidos || []);
      setLastUpdate(new Date());
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      if (!keepLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      loadOrders({ keepLoading: true });
    }, 20000);

    return () => window.clearInterval(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return orders;
    }

    return orders.filter((order) => (
      String(order.id_pedido).includes(normalizedSearch)
      || String(order.codigo).toLowerCase().includes(normalizedSearch)
      || order.cliente?.toLowerCase().includes(normalizedSearch)
      || order.canal?.toLowerCase().includes(normalizedSearch)
      || order.estado_pedido?.toLowerCase().includes(normalizedSearch)
    ));
  }, [orders, search]);

  const ordersByStatus = useMemo(() => (
    STATUS_COLUMNS.map((column) => ({
      ...column,
      items: filteredOrders.filter((order) => order.estado_pedido === column.key),
    }))
  ), [filteredOrders]);

  const summary = useMemo(() => {
    const active = filteredOrders.filter((order) => !['entregado', 'cancelado'].includes(order.estado_pedido));
    const online = filteredOrders.filter((order) => order.canal?.toLowerCase() === 'online');
    const mostrador = filteredOrders.filter((order) => order.canal?.toLowerCase() === 'mostrador');
    const total = filteredOrders.reduce((acc, order) => acc + Number(order.total || 0), 0);

    return {
      active: active.length,
      online: online.length,
      mostrador: mostrador.length,
      total,
    };
  }, [filteredOrders]);

  const toggleDetails = async (orderId) => {
    if (detailsById[orderId]) {
      setDetailsById((current) => {
        const next = { ...current };
        delete next[orderId];
        return next;
      });
      return;
    }

    setDetailLoadingId(orderId);

    try {
      const response = await api.get(`/pedidos/${orderId}`);
      setDetailsById((current) => ({
        ...current,
        [orderId]: response.pedido,
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDetailLoadingId(null);
    }
  };

  const handleTransition = async (orderId, nextStatus) => {
    setActionLoading(`${orderId}-${nextStatus}`);
    setError('');

    try {
      const response = await api.patch(`/pedidos/${orderId}/estado`, { estado: nextStatus });
      setOrders((current) => current.map((order) => (
        order.id_pedido === orderId
          ? {
              ...order,
              estado_pedido: response.pedido.estado,
              allowed_transitions: getAllowedTransitions(response.pedido),
            }
          : order
      )));

      setDetailsById((current) => {
        if (!current[orderId]) {
          return current;
        }

        return {
          ...current,
          [orderId]: response.pedido,
        };
      });

      await loadOrders({ keepLoading: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return <LoadingScreen label="Cargando monitor de pedidos..." />;
  }

  return (
    <AppShell
      title="Monitor de pedidos"
      subtitle="Vista operativa para caja y cocina con cambio de estados, detalle y refresco automático."
      actions={(
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-[var(--app-border)] bg-white/90 px-4 py-3 text-sm text-[var(--app-text-muted)] shadow-[var(--shadow-soft)]">
            {lastUpdate
              ? `Actualizado ${lastUpdate.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}`
              : 'Sin actualización'}
          </div>
          <button
            type="button"
            className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(114,14,16,0.22)] transition hover:bg-[var(--brand-dark)]"
            onClick={() => loadOrders()}
          >
            Refrescar
          </button>
        </div>
      )}
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(24rem,0.8fr)]">
        <div className="surface-card p-4 sm:p-5">
          <label className="form-label text-muted small text-uppercase">Buscar pedido o cliente</label>
          <input
            className="form-control form-control-lg"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ej. PEPE-000123, Juan Pérez, online..."
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface-panel px-3 py-3">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Activos
              </div>
              <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{summary.active}</div>
            </div>
            <div className="surface-panel px-3 py-3">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Online
              </div>
              <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{summary.online}</div>
            </div>
            <div className="surface-panel px-3 py-3">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Mostrador
              </div>
              <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{summary.mostrador}</div>
            </div>
            <div className="surface-panel px-3 py-3">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                Importe visible
              </div>
              <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{formatMoney(summary.total)}</div>
            </div>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-5">
          <div className="small text-uppercase text-muted fw-semibold">Lectura rápida</div>
          <h2 className="h5 mt-2 mb-3">Pedidos por estado</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {ordersByStatus.map((column) => (
              <div key={column.key} className="surface-panel d-flex justify-content-between align-items-center gap-3 px-3 py-3">
                <div>
                  <div className="small text-uppercase text-muted">{column.title}</div>
                  <div className="fw-semibold">{column.items.length} pedidos</div>
                </div>
                <span className={`inline-flex min-h-[2.25rem] min-w-[2.25rem] items-center justify-center rounded-full px-3 text-sm font-bold ${column.tone}`}>
                  {column.items.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-4 md:grid-cols-2 xl:flex xl:overflow-x-auto xl:pb-2">
        {ordersByStatus.map((column) => (
          <section key={column.key} className="min-w-0 xl:w-[21rem] xl:shrink-0">
            <div className="surface-card flex min-h-[18rem] flex-col p-4 xl:h-[calc(100vh-16rem)]">
              <div className="mb-4 d-flex justify-content-between align-items-center gap-3">
                <div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                    {column.title}
                  </div>
                  <div className="mt-1 text-lg font-bold text-[var(--app-text)]">{column.items.length} pedidos</div>
                </div>
                <StatusBadge value={column.key} />
              </div>

              {!column.items.length ? (
                <div className="surface-panel flex flex-1 items-center justify-center px-4 py-6 text-center">
                  <div>
                    <div className="text-[2rem] text-[var(--app-border-strong)]">
                      <Icon name="checkCircle" className="mx-auto h-8 w-8" />
                    </div>
                    <div className="mt-2 font-semibold text-[var(--app-text)]">Sin pedidos</div>
                    <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                      No hay elementos en esta columna.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                  {column.items.map((order) => {
                    const detail = detailsById[order.id_pedido];
                    const transitions = getAllowedTransitions(order)
                      .filter((transition) => canRunTransition(user?.rol, transition));

                    return (
                      <article key={order.id_pedido} className="surface-panel bg-white px-4 py-4 shadow-[var(--shadow-soft)]">
                        <div className="d-flex justify-content-between align-items-start gap-3">
                          <div className="min-w-0">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                              {order.canal}
                            </div>
                            <div className="mt-1 text-[1.05rem] font-bold leading-tight text-[var(--app-text)]">
                              {order.codigo}
                            </div>
                          </div>
                          <div className="shrink-0 text-end">
                            <div className="text-lg font-extrabold leading-none text-[var(--app-text)]">
                              {formatMoney(order.total)}
                            </div>
                            <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                              {order.metodo_pago || 'Sin pago'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-sm leading-5 text-[var(--app-text-muted)]">
                          {order.cliente}
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <StatusBadge value={order.estado_pedido} />
                          <span className="text-sm text-[var(--app-text-muted)]">
                            {formatHour(order.fecha_creacion)}
                          </span>
                        </div>

                        <div className="mt-3 rounded-2xl border border-[var(--app-border)] bg-white px-3 py-3 text-sm text-[var(--app-text-muted)]">
                          <div><span className="font-semibold text-[var(--app-text)]">Items:</span> {order.total_items}</div>
                          <div className="mt-1"><span className="font-semibold text-[var(--app-text)]">Cajero:</span> {order.cajero || 'Sin asignar'}</div>
                          {order.cocinero && (
                            <div className="mt-1"><span className="font-semibold text-[var(--app-text)]">Cocinero:</span> {order.cocinero}</div>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="inline-flex min-h-[2.75rem] items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white px-4 text-sm font-semibold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                            onClick={() => toggleDetails(order.id_pedido)}
                          >
                            {detailLoadingId === order.id_pedido
                              ? 'Cargando...'
                              : detail
                                ? 'Ocultar detalle'
                                : 'Ver detalle'}
                          </button>

                          {transitions.map((transition) => {
                            const danger = transition === 'cancelado';
                            const busy = actionLoading === `${order.id_pedido}-${transition}`;

                            return (
                              <button
                                key={`${order.id_pedido}-${transition}`}
                                type="button"
                                className={[
                                  'inline-flex min-h-[2.75rem] items-center justify-center rounded-2xl px-4 text-sm font-semibold transition',
                                  danger
                                    ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                    : 'bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]',
                                ].join(' ')}
                                onClick={() => handleTransition(order.id_pedido, transition)}
                                disabled={busy || Boolean(actionLoading)}
                              >
                                {busy ? 'Procesando...' : getActionLabel(transition)}
                              </button>
                            );
                          })}
                        </div>

                        {detail && (
                          <div className="mt-4 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-3">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                              Detalle
                            </div>
                            <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                              Creado: {formatDate(detail.fecha_creacion)}
                            </div>
                            {detail.notas && (
                              <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                                <span className="font-semibold text-[var(--app-text)]">Notas:</span> {detail.notas}
                              </div>
                            )}
                            <div className="mt-3 space-y-2">
                              {detail.items.map((item) => (
                                <div key={item.id_pedido_item} className="rounded-2xl border border-[var(--app-border)] bg-white px-3 py-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="font-semibold text-[var(--app-text)]">{item.producto}</div>
                                      <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                                        {item.cantidad} x {formatMoney(item.precio_unitario)}
                                      </div>
                                    </div>
                                    <div className="font-semibold text-[var(--app-text)]">{formatMoney(item.total_linea)}</div>
                                  </div>

                                  {item.modificaciones.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {summarizeOrderModifications(item.modificaciones).map((entry) => (
                                        <span key={`${item.id_pedido_item}-${entry}`} className="rounded-full bg-[var(--app-surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
                                          {entry}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
