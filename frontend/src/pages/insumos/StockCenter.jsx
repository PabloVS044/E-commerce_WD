import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import Icon from '../../components/Icon';
import LoadingScreen from '../../components/LoadingScreen';
import StatusBadge from '../../components/StatusBadge';
import { api } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const EMPTY_LINE = { id_insumo: '', cantidad: '', costo_unitario: '' };

function money(value) {
  return `Q${Number(value || 0).toFixed(2)}`;
}

export default function StockCenter() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [proveedores, setProveedores] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [stockCritico, setStockCritico] = useState([]);
  const [form, setForm] = useState({
    id_proveedor: '',
    observaciones: '',
    detalles: [{ ...EMPTY_LINE }],
  });

  const loadData = async () => {
    try {
      const [proveedoresResponse, insumosResponse, stockResponse] = await Promise.all([
        api.get('/insumos/proveedores'),
        api.get('/insumos'),
        api.get('/consultas/views/stock-critico'),
      ]);

      setProveedores(proveedoresResponse.proveedores);
      setInsumos(insumosResponse.insumos);
      setStockCritico(stockResponse.datos);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProviderName = useMemo(() => (
    proveedores.find((proveedor) => String(proveedor.id_proveedor) === String(form.id_proveedor))?.nombre
  ), [form.id_proveedor, proveedores]);

  const insumosFiltrados = useMemo(() => {
    if (!selectedProviderName) {
      return [];
    }

    return insumos.filter((insumo) => insumo.proveedor === selectedProviderName);
  }, [insumos, selectedProviderName]);

  const totalCompra = useMemo(() => form.detalles.reduce((acc, detalle) => (
    acc + (Number(detalle.cantidad || 0) * Number(detalle.costo_unitario || 0))
  ), 0), [form.detalles]);

  const totalDeficit = useMemo(() => stockCritico.reduce((acc, item) => (
    acc + Number(item.deficit || 0)
  ), 0), [stockCritico]);

  const updateLine = (index, field, value) => {
    setForm((current) => ({
      ...current,
      detalles: current.detalles.map((detalle, detailIndex) => (
        detailIndex === index ? { ...detalle, [field]: value } : detalle
      )),
    }));
    setSuccess('');
  };

  const addLine = () => {
    setForm((current) => ({
      ...current,
      detalles: [...current.detalles, { ...EMPTY_LINE }],
    }));
  };

  const removeLine = (index) => {
    setForm((current) => ({
      ...current,
      detalles: current.detalles.filter((_, detailIndex) => detailIndex !== index),
    }));
  };

  const resetForm = () => {
    setForm({
      id_proveedor: '',
      observaciones: '',
      detalles: [{ ...EMPTY_LINE }],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/compras-insumos', {
        id_proveedor: Number(form.id_proveedor),
        id_empleado: user?.id,
        observaciones: form.observaciones,
        detalles: form.detalles.map((detalle) => ({
          id_insumo: Number(detalle.id_insumo),
          cantidad: Number(detalle.cantidad),
          costo_unitario: Number(detalle.costo_unitario),
        })),
      });

      setSuccess('Compra registrada. El stock crítico se actualizó correctamente.');
      resetForm();
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen label="Cargando módulo de reabastecimiento..." />;
  }

  return (
    <AppShell
      title="Reabastecimiento"
      subtitle="Registra compras de insumos y atiende el stock crítico desde una sola pantalla."
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)]">
        <section className="min-w-0">
          <div className="surface-card p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="h4 mb-1">Stock crítico</h2>
                <p className="mb-0 text-sm leading-6 text-[var(--app-text-muted)]">
                  Prioriza los insumos por debajo del mínimo antes de registrar la compra.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="surface-panel px-3 py-3">
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                    Insumos críticos
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{stockCritico.length}</div>
                </div>
                <div className="surface-panel px-3 py-3">
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                    Déficit total
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{Number(totalDeficit).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {!stockCritico.length ? (
              <EmptyState title="Todo en orden" description="No hay insumos por debajo del mínimo." />
            ) : (
              <div className="space-y-3 xl:max-h-[calc(100vh-15rem)] xl:overflow-y-auto xl:pr-1">
                {stockCritico.map((item) => (
                  <div key={item.id_insumo} className="surface-panel px-4 py-4">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-[var(--app-text)]">{item.insumo}</div>
                        <div className="text-sm text-[var(--app-text-muted)]">{item.proveedor}</div>
                      </div>
                      <StatusBadge status="pendiente" />
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--app-border)] bg-white px-3 py-3">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                          Stock actual
                        </div>
                        <div className="mt-1 text-lg font-bold text-[var(--app-text)]">
                          {Number(item.stock_actual).toFixed(2)}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[var(--app-border)] bg-white px-3 py-3">
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                          Stock mínimo
                        </div>
                        <div className="mt-1 text-lg font-bold text-[var(--app-text)]">
                          {Number(item.stock_minimo).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-[#f6d38a] bg-[var(--warning-soft)] px-3 py-3">
                      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#8a5b00]">
                        Déficit estimado
                      </div>
                      <div className="mt-1 text-lg font-extrabold text-[#8a5b00]">
                        {Number(item.deficit).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="min-w-0">
          <div className="surface-card p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="h4 mb-1">Registrar compra</h2>
                <p className="mb-0 text-sm leading-6 text-[var(--app-text-muted)]">
                  Usa el endpoint transaccional de compras de insumos.
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--warning-soft)] px-4 py-3 text-right">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#8a5b00]">
                  Total actual
                </div>
                <div className="mt-1 text-xl font-extrabold text-[#8a5b00]">{money(totalCompra)}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="min-w-0">
                  <label className="form-label">Proveedor</label>
                  <select
                    className="form-select"
                    value={form.id_proveedor}
                    onChange={(event) => {
                      setForm({
                        id_proveedor: event.target.value,
                        observaciones: form.observaciones,
                        detalles: [{ ...EMPTY_LINE }],
                      });
                      setSuccess('');
                    }}
                    required
                  >
                    <option value="">Selecciona un proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="form-label">Empleado</label>
                  <input
                    className="form-control"
                    value={`${user?.nombre || ''} ${user?.apellido || ''}`.trim()}
                    disabled
                  />
                </div>

                <div className="min-w-0 md:col-span-2">
                  <label className="form-label">Observaciones</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={form.observaciones}
                    onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))}
                    placeholder="Entrega parcial, factura pendiente, observaciones de calidad..."
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="h5 mb-1">Detalle de compra</h3>
                  <p className="mb-0 text-sm text-[var(--app-text-muted)]">
                    Agrega las líneas de compra según el proveedor seleccionado.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={addLine}
                  disabled={!form.id_proveedor}
                >
                  Agregar línea
                </button>
              </div>

              <div className="mt-4">
                {!form.id_proveedor ? (
                  <EmptyState
                    icon="shop"
                    title="Selecciona un proveedor"
                    description="Al elegir proveedor se mostrarán sus insumos disponibles."
                  />
                ) : (
                  <div className="space-y-3">
                    {form.detalles.map((detalle, index) => (
                      <div key={`detalle-${index}`} className="surface-panel px-4 py-4">
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_auto] lg:items-end">
                          <div className="min-w-0">
                            <label className="form-label">Insumo</label>
                            <select
                              className="form-select"
                              value={detalle.id_insumo}
                              onChange={(event) => updateLine(index, 'id_insumo', event.target.value)}
                              required
                            >
                              <option value="">Selecciona un insumo</option>
                              {insumosFiltrados.map((insumo) => (
                                <option key={insumo.id_insumo} value={insumo.id_insumo}>
                                  {insumo.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="min-w-0">
                            <label className="form-label">Cantidad</label>
                            <input
                              className="form-control"
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={detalle.cantidad}
                              onChange={(event) => updateLine(index, 'cantidad', event.target.value)}
                              required
                            />
                          </div>

                          <div className="min-w-0">
                            <label className="form-label">Costo unitario</label>
                            <input
                              className="form-control"
                              type="number"
                              min="0"
                              step="0.01"
                              value={detalle.costo_unitario}
                              onChange={(event) => updateLine(index, 'costo_unitario', event.target.value)}
                              required
                            />
                          </div>

                          <div className="min-w-0">
                            <label className="form-label opacity-0">Eliminar</label>
                            <button
                              type="button"
                              className="inline-flex h-[3rem] w-full items-center justify-center rounded-2xl border border-[#e3a8a0] bg-white px-4 text-[#b3261e] transition hover:bg-[#ffe4e0] lg:w-[3.25rem]"
                              onClick={() => removeLine(index)}
                              disabled={form.detalles.length === 1}
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-3">
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                    Total estimado
                  </div>
                  <div className="mt-1 text-lg font-extrabold text-[var(--brand)]">{money(totalCompra)}</div>
                </div>
                <button type="submit" className="btn btn-brand" disabled={saving}>
                  {saving ? 'Registrando...' : 'Registrar compra'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
