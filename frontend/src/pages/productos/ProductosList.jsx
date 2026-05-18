import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import MetricCard from '../../components/MetricCard';
import { api } from '../../api/api';

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/productos')
      .then(d => setProductos(d.productos))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return productos;
    }

    return productos.filter((producto) => (
      producto.nombre.toLowerCase().includes(normalized)
      || producto.categoria.toLowerCase().includes(normalized)
      || producto.descripcion?.toLowerCase().includes(normalized)
    ));
  }, [productos, search]);

  const availableCount = productos.filter((producto) => producto.disponible).length;
  const comboCount = productos.filter((producto) => producto.es_combo).length;

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await api.delete(`/productos/${id}`);
      setProductos(prev => prev.filter(p => p.id_producto !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return <LoadingScreen label="Cargando productos..." />;
  }

  return (
    <AppShell
      title="Productos"
      subtitle="Catálogo administrativo conectado al backend real."
      actions={(
        <Link to="/productos/nuevo" className="btn btn-brand">
          Nuevo producto
        </Link>
      )}
    >
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <MetricCard label="Total productos" value={productos.length} icon="cup-hot" />
        </div>
        <div className="col-12 col-md-4">
          <MetricCard label="Disponibles" value={availableCount} icon="check2-circle" />
        </div>
        <div className="col-12 col-md-4">
          <MetricCard label="Combos" value={comboCount} icon="collection" />
        </div>
      </div>

      <div className="surface-card p-3 p-lg-4">
        <div className="row g-3 align-items-end mb-3">
          <div className="col-12 col-lg-6">
            <label className="form-label text-muted small text-uppercase">Buscar producto</label>
            <input
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Taco, bebida, combo..."
            />
          </div>
        </div>

        {!filteredProducts.length ? (
          <EmptyState
            icon="cup-hot"
            title="No hay productos para mostrar"
            description="Ajusta el filtro o registra un producto nuevo."
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-app align-middle mb-0">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Disponible</th>
                  <th>Combo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id_producto}>
                    <td>{p.categoria}</td>
                    <td className="fw-semibold">{p.nombre}</td>
                    <td className="text-muted small">{p.descripcion || '—'}</td>
                    <td>Q{parseFloat(p.precio).toFixed(2)}</td>
                    <td>
                      {p.disponible
                        ? <span className="badge rounded-pill soft-success">Disponible</span>
                        : <span className="badge rounded-pill soft-danger">Oculto</span>}
                    </td>
                    <td>
                      {p.es_combo
                        ? <span className="badge rounded-pill soft-info">Combo</span>
                        : '—'}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-end">
                        <Link to={`/productos/${p.id_producto}/editar`} className="btn btn-sm btn-outline-secondary">Editar</Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id_producto, p.nombre)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
