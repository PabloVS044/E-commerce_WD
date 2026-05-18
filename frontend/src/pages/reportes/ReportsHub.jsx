import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import MetricCard from '../../components/MetricCard';
import { api } from '../../api/api';

function money(value) {
  return `Q${Number(value || 0).toFixed(2)}`;
}

function formatShortDate(value) {
  return new Date(value).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'short',
  });
}

function TableShell({ title, description, badge, children, isEmpty, emptyState }) {
  return (
    <div className="surface-card min-w-0 overflow-hidden self-start p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="h4 mb-1">{title}</h2>
          {description && <p className="mb-0 text-sm leading-6 text-[var(--app-text-muted)]">{description}</p>}
        </div>
        {badge}
      </div>

      {isEmpty ? emptyState : children}
    </div>
  );
}

export default function ReportsHub() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ventas, setVentas] = useState([]);
  const [diario, setDiario] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/reportes/ventas'),
      api.get('/reportes/diario'),
      api.get('/reportes/clientes-frecuentes'),
      api.get('/reportes/ranking-productos'),
    ])
      .then(([ventasResponse, diarioResponse, clientesResponse, rankingResponse]) => {
        if (!active) {
          return;
        }

        setVentas(ventasResponse.datos);
        setDiario(diarioResponse.datos);
        setClientes(clientesResponse.datos);
        setRanking(rankingResponse.datos);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalIngresos = ventas.reduce((acc, item) => acc + Number(item.ingresos_totales || 0), 0);
    const totalUnidades = ventas.reduce((acc, item) => acc + Number(item.unidades_vendidas || 0), 0);
    const totalPedidos = diario.reduce((acc, item) => acc + Number(item.num_pedidos || 0), 0);
    const mejorDia = diario.reduce((currentBest, item) => (
      Number(item.total_ventas || 0) > Number(currentBest?.total_ventas || 0) ? item : currentBest
    ), null);

    return {
      totalIngresos,
      totalUnidades,
      totalPedidos,
      mejorProducto: ventas[0]?.producto || 'Sin datos',
      mejorDia,
    };
  }, [ventas, diario]);

  if (loading) {
    return <LoadingScreen label="Cargando reportes..." />;
  }

  return (
    <AppShell
      title="Reportes"
      subtitle="Resumen operativo y comercial listo para caja o administración."
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Ingresos acumulados" value={money(metrics.totalIngresos)} icon="cash-stack" />
        <MetricCard label="Unidades vendidas" value={metrics.totalUnidades} icon="cup-hot" tone="warning" />
        <MetricCard label="Pedidos cerrados" value={metrics.totalPedidos} icon="receipt" tone="info" />
        <MetricCard
          label="Producto líder"
          value={metrics.mejorProducto}
          icon="star"
          tone="success"
          hint={metrics.mejorDia ? `Mejor día ${formatShortDate(metrics.mejorDia.fecha)}` : undefined}
        />
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <TableShell
          title="Ventas por producto"
          description="Productos ordenados por ingresos."
          badge={(
            <span className="badge rounded-pill soft-secondary px-3 py-2">
              {ventas.length} registros
            </span>
          )}
          isEmpty={!ventas.length}
          emptyState={(
            <EmptyState
              title="Sin ventas registradas"
              description="Todavía no hay información para mostrar."
            />
          )}
        >
          <div className="overflow-auto rounded-[1.15rem] border border-[var(--app-border)] max-h-[30rem]">
            <table className="table table-app align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Unidades</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((item) => (
                  <tr key={item.producto}>
                    <td className="fw-semibold">{item.producto}</td>
                    <td>{item.categoria}</td>
                    <td>{item.unidades_vendidas}</td>
                    <td>{money(item.ingresos_totales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableShell>

        <TableShell
          title="Ventas diarias"
          description="Últimos días con pedidos cerrados."
          badge={(
            <span className="badge rounded-pill soft-warning px-3 py-2">
              {diario.length} días
            </span>
          )}
          isEmpty={!diario.length}
          emptyState={(
            <EmptyState
              title="Sin actividad diaria"
              description="No hay días cerrados aún."
            />
          )}
        >
          <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-1">
            {diario.map((item) => (
              <div key={item.fecha} className="surface-panel px-4 py-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <div className="text-lg font-bold text-[var(--app-text)]">{formatShortDate(item.fecha)}</div>
                    <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                      {item.num_pedidos} pedidos
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-xl font-extrabold leading-none text-[var(--app-text)]">
                      {money(item.total_ventas)}
                    </div>
                    <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                      Ticket {money(item.ticket_promedio)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TableShell>
      </div>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <TableShell
          title="Clientes frecuentes"
          description="Clientes con compras repetidas y mayor gasto acumulado."
          badge={(
            <span className="badge rounded-pill soft-secondary px-3 py-2">
              {clientes.length} clientes
            </span>
          )}
          isEmpty={!clientes.length}
          emptyState={(
            <EmptyState
              title="Sin clientes frecuentes"
              description="No hay clientes con pagos suficientes."
            />
          )}
        >
          <div className="overflow-auto rounded-[1.15rem] border border-[var(--app-border)] max-h-[26rem]">
            <table className="table table-app align-middle mb-0">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Pedidos</th>
                  <th>Gasto total</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((item) => (
                  <tr key={item.id_cliente}>
                    <td>
                      <div className="fw-semibold">{item.cliente}</div>
                      <div className="small text-muted">{item.email}</div>
                    </td>
                    <td>{item.total_pedidos}</td>
                    <td>{money(item.gasto_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableShell>

        <TableShell
          title="Ranking SQL"
          description="Consulta CTE para concentración de ingresos por producto."
          badge={(
            <span className="badge rounded-pill soft-warning px-3 py-2">
              {ranking.length} filas
            </span>
          )}
          isEmpty={!ranking.length}
          emptyState={(
            <EmptyState
              title="Sin ranking"
              description="No hay registros suficientes para el CTE."
            />
          )}
        >
          <div className="overflow-auto rounded-[1.15rem] border border-[var(--app-border)] max-h-[26rem]">
            <table className="table table-app align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Ingresos</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((item) => (
                  <tr key={`${item.ranking}-${item.id_producto}`}>
                    <td>{item.ranking}</td>
                    <td>
                      <div className="fw-semibold">{item.producto}</div>
                      <div className="small text-muted">{item.categoria}</div>
                    </td>
                    <td>{money(item.ingresos)}</td>
                    <td>{Number(item.pct_del_total || 0).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableShell>
      </div>
    </AppShell>
  );
}
