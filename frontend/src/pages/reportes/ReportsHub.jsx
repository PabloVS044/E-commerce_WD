import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import MetricCard from '../../components/MetricCard';
import { api } from '../../api/api';
import { buildSectionedCsv, downloadCsv } from '../../utils/reportExport';

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
  const [exportNotice, setExportNotice] = useState('');
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

  const exportSections = useMemo(() => ([
    {
      title: 'Ventas por producto',
      columns: [
        { key: 'producto', label: 'Producto' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'unidades_vendidas', label: 'Unidades vendidas' },
        { key: 'ingresos_totales', label: 'Ingresos totales' },
      ],
      rows: ventas,
    },
    {
      title: 'Ventas diarias',
      columns: [
        { key: 'fecha', label: 'Fecha' },
        { key: 'num_pedidos', label: 'Pedidos' },
        { key: 'total_ventas', label: 'Total ventas' },
        { key: 'ticket_promedio', label: 'Ticket promedio' },
      ],
      rows: diario,
    },
    {
      title: 'Clientes frecuentes',
      columns: [
        { key: 'cliente', label: 'Cliente' },
        { key: 'email', label: 'Email' },
        { key: 'total_pedidos', label: 'Pedidos' },
        { key: 'gasto_total', label: 'Gasto total' },
      ],
      rows: clientes,
    },
    {
      title: 'Ranking SQL',
      columns: [
        { key: 'ranking', label: 'Ranking' },
        { key: 'producto', label: 'Producto' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'ingresos', label: 'Ingresos' },
        { key: 'pct_del_total', label: 'Pct del total' },
      ],
      rows: ranking,
    },
  ]), [clientes, diario, ranking, ventas]);

  const handleExportCsv = () => {
    const csv = buildSectionedCsv(exportSections);
    downloadCsv('tacos-el-pepe-reportes.csv', csv);
    setExportNotice('Reporte exportado a CSV.');
  };

  if (loading) {
    return <LoadingScreen label="Cargando reportes..." />;
  }

  return (
    <AppShell
      title="Reportes"
      subtitle="Resumen operativo y comercial listo para caja o administración."
      actions={(
        <button type="button" className="app-button app-button-primary" onClick={handleExportCsv}>
          Exportar CSV
        </button>
      )}
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {exportNotice && <div className="app-notice app-notice-success mb-4">{exportNotice}</div>}

      <section className="hero-panel mb-5 overflow-hidden px-5 py-5 sm:px-6 lg:px-7 lg:py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-end">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
              <span className="inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
              Intelligence deck
            </div>
            <h2 className="mt-4 max-w-[15ch] font-[var(--font-display)] text-[clamp(2.1rem,3vw,3rem)] font-extrabold leading-[0.95] text-[var(--app-text)]">
              Reportes listos para operación, auditoría y toma de decisiones.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--app-text-muted)]">
              Consolida ventas, recurrencia y concentración de ingresos en una sola superficie con exportación inmediata para análisis externo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-4 shadow-[var(--shadow-soft)]">
              <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Ingresos agregados</div>
              <div className="mt-2 font-[var(--font-display)] text-[1.85rem] font-extrabold text-[var(--app-text)]">{money(metrics.totalIngresos)}</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-4 shadow-[var(--shadow-soft)]">
              <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Pedidos procesados</div>
              <div className="mt-2 font-[var(--font-display)] text-[1.85rem] font-extrabold text-[var(--app-text)]">{metrics.totalPedidos}</div>
            </div>
            <div className="rounded-[1.35rem] border border-white/70 bg-white/78 px-4 py-4 shadow-[var(--shadow-soft)]">
              <div className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Producto líder</div>
              <div className="mt-2 text-base font-extrabold text-[var(--app-text)]">{metrics.mejorProducto}</div>
            </div>
          </div>
        </div>
      </section>

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
