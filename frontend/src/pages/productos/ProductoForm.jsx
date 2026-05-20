import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import LoadingScreen from '../../components/LoadingScreen';
import { api } from '../../api/api';

const MAX_SIZE_MB = 4;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

function DefinitionRow({ title, description, actionLabel, onAdd, children }) {
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

// ─── Sección de imagen ────────────────────────────────────────────────────────
function ImagenProducto({ currentUrl, onImageChange, onImageRemove, imageError, setImageError }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl || null);
  const [pendingDataUrl, setPendingDataUrl] = useState(null); // nueva imagen seleccionada
  const [markedForRemoval, setMarkedForRemoval] = useState(false);

  // Sync preview cuando cambia el producto en edición
  useEffect(() => {
    if (!pendingDataUrl && !markedForRemoval) {
      setPreview(currentUrl || null);
    }
  }, [currentUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');

    if (!ACCEPTED_MIME.includes(file.type)) {
      setImageError('Solo se aceptan imágenes PNG, JPG, WEBP o GIF.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setImageError(`La imagen supera el máximo de ${MAX_SIZE_MB} MB.`);
      e.target.value = '';
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setPreview(dataUrl);
      setPendingDataUrl(dataUrl);
      setMarkedForRemoval(false);
      onImageChange(dataUrl);
    } catch {
      setImageError('No se pudo leer la imagen seleccionada.');
    }

    e.target.value = '';
  };

  const handleRemove = () => {
    setPreview(null);
    setPendingDataUrl(null);
    setMarkedForRemoval(true);
    setImageError('');
    onImageRemove();
  };

  const hasImage = Boolean(preview);

  return (
    <div className="surface-card p-3 p-lg-4">
      <h2 className="h5 mb-1">Imagen del producto</h2>
      <p className="mb-3 text-sm text-[var(--app-text-muted)]">
        Foto visible en el catálogo. PNG, JPG, WEBP o GIF · máx. {MAX_SIZE_MB} MB.
      </p>

      {imageError && (
        <div className="alert alert-danger py-2 mb-3 text-sm">{imageError}</div>
      )}

      <div className="d-flex flex-wrap align-items-start gap-4">
        {/* Preview */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '2px dashed var(--app-border)',
            background: 'var(--app-surface-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {hasImage ? (
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>🌮</span>
          )}
        </div>

        {/* Acciones */}
        <div className="d-flex flex-column gap-2 justify-content-center" style={{ minHeight: 140 }}>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            {hasImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </button>

          {hasImage && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleRemove}
            >
              Quitar imagen
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_MIME.join(',')}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            id="producto-imagen-input"
          />
        </div>
      </div>

      {markedForRemoval && currentUrl && (
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          ⚠️ La imagen actual se eliminará al guardar.
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
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
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // imagen: undefined = sin cambio | null = borrar | string = nueva data URL
  const [imagenPayload, setImagenPayload] = useState(undefined);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/productos/categorias'),
      api.get('/insumos'),
      api.get('/productos'),
      isEdit ? api.get(`/productos/${id}`) : Promise.resolve(null),
    ])
      .then(([categoriasRes, insumosRes, productosRes, productoRes]) => {
        if (!active) return;

        setCategorias(categoriasRes.categorias);
        setInsumos(insumosRes.insumos);
        setProductos(productosRes.productos);

        if (productoRes?.producto) {
          const p = productoRes.producto;
          setForm({
            id_categoria_producto: String(p.id_categoria_producto),
            nombre: p.nombre,
            descripcion: p.descripcion || '',
            precio: String(p.precio),
            disponible: Boolean(p.disponible),
            receta: p.receta?.length
              ? p.receta.map((line) => createRecipeLine(line))
              : [createRecipeLine()],
            componentes_combo: p.componentes_combo?.length
              ? p.componentes_combo.map((line) => createComboLine(line))
              : [createComboLine()],
          });
          setCurrentImageUrl(p.imagen_url || null);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id, isEdit]);

  const categoriasById = useMemo(
    () => new Map(categorias.map((c) => [String(c.id_categoria_producto), c])),
    [categorias]
  );

  const insumosById = useMemo(
    () => new Map(insumos.map((i) => [String(i.id_insumo), i])),
    [insumos]
  );

  const selectedCategory = categoriasById.get(form.id_categoria_producto);
  const comboCategoryId = useMemo(
    () => categorias.find((c) => isComboCategory(c.nombre))?.id_categoria_producto,
    [categorias]
  );
  const isComboProduct = isComboCategory(selectedCategory?.nombre);

  const availableComponentProducts = useMemo(
    () => productos.filter((p) => p.id_producto !== currentProductId),
    [productos, currentProductId]
  );

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((cur) => ({ ...cur, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategoryChange = (e) => {
    const nextId = e.target.value;
    const nextCat = categoriasById.get(nextId);
    const nextIsCombo = isComboCategory(nextCat?.nombre);
    setForm((cur) => ({
      ...cur,
      id_categoria_producto: nextId,
      receta: !nextIsCombo && cur.receta.length === 0 ? [createRecipeLine()] : cur.receta,
      componentes_combo: nextIsCombo && cur.componentes_combo.length === 0
        ? [createComboLine()]
        : cur.componentes_combo,
    }));
  };

  const setRecipeLine = (lineId, field, value) =>
    setForm((cur) => ({ ...cur, receta: cur.receta.map((l) => l.lineId === lineId ? { ...l, [field]: value } : l) }));

  const setComboLine = (lineId, field, value) =>
    setForm((cur) => ({ ...cur, componentes_combo: cur.componentes_combo.map((l) => l.lineId === lineId ? { ...l, [field]: value } : l) }));

  const addRecipeLine = () => setForm((cur) => ({ ...cur, receta: [...cur.receta, createRecipeLine()] }));
  const addComboLine = () => setForm((cur) => ({ ...cur, componentes_combo: [...cur.componentes_combo, createComboLine()] }));

  const removeRecipeLine = (lineId) =>
    setForm((cur) => {
      const next = cur.receta.filter((l) => l.lineId !== lineId);
      return { ...cur, receta: next.length ? next : [createRecipeLine()] };
    });

  const removeComboLine = (lineId) =>
    setForm((cur) => {
      const next = cur.componentes_combo.filter((l) => l.lineId !== lineId);
      return { ...cur, componentes_combo: next.length ? next : [createComboLine()] };
    });

  const handleMarkAsCombo = () => {
    if (!comboCategoryId) {
      setError('No existe una categoría de Combos configurada en la base de datos.');
      return;
    }
    setError('');
    setForm((cur) => ({
      ...cur,
      id_categoria_producto: String(comboCategoryId),
      componentes_combo: cur.componentes_combo.length ? cur.componentes_combo : [createComboLine()],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (imageError) return; // imagen inválida pendiente

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
        // Solo incluir "imagen" si hay un cambio real
        ...(imagenPayload !== undefined ? { imagen: imagenPayload } : {}),
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
      actions={<Link to="/productos" className="btn btn-outline-secondary">Volver</Link>}
    >
      <div className="mx-auto max-w-6xl">
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Datos básicos ── */}
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
                  {categorias.map((c) => (
                    <option key={c.id_categoria_producto} value={c.id_categoria_producto}>
                      {c.nombre}
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

          {/* ── Imagen ── */}
          <ImagenProducto
            currentUrl={currentImageUrl}
            imageError={imageError}
            setImageError={setImageError}
            onImageChange={(dataUrl) => setImagenPayload(dataUrl)}
            onImageRemove={() => setImagenPayload(null)}
          />

          {/* ── Receta / Combo ── */}
          {isComboProduct ? (
            <DefinitionRow
              title="Componentes del combo"
              description="Selecciona los productos que lo componen. El inventario se consumirá usando la receta de cada componente."
              actionLabel="Agregar producto"
              onAdd={addComboLine}
            >
              {form.componentes_combo.map((line, index) => {
                const selectedProduct = availableComponentProducts.find(
                  (p) => String(p.id_producto) === line.id_producto
                );
                return (
                  <div key={line.lineId} className="rounded-[1.15rem] border border-[var(--app-border)] p-3">
                    <div className="row g-3 align-items-end">
                      <div className="col-12 col-lg-7">
                        <label className="form-label">Producto #{index + 1}</label>
                        <select
                          className="form-select"
                          value={line.id_producto}
                          onChange={(e) => setComboLine(line.lineId, 'id_producto', e.target.value)}
                        >
                          <option value="">Selecciona un producto</option>
                          {availableComponentProducts.map((p) => (
                            <option key={p.id_producto} value={p.id_producto}>
                              {p.nombre} · {p.categoria}
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
                          onChange={(e) => setComboLine(line.lineId, 'cantidad', e.target.value)}
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
                        {selectedProduct.es_combo ? 'Este componente también es combo.' : 'Producto individual'} ·
                        Q{Number(selectedProduct.precio || 0).toFixed(2)}
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
                          onChange={(e) => setRecipeLine(line.lineId, 'id_insumo', e.target.value)}
                        >
                          <option value="">Selecciona un insumo</option>
                          {insumos.map((i) => (
                            <option key={i.id_insumo} value={i.id_insumo}>
                              {i.nombre} · {i.unidad_medida}
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
                          onChange={(e) => setRecipeLine(line.lineId, 'cantidad', e.target.value)}
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
                        Unidad base: {selectedInsumo.unidad_medida} · Stock actual{' '}
                        {Number(selectedInsumo.stock_actual || 0).toFixed(2)}
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
            <Link to="/productos" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
