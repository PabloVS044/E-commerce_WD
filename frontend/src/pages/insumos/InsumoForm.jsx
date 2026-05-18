import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import LoadingScreen from '../../components/LoadingScreen';
import { api } from '../../api/api';

const EMPTY = { id_proveedor: '', nombre: '', unidad_medida: '', stock_actual: '0', stock_minimo: '0', costo_unitario: '0' };

export default function InsumoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/insumos/proveedores'),
      isEdit ? api.get(`/insumos/${id}`) : Promise.resolve(null),
    ])
      .then(([proveedoresResponse, insumoResponse]) => {
        if (!active) {
          return;
        }

        setProveedores(proveedoresResponse.proveedores);
        if (insumoResponse?.insumo) {
          const i = insumoResponse.insumo;
          setForm({
            id_proveedor: String(i.id_proveedor),
            nombre: i.nombre,
            unidad_medida: i.unidad_medida,
            stock_actual: i.stock_actual,
            stock_minimo: i.stock_minimo,
            costo_unitario: i.costo_unitario,
          });
        }
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
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/insumos/${id}`, form);
      } else {
        await api.post('/insumos', form);
      }
      navigate('/insumos');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen label={isEdit ? 'Cargando insumo...' : 'Cargando formulario...'} />;
  }

  return (
    <AppShell
      title={isEdit ? 'Editar insumo' : 'Nuevo insumo'}
      subtitle="Formulario administrativo para el inventario base."
      actions={(
        <Link to="/insumos" className="btn btn-outline-secondary">
          Volver
        </Link>
      )}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="surface-card p-3 p-lg-4">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Proveedor *</label>
                  <select className="form-select" name="id_proveedor" value={form.id_proveedor} onChange={handleChange} required>
                    <option value="">Selecciona un proveedor</option>
                    {proveedores.map((p) => (
                      <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-lg-8">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Unidad de medida *</label>
                  <input className="form-control" name="unidad_medida" value={form.unidad_medida} onChange={handleChange} placeholder="kg, litros, unidad..." required />
                </div>

                <div className="col-12 col-lg-4">
                  <label className="form-label">Stock actual</label>
                  <input className="form-control" type="number" name="stock_actual" value={form.stock_actual} onChange={handleChange} min="0" step="0.01" />
                </div>
                <div className="col-12 col-lg-4">
                  <label className="form-label">Stock mínimo</label>
                  <input className="form-control" type="number" name="stock_minimo" value={form.stock_minimo} onChange={handleChange} min="0" step="0.01" />
                </div>
                <div className="col-12 col-lg-4">
                  <label className="form-label">Costo unitario (Q)</label>
                  <input className="form-control" type="number" name="costo_unitario" value={form.costo_unitario} onChange={handleChange} min="0" step="0.01" />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-brand" disabled={saving}>
                  {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear insumo'}
                </button>
                <Link to="/insumos" className="btn btn-outline-secondary">Cancelar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
