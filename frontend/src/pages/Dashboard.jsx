import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Icon from '../components/Icon';
import LoadingScreen from '../components/LoadingScreen';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daily, setDaily] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState([]);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError('');

      const results = await Promise.allSettled([
        api.get('/reportes/diario'),
        api.get('/consultas/views/pedidos-resumen'),
        api.get('/consultas/views/stock-critico'),
        api.get('/reportes/ventas'),
      ]);

      if (ignore) return;

      const [dailyRes, ordersRes, stockRes, ventasRes] = results;

      if (dailyRes.status === 'fulfilled') setDaily(dailyRes.value.datos || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.datos || []);
      if (stockRes.status === 'fulfilled') setStock(stockRes.value.datos || []);
      if (ventasRes.status === 'fulfilled') setVentas(ventasRes.value.datos || []);

      const failed = results.every((result) => result.status === 'rejected');
      if (failed) setError('No se pudo cargar el resumen del dashboard.');

      setLoading(false);
    }

    load();
    return () => { ignore = true; };
  }, []);

  const latestDaily = daily[0];
  const activeOrders = orders.filter((order) => !['entregado', 'cancelado'].includes(order.estado_pedido));
  const delayedOrders = orders.filter((order) => ['pendiente', 'aprobado', 'en_proceso'].includes(order.estado_pedido));
  const topProducts = ventas.slice(0, 5);

  const quickActions = useMemo(() => {
    if (user?.rol === 'cocinero') {
      return [
        { to: '/pedidos', label: 'Ver pedidos activos', icon: 'receipt' },
      ];
    }

    const actions = [
      { to: '/pos', label: 'Abrir POS', icon: 'terminal' },
      { to: '/pedidos', label: 'Monitor de pedidos', icon: 'receipt' },
    ];

    if (user?.rol === 'admin') {
      actions.push(
        { to: '/insumos/reabastecer', label: 'Reabastecer insumos', icon: 'bagCheck' },
        { to: '/reportes', label: 'Ir a reportes', icon: 'chart' },
      );
    }

    return actions;
  }, [user?.rol]);

  if (loading) return <LoadingScreen message="Armando el dashboard..." />;

  return (
    <AppShell
      title="Dashboard operativo"
      subtitle="Vista general rápida para arrancar turno y detectar prioridades."
    >
      {error && <div className="app-notice app-notice-error mb-4">{error}</div>}

      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <MetricCard
            label="Ventas del período"
            value={latestDaily ? `Q${Number(latestDaily.total_ventas).toFixed(2)}` : 'Q0.00'}
            hint={latestDaily ? new Date(latestDaily.fecha).toLocaleDateString('es-GT') : 'Sin datos'}
            icon="cash"
            tone="primary"
          />
        </div>
        <div>
          <MetricCard
            label="Pedidos activos"
            value={activeOrders.length}
            hint="pendientes a entregarse"
            icon="receipt"
            tone="warning"
          />
        </div>
        <div>
          <MetricCard
            label="Alertas de stock"
            value={stock.length}
            hint="insumos bajo mínimo"
            icon="warning"
            tone="danger"
          />
        </div>
        <div>
          <MetricCard
            label="Pedidos en cocina"
            value={delayedOrders.length}
            hint="flujo actual"
            icon="clock"
            tone="info"
          />
        </div>
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div>
          <div className="surface-card h-full p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Atajos</div>
                <h2 className="text-2xl font-bold text-[var(--app-text)]">Acciones rápidas</h2>
              </div>
              <div className="product-icon text-[var(--brand)]">
                <Icon name="lightning" className="h-8 w-8" />
              </div>
            </div>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Link key={action.to} to={action.to} className="surface-panel flex items-center justify-between gap-3 p-3 no-underline">
                  <div className="font-semibold text-[var(--app-text)]">
                    <Icon name={action.icon} className="mr-2 inline h-4 w-4 text-[var(--brand)]" />
                    {action.label}
                  </div>
                  <Icon name="arrowRight" className="h-4 w-4 text-[var(--app-text-muted)]" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="surface-card h-full p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Top del día</div>
                <h2 className="text-2xl font-bold text-[var(--app-text)]">Productos con más movimiento</h2>
              </div>
              <Link to="/reportes" className="app-button app-button-secondary app-button-sm">Ver reportes</Link>
            </div>
            <div className="data-table-wrap">
              <table className="table table-app align-middle mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th className="text-end">Unidades</th>
                    <th className="text-end">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="empty-state py-4">
                          <p className="mb-0 text-[var(--app-text-muted)]">No hay datos de ventas para mostrar.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {topProducts.map((item) => (
                    <tr key={item.producto}>
                      <td className="font-semibold">{item.producto}</td>
                      <td>{item.categoria}</td>
                      <td className="text-end">{item.unidades_vendidas}</td>
                      <td className="text-end font-semibold">Q{Number(item.ingresos_totales).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div>
          <div className="surface-card flex h-full flex-col overflow-hidden p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Flujo operativo</div>
                <h2 className="text-2xl font-bold text-[var(--app-text)]">Pedidos que requieren atención</h2>
              </div>
              <Link to="/pedidos" className="app-button app-button-secondary app-button-sm">Abrir monitor</Link>
            </div>
            <div className="data-table-wrap grow overflow-y-auto" style={{ maxHeight: '28rem' }}>
              <table className="table table-app align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Canal</th>
                    <th>Estado</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {activeOrders.slice(0, 8).map((order) => (
                    <tr key={order.id_pedido}>
                      <td className="font-semibold">#{order.id_pedido}</td>
                      <td>{order.cliente}</td>
                      <td className="text-capitalize">{order.canal}</td>
                      <td><StatusBadge value={order.estado_pedido} /></td>
                      <td className="text-end font-semibold">Q{Number(order.total).toFixed(2)}</td>
                    </tr>
                  ))}
                  {activeOrders.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state py-4">
                          <p className="mb-0 text-[var(--app-text-muted)]">No hay pedidos activos en este momento.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="surface-card h-full p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Insumos críticos</div>
                <h2 className="text-2xl font-bold text-[var(--app-text)]">Stock a vigilar</h2>
              </div>
              <Link to="/insumos/reabastecer" className="app-button app-button-secondary app-button-sm">Reabastecer</Link>
            </div>

            <div className="grid gap-3">
              {stock.slice(0, 5).map((item) => (
                <div key={item.id_insumo} className="surface-panel p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.insumo}</div>
                      <div className="text-sm text-[var(--app-text-muted)]">{item.proveedor}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">Déficit</div>
                      <div className="font-bold text-red-700">{Number(item.deficit).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
              {stock.length === 0 && (
                <div className="empty-state py-4">
                  <p className="mb-0 text-[var(--app-text-muted)]">No hay alertas de stock por ahora.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
