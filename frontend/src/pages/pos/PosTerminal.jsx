import { useEffect, useMemo, useState } from 'react';
import AppShell from '../../components/AppShell';
import EmptyState from '../../components/EmptyState';
import Icon from '../../components/Icon';
import LoadingScreen from '../../components/LoadingScreen';
import ProductCustomizer from '../../components/ProductCustomizer';
import { api } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { getProductGlyph } from '../../utils/catalog';
import {
  buildLineKey,
  formatMoney,
  normalizeLineConfig,
  sameLineSelection,
  summarizeCartLine,
  toApiOrderItems,
} from '../../utils/orders';

const GENERAL_CUSTOMER = {
  id: 'general',
  nombre: 'Cliente general',
  telefono: 'Mostrador',
};

const NEW_CUSTOMER = {
  id: 'new',
  nombre: 'Registrar cliente',
  telefono: 'Guardar para futuras compras',
};

const EMPTY_CUSTOMER_FORM = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  direccion: '',
};

const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo', icon: 'cash', hint: 'Cobro inmediato en caja' },
  { value: 'tarjeta', label: 'Tarjeta', icon: 'receipt', hint: 'Pago con terminal' },
];

const DESCRIPTION_CLAMP = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

function buildTicketItems(ticket, productById) {
  return ticket
    .map((line) => {
      const product = productById.get(Number(line.id_producto));
      if (!product) {
        return null;
      }

      const extrasById = new Map(
        (product.extras_disponibles || []).map((extra) => [Number(extra.id_extra), extra])
      );
      const ingredientsById = new Map(
        (product.ingredientes_base || []).map((ingredient) => [Number(ingredient.id_insumo), ingredient])
      );

      const extras = (line.extras || [])
        .map((extraLine) => {
          const extra = extrasById.get(Number(extraLine.id_extra));
          if (!extra) {
            return null;
          }

          return {
            ...extra,
            cantidad: Number(extraLine.cantidad || 1),
          };
        })
        .filter(Boolean);

      const removals = (line.removals || []).map((removalLine) => {
        const ingredient = ingredientsById.get(Number(removalLine.id_insumo));
        return {
          id_insumo: Number(removalLine.id_insumo),
          nombre: ingredient?.nombre || `Ingrediente ${removalLine.id_insumo}`,
        };
      });

      const quantity = Number(line.cantidad || 1);
      const extrasTotalPerUnit = extras.reduce(
        (sum, extra) => sum + (Number(extra.precio || 0) * extra.cantidad),
        0
      );
      const unitTotal = Number(product.precio || 0) + extrasTotalPerUnit;

      return {
        key: line.key,
        id_producto: Number(product.id_producto),
        nombre: product.nombre,
        descripcion: product.descripcion,
        categoria: product.categoria,
        precio: Number(product.precio || 0),
        cantidad: quantity,
        unit_total: unitTotal,
        subtotal: unitTotal * quantity,
        can_order: Boolean(product.can_order),
        shortages: product.shortages || [],
        extras,
        removals,
      };
    })
    .filter(Boolean);
}

function upsertTicketLine(current, productId, config, editingKey = null) {
  const normalized = normalizeLineConfig(config);
  const candidate = {
    id_producto: Number(productId),
    ...normalized,
  };

  const remaining = editingKey
    ? current.filter((line) => line.key !== editingKey)
    : current;
  const duplicatedIndex = remaining.findIndex((line) => sameLineSelection(line, candidate));

  if (duplicatedIndex >= 0) {
    return remaining.map((line, index) => (
      index === duplicatedIndex
        ? { ...line, cantidad: Number(line.cantidad || 1) + normalized.cantidad }
        : line
    ));
  }

  if (editingKey) {
    return current.map((line) => (
      line.key === editingKey
        ? { ...line, ...candidate, key: editingKey }
        : line
    ));
  }

  return [
    ...current,
    {
      key: buildLineKey(),
      ...candidate,
    },
  ];
}

