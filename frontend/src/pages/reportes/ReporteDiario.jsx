import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { api } from '../../api/api';

export default function ReporteDiario() {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reportes/diario')
      .then(d => setDatos(d.datos))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalVentas = datos.reduce((sum, r) => sum + parseFloat(r.total_ventas || 0), 0);
  const totalPedidos = datos.reduce((sum, r) => sum + parseInt(r.num_pedidos || 0), 0);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h4 className="mb-1">Ventas diarias</h4>
        <p className="text-muted mb-3">Últimos 30 días — pedidos finalizados o entregados</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <p className="text-muted">Cargando...</p>}

        {!loading && !error && (
          <>
            {datos.length > 0 && (
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <div className="text-muted small">Total ingresos (período)</div>
                    <div className="fs-4 fw-bold">Q{totalVentas.toFixed(2)}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <div className="text-muted small">Total pedidos</div>
                    <div className="fs-4 fw-bold">{totalPedidos}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm text-center p-3">
                    <div className="text-muted small">Días con ventas</div>
                    <div className="fs-4 fw-bold">{datos.length}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Fecha</th>
                    <th>Pedidos</th>
                    <th>Total ventas</th>
                    <th>Ticket promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-muted">Sin datos</td></tr>
                  )}
                  {datos.map((r, i) => (
                    <tr key={i}>
                      <td>{new Date(r.fecha).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: '2-digit' })}</td>
                      <td>{r.num_pedidos}</td>
                      <td className="fw-bold">Q{parseFloat(r.total_ventas).toFixed(2)}</td>
                      <td className="text-muted">Q{parseFloat(r.ticket_promedio).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                {datos.length > 0 && (
                  <tfoot>
                    <tr className="table-dark">
                      <td className="fw-bold">Total</td>
                      <td className="fw-bold">{totalPedidos}</td>
                      <td className="fw-bold">Q{totalVentas.toFixed(2)}</td>
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
