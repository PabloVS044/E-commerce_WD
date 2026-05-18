import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import LoadingScreen from '../../components/LoadingScreen';
import { api } from '../../api/api';

function createLineId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createRecipeLine(line = {}) {
  return {
    lineId: createLineId(),
    id_insumo: line.id_insumo ? String(line.id_insumo) : '',
    cantidad: line.cantidad !== undefined && line.cantidad !== null ? String(line.cantidad) : '',
  };
}

function createComboLine(line = {}) {
  return {
    lineId: createLineId(),
    id_producto: line.id_producto ? String(line.id_producto) : '',
    cantidad: line.cantidad !== undefined && line.cantidad !== null ? String(line.cantidad) : '',
  };
}

const EMPTY = {
  id_categoria_producto: '',
  nombre: '',
  descripcion: '',
  precio: '',
  disponible: true,
  receta: [createRecipeLine()],
  componentes_combo: [createComboLine()],
};

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isComboCategory(categoryName) {
  return /\bcombo/.test(normalizeText(categoryName));
}

function sanitizeRecipe(recipe) {
  return recipe
    .filter((line) => line.id_insumo || line.cantidad)
    .map((line) => ({
      id_insumo: Number(line.id_insumo),
      cantidad: Number.parseFloat(line.cantidad),
    }));
}

function sanitizeComponents(components) {
  return components
    .filter((line) => line.id_producto || line.cantidad)
    .map((line) => ({
      id_producto: Number(line.id_producto),
      cantidad: Number.parseInt(line.cantidad, 10),
    }));
}