export default function PosTerminal() {
  const { user } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [clientes, setClientes] = useState([GENERAL_CUSTOMER]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedCustomerId, setSelectedCustomerId] = useState(GENERAL_CUSTOMER.id);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [notes, setNotes] = useState('');
  const [ticketSent, setTicketSent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState([]);
  const [customerForm, setCustomerForm] = useState(EMPTY_CUSTOMER_FORM);
  const [customizerState, setCustomizerState] = useState(null);

  const loadTerminal = async () => {
    setLoading(true);

    try {
      const [catalogResponse, clientResponse] = await Promise.all([
        api.get('/pedidos/catalogo'),
        api.get('/pedidos/clientes'),
      ]);

      setCatalog(catalogResponse.productos || []);
      setClientes([
        GENERAL_CUSTOMER,
        ...(clientResponse.clientes || []).map((client) => ({
          id: client.id_cliente,
          nombre: client.cliente,
          telefono: client.telefono || client.email || 'Registrado',
        })),
        NEW_CUSTOMER,
      ]);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerminal();
  }, []);

  const categories = useMemo(
    () => ['Todos', ...new Set(catalog.map((product) => product.categoria))],
    [catalog]
  );

  const productById = useMemo(
    () => new Map(catalog.map((product) => [Number(product.id_producto), product])),
    [catalog]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return catalog.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.categoria === selectedCategory;
      const matchesSearch = !normalizedSearch
        || product.nombre.toLowerCase().includes(normalizedSearch)
        || product.descripcion?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [catalog, search, selectedCategory]);

  const ticketItems = useMemo(
    () => buildTicketItems(ticket, productById),
    [ticket, productById]
  );

  const selectedCustomer = clientes.find((customer) => String(customer.id) === String(selectedCustomerId)) || GENERAL_CUSTOMER;
  const hasBlockedItems = ticketItems.some((item) => !item.can_order);
  const summary = useMemo(() => {
    const items = ticketItems.reduce((acc, item) => acc + item.cantidad, 0);
    const subtotal = ticketItems.reduce((acc, item) => acc + item.subtotal, 0);

    return {
      items,
      subtotal,
    };
  }, [ticketItems]);

  const addConfiguredLine = (product, config) => {
    setTicket((current) => upsertTicketLine(current, product.id_producto, config));
    setTicketSent('');
  };

  const addPlainProduct = (product) => {
    addConfiguredLine(product, { cantidad: 1, extras: [], removals: [] });
  };

  const updateLine = (key, nextQuantity) => {
    const normalizedQuantity = Number.parseInt(nextQuantity, 10) || 0;

    if (normalizedQuantity <= 0) {
      setTicket((current) => current.filter((item) => item.key !== key));
      return;
    }

    setTicket((current) => current.map((item) => (
      item.key === key ? { ...item, cantidad: normalizedQuantity } : item
    )));
    setTicketSent('');
  };

  const removeLine = (key) => {
    setTicket((current) => current.filter((item) => item.key !== key));
    setTicketSent('');
  };

  const clearTicket = () => {
    setTicket([]);
    setNotes('');
    setSelectedCustomerId(GENERAL_CUSTOMER.id);
    setPaymentMethod('efectivo');
    setCustomerForm(EMPTY_CUSTOMER_FORM);
    setTicketSent('');
  };

  const handleSubmit = async () => {
    setError('');
    setTicketSent('');

    if (!ticket.length) {
      setTicketSent('Agrega al menos un producto antes de registrar el pedido.');
      return;
    }

    if (hasBlockedItems) {
      setError('Hay productos sin stock suficiente en el ticket actual.');
      return;
    }

    if (selectedCustomerId === NEW_CUSTOMER.id) {
      if (!customerForm.nombre.trim()) {
        setError('Ingresa al menos el nombre del cliente para registrarlo.');
        return;
      }

      if (!customerForm.telefono.trim() && !customerForm.email.trim()) {
        setError('Para guardar un cliente nuevo, ingresa teléfono o correo.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        canal: 'mostrador',
        metodo_pago: paymentMethod,
        notas: notes,
        items: toApiOrderItems(ticket),
      };

      if (selectedCustomerId === NEW_CUSTOMER.id) {
        payload.customer = {
          nombre: customerForm.nombre,
          apellido: customerForm.apellido,
          telefono: customerForm.telefono,
          email: customerForm.email,
          direccion: customerForm.direccion,
        };
      } else if (selectedCustomerId !== GENERAL_CUSTOMER.id) {
        payload.id_cliente = Number(selectedCustomerId);
      }

      const response = await api.post('/pedidos', payload);

      const successMessage = `Pedido ${response.pedido.codigo} registrado correctamente.`;
      clearTicket();
      setTicketSent(successMessage);
      await loadTerminal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen label="Cargando terminal POS..." />;
  }

  const isRegisteringCustomer = selectedCustomerId === NEW_CUSTOMER.id;

  return (
    <AppShell
      title="Terminal POS"
      subtitle="Flujo rápido para mostrador con ticket real, personalizaciones y consumo de inventario."
      actions={(
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-[var(--app-border-strong)] bg-white px-5 text-sm font-semibold text-[var(--app-text)] shadow-[var(--shadow-soft)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            onClick={clearTicket}
          >
            Limpiar ticket
          </button>
          <button
            type="button"
            className="inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-[var(--brand)] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(114,14,16,0.22)] transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Registrando...' : 'Confirmar pedido'}
          </button>
        </div>
      )}
    >
      {error && <div className="alert alert-danger">{error}</div>}
      {ticketSent && <div className="alert alert-success">{ticketSent}</div>}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_24rem] 2xl:grid-cols-[minmax(0,1.5fr)_26rem]">
        <section className="min-w-0 space-y-4">
          <div className="surface-card p-4 sm:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="min-w-0">
                <div className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                  Buscar producto
                </div>
                <input
                  className="form-control form-control-lg"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tacos, bebida, combo..."
                />

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Visibles
                    </div>
                    <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{filteredProducts.length}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      En ticket
                    </div>
                    <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{summary.items}</div>
                  </div>
                  <div className="surface-panel px-3 py-3">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                      Total
                    </div>
                    <div className="mt-1 text-xl font-extrabold text-[var(--brand)]">{formatMoney(summary.subtotal)}</div>
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                    Categoría
                  </div>
                  <div className="text-sm text-[var(--app-text-muted)]">Filtro rápido</div>
                </div>
                <div className="-mx-1 overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-2 px-1">
                    {categories.map((category) => {
                      const active = selectedCategory === category;

                      return (
                        <button
                          key={category}
                          type="button"
                          className={[
                            'inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition',
                            active
                              ? 'border-[var(--brand)] bg-[var(--brand)] text-white shadow-[0_10px_24px_rgba(114,14,16,0.18)]'
                              : 'border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-[var(--brand)] hover:text-[var(--brand)]',
                          ].join(' ')}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="small text-uppercase text-muted fw-semibold">Catálogo rápido</div>
                <h2 className="h4 mb-0">
                  {selectedCategory === 'Todos' ? 'Todos los productos' : selectedCategory}
                </h2>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge rounded-pill soft-secondary px-3 py-2">
                  {filteredProducts.length} productos
                </span>
                <span className="badge rounded-pill soft-warning px-3 py-2">
                  Tocar para agregar
                </span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                icon="search"
                title="No hay productos para este filtro"
                description="Prueba otra categoría o cambia el texto de búsqueda."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id_producto}
                    className={[
                      'flex min-h-[13rem] flex-col justify-between rounded-[1.35rem] border p-4 shadow-[var(--shadow-soft)]',
                      product.can_order
                        ? 'border-[var(--app-border)] bg-white'
                        : 'border-red-200 bg-red-50/70',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--app-surface-soft)] text-2xl text-[var(--brand)]">
                            <Icon name={getProductGlyph(product)} className="h-6 w-6" />
                          </span>
                          <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--app-text-muted)]">
                            {product.categoria}
                          </span>
                        </div>
                        <div className="mb-2 text-[1.15rem] font-bold leading-[1.15] text-[var(--app-text)]">
                          {product.nombre}
                        </div>
                        <div className="text-sm leading-5 text-[var(--app-text-muted)]" style={DESCRIPTION_CLAMP}>
                          {product.descripcion || 'Disponible para mostrador.'}
                        </div>
                      </div>
                      <span className="inline-flex min-h-[2.35rem] shrink-0 items-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 text-sm font-semibold text-[var(--app-text)]">
                        {formatMoney(product.precio)}
                      </span>
                    </div>

                    {!product.can_order && (
                      <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {product.shortages?.[0]
                          ? `Sin stock suficiente de ${product.shortages[0].nombre}.`
                          : 'Producto no disponible ahora.'}
                      </div>
                    )}

                    <div className="mt-4 grid gap-2">
                      <button
                        type="button"
                        className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-4 text-sm font-bold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => addPlainProduct(product)}
                        disabled={!product.can_order}
                      >
                        <Icon name="addCircle" className="h-4 w-4" />
                        Agregar rápido
                      </button>
                      <button
                        type="button"
                        className="inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-2xl border border-[var(--app-border)] bg-white px-4 text-sm font-semibold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setCustomizerState({
                          product,
                          lineKey: null,
                          initialConfig: null,
                        })}
                        disabled={!product.can_order}
                      >
                        <Icon name="sliders" className="h-4 w-4" />
                        Personalizar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <div className="space-y-4">
            <div className="surface-card p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="small text-uppercase text-muted fw-semibold">Pedido actual</div>
                  <h2 className="h4 mb-0">{summary.items} artículos</h2>
                </div>
                <div className="rounded-full bg-amber-100 px-3 py-2 text-sm font-bold text-amber-800">
                  {formatMoney(summary.subtotal)}
                </div>
              </div>

              {hasBlockedItems && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  El ticket tiene productos sin stock suficiente.
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="form-label text-muted small text-uppercase">Cliente</label>
                  <select
                    className="form-select form-select-lg"
                    value={selectedCustomerId}
                    onChange={(event) => setSelectedCustomerId(event.target.value)}
                  >
                    {clientes.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 text-sm text-[var(--app-text-muted)]">
                    {selectedCustomer.telefono}
                  </div>
                  {!isRegisteringCustomer && selectedCustomerId === GENERAL_CUSTOMER.id && (
                    <div className="mt-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-3 py-2 text-sm text-[var(--app-text-muted)]">
                      Usa esta opción si el cliente no quiere quedar registrado para futuras compras.
                    </div>
                  )}
                  {!isRegisteringCustomer && selectedCustomerId !== GENERAL_CUSTOMER.id && (
                    <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                      Este cliente quedará vinculado al pedido para futuras compras y reportes.
                    </div>
                  )}
                </div>

                {isRegisteringCustomer && (
                  <div className="grid gap-3">
                    <div className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-soft)] px-4 py-4">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
                        Nuevo cliente
                      </div>
                      <div className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">
                        Este cliente quedará guardado en la base para compras futuras. Si no quiere registrarse, usa "Cliente general".
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="form-label text-muted small text-uppercase">Nombre *</label>
                        <input
                          className="form-control"
                          value={customerForm.nombre}
                          onChange={(event) => setCustomerForm((current) => ({ ...current, nombre: event.target.value }))}
                          placeholder="Nombre"
                        />
                      </div>
                      <div>
                        <label className="form-label text-muted small text-uppercase">Apellido</label>
                        <input
                          className="form-control"
                          value={customerForm.apellido}
                          onChange={(event) => setCustomerForm((current) => ({ ...current, apellido: event.target.value }))}
                          placeholder="Apellido"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="form-label text-muted small text-uppercase">Teléfono</label>
                        <input
                          className="form-control"
                          value={customerForm.telefono}
                          onChange={(event) => setCustomerForm((current) => ({ ...current, telefono: event.target.value }))}
                          placeholder="502..."
                        />
                      </div>
                      <div>
                        <label className="form-label text-muted small text-uppercase">Correo</label>
                        <input
                          className="form-control"
                          value={customerForm.email}
                          onChange={(event) => setCustomerForm((current) => ({ ...current, email: event.target.value }))}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label text-muted small text-uppercase">Dirección o referencia</label>
                      <input
                        className="form-control"
                        value={customerForm.direccion}
                        onChange={(event) => setCustomerForm((current) => ({ ...current, direccion: event.target.value }))}
                        placeholder="Dirección, colonia o referencia"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="form-label text-muted small text-uppercase">Método de pago</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentMethod === method.value;

                      return (
                        <button
                          key={method.value}
                          type="button"
                          className={[
                            'rounded-[1.35rem] border px-4 py-4 text-left transition',
                            active
                              ? 'border-[var(--brand)] bg-[var(--brand)] text-white shadow-[0_10px_24px_rgba(114,14,16,0.18)]'
                              : 'border-[var(--app-border)] bg-white text-[var(--app-text)] hover:border-[var(--brand)]',
                          ].join(' ')}
                          onClick={() => setPaymentMethod(method.value)}
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Icon name={method.icon} className="h-4 w-4" />
                            {method.label}
                          </div>
                          <div className={`mt-2 text-xs ${active ? 'text-white/80' : 'text-[var(--app-text-muted)]'}`}>
                            {method.hint}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label text-muted small text-uppercase">Notas</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Sin cebolla, extra salsa, para llevar..."
                  />
                </div>
              </div>
            </div>

            <div className="surface-card p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="small text-uppercase text-muted fw-semibold">Ticket</div>
                  <h2 className="h5 mb-0">Detalle del pedido</h2>
                </div>
                <div className="font-semibold text-[var(--brand)]">{formatMoney(summary.subtotal)}</div>
              </div>

              {!ticketItems.length ? (
                <EmptyState
                  icon="receipt"
                  title="Sin productos en el ticket"
                  description="Agrega productos del catálogo para registrar un nuevo pedido."
                />
              ) : (
                <>
                  <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {ticketItems.map((item) => {
                      const selections = summarizeCartLine(item);

                      return (
                        <div key={item.key} className="surface-panel px-3 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-[var(--app-text)]">{item.nombre}</div>
                              <div className="mt-1 text-sm text-[var(--app-text-muted)]">
                                {formatMoney(item.unit_total)} por unidad
                              </div>
                            </div>
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 transition hover:bg-red-100"
                              onClick={() => removeLine(item.key)}
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </div>

                          {selections.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {selections.map((selection) => (
                                <span key={`${item.key}-${selection}`} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--app-text-muted)]">
                                  {selection}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex flex-col gap-3">
                            <button
                              type="button"
                              className="inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-2xl border border-[var(--app-border)] bg-white px-4 text-sm font-semibold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                              onClick={() => {
                                const rawLine = ticket.find((line) => line.key === item.key);
                                const product = productById.get(item.id_producto);
                                if (!rawLine || !product) {
                                  return;
                                }

                                setCustomizerState({
                                  product,
                                  lineKey: item.key,
                                  initialConfig: rawLine,
                                });
                              }}
                            >
                              <Icon name="sliders" className="h-4 w-4" />
                              Editar configuración
                            </button>

                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                  onClick={() => updateLine(item.key, item.cantidad - 1)}
                                >
                                  -
                                </button>
                                <div className="min-w-[3rem] rounded-xl border border-[var(--app-border)] bg-white px-3 py-2 text-center font-semibold text-[var(--app-text)]">
                                  {item.cantidad}
                                </div>
                                <button
                                  type="button"
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-border)] bg-white text-lg font-bold text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                  onClick={() => updateLine(item.key, item.cantidad + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-[var(--app-text-muted)]">Subtotal</div>
                                <div className="font-bold text-[var(--app-text)]">{formatMoney(item.subtotal)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-[1.35rem] border border-[var(--app-border)] bg-[var(--app-surface-soft)] p-4">
                    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm text-[var(--app-text-muted)]">
                      <span>Artículos</span>
                      <span>{summary.items}</span>
                      <span>Subtotal</span>
                      <span>{formatMoney(summary.subtotal)}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[1.05rem] font-bold text-[var(--app-text)]">
                      <span>Total</span>
                      <span>{formatMoney(summary.subtotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      <ProductCustomizer
        product={customizerState?.product || null}
        open={Boolean(customizerState)}
        title={customizerState?.lineKey ? 'Editar producto del ticket' : 'Personalizar producto'}
        submitLabel={customizerState?.lineKey ? 'Guardar cambios' : 'Agregar al ticket'}
        initialConfig={customizerState?.initialConfig || null}
        onClose={() => setCustomizerState(null)}
        onSubmit={(config) => {
          setTicket((current) => upsertTicketLine(
            current,
            customizerState.product.id_producto,
            config,
            customizerState.lineKey || null
          ));
          setTicketSent('');
          setCustomizerState(null);
        }}
      />
    </AppShell>
  );
}
