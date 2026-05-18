import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { api } from '../../api/api';

export default function ReporteVentas() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reportes/ventas')
      .then(d => setDatos(d.datos))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalIngresos = datos.reduce((sum, r) => sum + parseFloat(r.ingresos_totales || 0), 0);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-1">Productos más vendidos</h4>
        <p className="text-muted mb-3">Ordenados por ingresos totales (excluye pedidos cancelados)</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <p className="text-muted">Cargando...</p>}

        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Categoría</th>
                    <th>Producto</th>
                    <th>Precio unit.</th>
                    <th>Unidades vendidas</th>
                    <th>Ingresos totales</th>
                    <th>% del total</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted">Sin datos</td></tr>
                  )}
                  {datos.map((r, i) => {
                    const pct = totalIngresos > 0 ? (parseFloat(r.ingresos_totales) / totalIngresos * 100).toFixed(1) : 0;
                    return (
                      <tr key={i}>
                        <td className="text-muted">{i + 1}</td>
                        <td><span className="badge bg-secondary">{r.categoria}</span></td>
                        <td>{r.producto}</td>
                        <td>Q{parseFloat(r.precio_unitario).toFixed(2)}</td>
                        <td>{r.unidades_vendidas}</td>
                        <td className="fw-bold">Q{parseFloat(r.ingresos_totales).toFixed(2)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: 8 }}>
                              <div className="progress-bar bg-dark" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="small text-muted">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {datos.length > 0 && (
                  <tfoot>
                    <tr className="table-dark">
                      <td colSpan={5} className="text-end fw-bold">Total</td>
                      <td className="fw-bold">Q{totalIngresos.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