function DefinitionRow({
  title,
  description,
  actionLabel,
  onAdd,
  children,
}) {
  return (
    <div className="surface-card p-3 p-lg-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="h5 mb-1">{title}</h2>
          <p className="mb-0 text-sm text-[var(--app-text-muted)]">{description}</p>
        </div>
        <button type="button" className="btn btn-outline-secondary" onClick={onAdd}>
          {actionLabel}
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const currentProductId = Number(id);

  const [form, setForm] = useState(EMPTY);
  const [categorias, setCategorias] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/productos/categorias'),
      api.get('/insumos'),
      api.get('/productos'),
      isEdit ? api.get(`/productos/${id}`) : Promise.resolve(null),
    ])
      .then(([categoriasResponse, insumosResponse, productosResponse, productoResponse]) => {
        if (!active) {
          return;
        }

        setCategorias(categoriasResponse.categorias);
        setInsumos(insumosResponse.insumos);
        setProductos(productosResponse.productos);

        if (productoResponse?.producto) {
          const product = productoResponse.producto;
          setForm({
            id_categoria_producto: String(product.id_categoria_producto),
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precio: String(product.precio),
            disponible: Boolean(product.disponible),
            receta: product.receta?.length
              ? product.receta.map((line) => createRecipeLine(line))
              : [createRecipeLine()],
            componentes_combo: product.componentes_combo?.length
              ? product.componentes_combo.map((line) => createComboLine(line))
              : [createComboLine()],
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

  const categoriasById = useMemo(
    () => new Map(categorias.map((categoria) => [String(categoria.id_categoria_producto), categoria])),
    [categorias]
  );

  const insumosById = useMemo(
    () => new Map(insumos.map((insumo) => [String(insumo.id_insumo), insumo])),
    [insumos]
  );

  const selectedCategory = categoriasById.get(form.id_categoria_producto);
  const comboCategoryId = useMemo(
    () => categorias.find((categoria) => isComboCategory(categoria.nombre))?.id_categoria_producto,
    [categorias]
  );
  const isComboProduct = isComboCategory(selectedCategory?.nombre);

  const availableComponentProducts = useMemo(
    () => productos.filter((product) => product.id_producto !== currentProductId),
    [productos, currentProductId]
  );

  const handleBasicChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (event) => {
    const nextCategoryId = event.target.value;
    const nextCategory = categoriasById.get(nextCategoryId);
    const nextIsCombo = isComboCategory(nextCategory?.nombre);

    setForm((current) => ({
      ...current,
      id_categoria_producto: nextCategoryId,
      receta: !nextIsCombo && current.receta.length === 0 ? [createRecipeLine()] : current.receta,
      componentes_combo: nextIsCombo && current.componentes_combo.length === 0
        ? [createComboLine()]
        : current.componentes_combo,
    }));
  };

  const setRecipeLine = (lineId, field, value) => {
    setForm((current) => ({
      ...current,
      receta: current.receta.map((line) => (
        line.lineId === lineId ? { ...line, [field]: value } : line
      )),
    }));
  };

  const setComboLine = (lineId, field, value) => {
    setForm((current) => ({
      ...current,
      componentes_combo: current.componentes_combo.map((line) => (
        line.lineId === lineId ? { ...line, [field]: value } : line
      )),
    }));
  };

  const addRecipeLine = () => {
    setForm((current) => ({
      ...current,
      receta: [...current.receta, createRecipeLine()],
    }));
  };

  const addComboLine = () => {
    setForm((current) => ({
      ...current,
      componentes_combo: [...current.componentes_combo, createComboLine()],
    }));
  };

  const removeRecipeLine = (lineId) => {
    setForm((current) => {
      const next = current.receta.filter((line) => line.lineId !== lineId);
      return {
        ...current,
        receta: next.length ? next : [createRecipeLine()],
      };
    });
  };

  const removeComboLine = (lineId) => {
    setForm((current) => {
      const next = current.componentes_combo.filter((line) => line.lineId !== lineId);
      return {
        ...current,
        componentes_combo: next.length ? next : [createComboLine()],
      };
    });
  };

  const handleMarkAsCombo = () => {
    if (!comboCategoryId) {
      setError('No existe una categoría de Combos configurada en la base de datos.');
      return;
    }

    setError('');
    setForm((current) => ({
      ...current,
      id_categoria_producto: String(comboCategoryId),
      componentes_combo: current.componentes_combo.length ? current.componentes_combo : [createComboLine()],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const receta = sanitizeRecipe(form.receta);
    const componentesCombo = sanitizeComponents(form.componentes_combo);

    if (!form.id_categoria_producto) {
      setError('Selecciona una categoría para continuar.');
      return;
    }

    if (isComboProduct && componentesCombo.length === 0) {
      setError('Debes agregar al menos un producto al combo.');
      return;
    }

    if (!isComboProduct && receta.length === 0) {
      setError('Debes agregar al menos un insumo a la receta.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        id_categoria_producto: Number(form.id_categoria_producto),
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        disponible: form.disponible,
        es_combo: isComboProduct,
        receta: isComboProduct ? [] : receta,
        componentes_combo: isComboProduct ? componentesCombo : [],
      };

      if (isEdit) {
        await api.put(`/productos/${id}`, payload);
      } else {
        await api.post('/productos', payload);
      }

      navigate('/productos');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen label={isEdit ? 'Cargando producto...' : 'Cargando formulario...'} />;
  }

  return (
    <AppShell
      title={isEdit ? 'Editar producto' : 'Nuevo producto'}
      subtitle="Registra el catálogo completo con receta para inventario o con composición de combo."
      actions={(
        <Link to="/productos" className="btn btn-outline-secondary">
          Volver
        </Link>
      )}
    >
      <div className="mx-auto max-w-6xl">
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="surface-card p-3 p-lg-4">
            <div className="row g-3">
              <div className="col-12 col-lg-4">
                <label className="form-label">Categoría *</label>
                <select
                  className="form-select"
                  name="id_categoria_producto"
                  value={form.id_categoria_producto}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id_categoria_producto} value={categoria.id_categoria_producto}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-lg-8">
                <div className="rounded-[1.1rem] border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3">
                  <div className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                    Tipo detectado
                  </div>
                  <div className="mt-1 font-semibold text-[var(--app-text)]">
                    {selectedCategory
                      ? isComboProduct
                        ? 'Combo compuesto por otros productos'
                        : 'Producto individual con receta de insumos'
                      : 'Selecciona una categoría para definir la estructura'}
                  </div>
                  {!isComboProduct && (
                    <button
                      type="button"
                      className="btn btn-link p-0 mt-2 text-decoration-none"
                      onClick={handleMarkAsCombo}
                    >
                      Convertir este alta en combo
                    </button>
                  )}
                </div>
              </div>

              <div className="col-12 col-lg-7">
                <label className="form-label">Nombre *</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleBasicChange}
                  required
                />
              </div>

              <div className="col-12 col-lg-5">
                <label className="form-label">Precio (Q) *</label>
                <input
                  className="form-control"
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={handleBasicChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleBasicChange}
                  rows={3}
                />
              </div>

              <div className="col-12">
                <div className="form-check form-switch fs-5">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="disponible"
                    name="disponible"
                    checked={form.disponible}
                    onChange={handleBasicChange}
                  />
                  <label className="form-check-label" htmlFor="disponible">
                    Producto disponible para venta
                  </label>
                </div>
              </div>
            </div>
          </div>

          {isComboProduct ? (
            <DefinitionRow
              title="Componentes del combo"
              description="Selecciona los productos que lo componen. El inventario se consumirá usando la receta de cada componente."
              actionLabel="Agregar producto"
              onAdd={addComboLine}
            >
              {form.componentes_combo.map((line, index) => {
                const selectedProduct = availableComponentProducts.find(
                  (product) => String(product.id_producto) === line.id_producto
                );

                return (
                  <div key={line.lineId} className="rounded-[1.15rem] border border-[var(--app-border)] p-3">
                    <div className="row g-3 align-items-end">
                      <div className="col-12 col-lg-7">
                        <label className="form-label">Producto #{index + 1}</label>
                        <select
                          className="form-select"
                          value={line.id_producto}
                          onChange={(event) => setComboLine(line.lineId, 'id_producto', event.target.value)}
                        >
                          <option value="">Selecciona un producto</option>
                          {availableComponentProducts.map((product) => (
                            <option key={product.id_producto} value={product.id_producto}>
                              {product.nombre} · {product.categoria}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-lg-3">
                        <label className="form-label">Cantidad</label>
                        <input
                          className="form-control"
                          type="number"
                          min="1"
                          step="1"
                          value={line.cantidad}
                          onChange={(event) => setComboLine(line.lineId, 'cantidad', event.target.value)}
                        />
                      </div>

                      <div className="col-12 col-lg-2 d-grid">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeComboLine(line.lineId)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    {selectedProduct && (
                      <div className="mt-3 text-sm text-[var(--app-text-muted)]">
                        {selectedProduct.es_combo ? 'Este componente también es combo.' : 'Producto individual'} · Q
                        {Number(selectedProduct.precio || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </DefinitionRow>
          ) : (
            <DefinitionRow
              title="Receta del producto"
              description="Define qué insumos consume una unidad del producto para que el inventario y las ventas se reflejen correctamente."
              actionLabel="Agregar insumo"
              onAdd={addRecipeLine}
            >
              {form.receta.map((line, index) => {
                const selectedInsumo = insumosById.get(line.id_insumo);

                return (
                  <div key={line.lineId} className="rounded-[1.15rem] border border-[var(--app-border)] p-3">
                    <div className="row g-3 align-items-end">
                      <div className="col-12 col-lg-7">
                        <label className="form-label">Insumo #{index + 1}</label>
                        <select
                          className="form-select"
                          value={line.id_insumo}
                          onChange={(event) => setRecipeLine(line.lineId, 'id_insumo', event.target.value)}
                        >
                          <option value="">Selecciona un insumo</option>
                          {insumos.map((insumo) => (
                            <option key={insumo.id_insumo} value={insumo.id_insumo}>
                              {insumo.nombre} · {insumo.unidad_medida}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-lg-3">
                        <label className="form-label">Cantidad</label>
                        <input
                          className="form-control"
                          type="number"
                          min="0.001"
                          step="0.001"
                          value={line.cantidad}
                          onChange={(event) => setRecipeLine(line.lineId, 'cantidad', event.target.value)}
                        />
                      </div>

                      <div className="col-12 col-lg-2 d-grid">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeRecipeLine(line.lineId)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    {selectedInsumo && (
                      <div className="mt-3 text-sm text-[var(--app-text-muted)]">
                        Unidad base: {selectedInsumo.unidad_medida} · Stock actual {Number(selectedInsumo.stock_actual || 0).toFixed(2)}
                      </div>
                    )}
                  </div>
                );
              })}
            </DefinitionRow>
          )}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-brand" disabled={saving}>
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <Link to="/productos" className="btn btn-outline-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
