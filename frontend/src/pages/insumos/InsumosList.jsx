import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import MetricCard from '../../components/MetricCard';
import { api } from '../../api/api';

export default function InsumosList() {
  const [insumos, setInsumos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/insumos')
      .then(d => setInsumos(d.insumos))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredInsumos = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return insumos;
    }

    return insumos.filter((insumo) => (
      insumo.nombre.toLowerCase().includes(normalized)
      || insumo.proveedor.toLowerCase().includes(normalized)
      || insumo.unidad_medida.toLowerCase().includes(normalized)
    ));
  }, [insumos, search]);

  const activos = insumos.filter((insumo) => insumo.activo).length;
  const stockBajo = insumos.filter((insumo) => parseFloat(insumo.stock_actual) < parseFloat(insumo.stock_minimo)).length;

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await api.delete(`/insumos/${id}`);
      setInsumos(prev => prev.filter(i => i.id_insumo !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return <LoadingScreen label="Cargando insumos..." />;
  }

  return (
    <AppShell
      title="Insumos"
      subtitle="Inventario base para compras, stock y recetas."
      actions={(
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/insumos/reabastecer" className="btn btn-outline-secondary">
            Reabastecer
          </Link>
          <Link to="/insumos/nuevo" className="btn btn-brand">
            Nuevo insumo
          </Link>
        </div>
      )}
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <MetricCard label="Total insumos" value={insumos.length} icon="box-seam" />
        </div>
        <div className="col-12 col-md-4">
          <MetricCard label="Activos" value={activos} icon="check2-circle" />
        </div>
        <div className="col-12 col-md-4">
          <MetricCard label="Stock bajo" value={stockBajo} icon="exclamation-triangle" />
        </div>
      </div>

      <div className="surface-card p-3 p-lg-4">
        <div className="row g-3 align-items-end mb-3">
          <div className="col-12 col-lg-6">
            <label className="form-label text-muted small text-uppercase">Buscar insumo</label>
            <input
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tortilla, proveedor, unidad..."
            />
          </div>
        </div>

        {!filteredInsumos.length ? (
          <EmptyState
            icon="box-seam"
            title="No hay insumos para mostrar"
            description="Prueba otro filtro o registra un insumo nuevo."
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-app align-middle mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Proveedor</th>
                  <th>Unidad</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                  <th>Costo unitario</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredInsumos.map((i) => {
                  const stockBajo = parseFloat(i.stock_actual) < parseFloat(i.stock_minimo);
                  return (
                    <tr key={i.id_insumo}>
                      <td className="fw-semibold">{i.nombre}</td>
                      <td className="text-muted small">{i.proveedor}</td>
                      <td>{i.unidad_medida}</td>
                      <td className={stockBajo ? 'text-danger fw-bold' : ''}>
                        {parseFloat(i.stock_actual).toFixed(2)}
                        {stockBajo && <span className="ms-2 badge rounded-pill soft-danger">Bajo</span>}
                      </td>
                      <td>{parseFloat(i.stock_minimo).toFixed(2)}</td>
                      <td>Q{parseFloat(i.costo_unitario).toFixed(2)}</td>
                      <td>
                        {i.activo
                          ? <span className="badge rounded-pill soft-success">Activo</span>
                          : <span className="badge rounded-pill soft-secondary">Inactivo</span>}
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                          <Link to={`/insumos/${i.id_insumo}/editar`} className="btn btn-sm btn-outline-secondary">Editar</Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(i.id_insumo, i.nombre)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
