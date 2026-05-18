import { useEffect, useState } from 'react';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../api/api';

const SECTIONS = [
  {
    key: 'joinsPedidos',
    title: 'JOIN: resumen de pedidos',
    description: 'Cruza pedidos, clientes, cajeros y pago.',
  },
  {
    key: 'joinsCompras',
    title: 'JOIN: resumen de compras',
    description: 'Cruza compras de insumos con proveedor y empleado.',
  },
  {
    key: 'clientesPagos',
    title: 'Subquery: clientes con pagos',
    description: 'Clientes que ya tienen pedidos pagados.',
  },
  {
    key: 'proveedoresGasto',
    title: 'Subquery: gasto por proveedor',
    description: 'Totales acumulados por proveedor.',
  },
  {
    key: 'productosSinVentas',
    title: 'Subquery: productos sin ventas',
    description: 'Identifica productos aún no vendidos.',
  },
  {
    key: 'pedidosView',
    title: 'VIEW: pedidos resumen',
    description: 'Vista materializada en backend para operación diaria.',
  },
  {
    key: 'stockView',
    title: 'VIEW: stock crítico',
    description: 'Vista dedicada a reabastecimiento.',
  },
];

function money(value) {
  return `Q${Number(value || 0).toFixed(2)}`;
}

export default function SqlInsights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    joinsPedidos: [],
    joinsCompras: [],
    clientesPagos: [],
    proveedoresGasto: [],
    productosSinVentas: [],
    pedidosView: [],
    stockView: [],
  });

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/consultas/joins/pedidos-resumen'),
      api.get('/consultas/joins/compras-resumen'),
      api.get('/consultas/subqueries/clientes-con-pagos'),
      api.get('/consultas/subqueries/proveedores-gasto'),
      api.get('/consultas/subqueries/productos-sin-ventas'),
      api.get('/consultas/views/pedidos-resumen'),
      api.get('/consultas/views/stock-critico'),
    ])
      .then(([
        joinsPedidos,
        joinsCompras,
        clientesPagos,
        proveedoresGasto,
        productosSinVentas,
        pedidosView,
        stockView,
      ]) => {
        if (!active) {
          return;
        }

        setData({
          joinsPedidos: joinsPedidos.datos,
          joinsCompras: joinsCompras.datos,
          clientesPagos: clientesPagos.datos,
          proveedoresGasto: proveedoresGasto.datos,
          productosSinVentas: productosSinVentas.datos,
          pedidosView: pedidosView.datos,
          stockView: stockView.datos,
        });
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

  if (loading) {
    return <LoadingScreen label="Cargando analítica SQL..." />;
  }

  return (
    <AppShell
      title="Analítica SQL"
      subtitle="Pantallas listas para evidenciar joins, subqueries y views desde la app."
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {SECTIONS.map((section) => (
          <div key={section.key} className="col-12">
            <div className="surface-card p-3 p-lg-4">
              <div className="mb-3">
                <h2 className="h5 mb-1">{section.title}</h2>
                <p className="text-muted mb-0">{section.description}</p>
              </div>

              {!data[section.key]?.length ? (
                <EmptyState title="Sin registros" description="Esta consulta no devolvió filas." />
              ) : (
                <div className="table-responsive">
                  <table className="table table-app align-middle mb-0">
                    <thead>
                      <tr>
                        {section.key === 'joinsPedidos' && (
                          <>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Canal</th>
                            <th>Estado</th>
                            <th>Total</th>
                          </>
                        )}
                        {section.key === 'joinsCompras' && (
                          <>
                            <th>Compra</th>
                            <th>Proveedor</th>
                            <th>Empleado</th>
                            <th>Líneas</th>
                            <th>Total</th>
                          </>
                        )}
                        {section.key === 'clientesPagos' && (
                          <>
                            <th>Cliente</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                          </>
                        )}
                        {section.key === 'proveedoresGasto' && (
                          <>
                            <th>Proveedor</th>
                            <th>Contacto</th>
                            <th>Compras</th>
                            <th>Gasto</th>
                          </>
                        )}
                        {section.key === 'productosSinVentas' && (
                          <>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Estado</th>
                          </>
                        )}
                        {section.key === 'pedidosView' && (
                          <>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Canal</th>
                            <th>Estado</th>
                            <th>Total</th>
                          </>
                        )}
                        {section.key === 'stockView' && (
                          <>
                            <th>Insumo</th>
                            <th>Proveedor</th>
                            <th>Stock actual</th>
                            <th>Mínimo</th>
                            <th>Déficit</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {data[section.key].slice(0, 8).map((item, index) => (
                        <tr key={`${section.key}-${index}`}>
                          {section.key === 'joinsPedidos' && (
                            <>
                              <td>#{item.id_pedido}</td>
                              <td>{item.cliente}</td>
                              <td>{item.canal}</td>
                              <td><StatusBadge status={item.estado_pedido} /></td>
                              <td>{money(item.total)}</td>
                            </>
                          )}
                          {section.key === 'joinsCompras' && (
                            <>
                              <td>#{item.id_compra_insumo}</td>
                              <td>{item.proveedor}</td>
                              <td>{item.empleado}</td>
                              <td>{item.lineas_detalle}</td>
                              <td>{money(item.total_calculado)}</td>
                            </>
                          )}
                          {section.key === 'clientesPagos' && (
                            <>
                              <td>{item.cliente}</td>
                              <td>{item.email}</td>
                              <td>{item.telefono || 'Sin teléfono'}</td>
                            </>
                          )}
                          {section.key === 'proveedoresGasto' && (
                            <>
                              <td>{item.proveedor}</td>
                              <td>{item.contacto || item.email}</td>
                              <td>{item.num_compras}</td>
                              <td>{money(item.gasto_total)}</td>
                            </>
                          )}
                          {section.key === 'productosSinVentas' && (
                            <>
                              <td>{item.producto}</td>
                              <td>{item.categoria}</td>
                              <td>{money(item.precio)}</td>
                              <td>{item.disponible ? 'Disponible' : 'Oculto'}</td>
                            </>
                          )}
                          {section.key === 'pedidosView' && (
                            <>
                              <td>#{item.id_pedido}</td>
                              <td>{item.cliente}</td>
                              <td>{item.canal}</td>
                              <td><StatusBadge status={item.estado_pedido} /></td>
                              <td>{money(item.total)}</td>
                            </>
                          )}
                          {section.key === 'stockView' && (
                            <>
                              <td>{item.insumo}</td>
                              <td>{item.proveedor}</td>
                              <td>{Number(item.stock_actual).toFixed(2)}</td>
                              <td>{Number(item.stock_minimo).toFixed(2)}</td>
                              <td>{Number(item.deficit).toFixed(2)}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
