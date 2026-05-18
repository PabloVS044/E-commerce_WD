import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import {
  buildLineKey,
  normalizeLineConfig,
  sameLineSelection,
  toApiOrderItems,
} from '../utils/orders';

const CART_KEY = 'tacos-el-pepe-cart';
const LAST_ORDER_KEY = 'tacos-el-pepe-last-order-code';

const CustomerUiContext = createContext(null);

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures in private mode or restricted contexts.
  }
}

export function CustomerUiProvider({ children }) {
  const [catalog, setCatalog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [latestOrderCode, setLatestOrderCode] = useState(() => readStorage(LAST_ORDER_KEY, ''));

  const refreshCatalog = async () => {
    setLoadingCatalog(true);

    try {
      const response = await api.get('/pedidos/catalogo');
      setCatalog(response.productos || []);
      setCategories(response.categorias || []);
      setCatalogError('');
    } catch (error) {
      setCatalogError(error.message);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  useEffect(() => {
    writeStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(LAST_ORDER_KEY, latestOrderCode);
  }, [latestOrderCode]);

  const productById = useMemo(
    () => new Map(catalog.map((product) => [Number(product.id_producto), product])),
    [catalog]
  );

  const cartItems = useMemo(() => {
    return cart
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

        const cantidad = Number(line.cantidad || 1);
        const unitExtrasTotal = extras.reduce(
          (sum, extra) => sum + (Number(extra.precio || 0) * extra.cantidad),
          0
        );
        const unitTotal = Number(product.precio || 0) + unitExtrasTotal;

        return {
          key: line.key,
          id_producto: Number(product.id_producto),
          nombre: product.nombre,
          descripcion: product.descripcion,
          categoria: product.categoria,
          precio: Number(product.precio || 0),
          cantidad,
          unit_total: unitTotal,
          subtotal: unitTotal * cantidad,
          can_order: Boolean(product.can_order),
          shortages: product.shortages || [],
          es_combo: Boolean(product.es_combo),
          componentes: product.componentes || [],
          extras,
          removals,
        };
      })
      .filter(Boolean);
  }, [cart, productById]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal;
  const hasBlockedItems = cartItems.some((item) => !item.can_order);

  const addConfiguredProduct = (product, config = {}) => {
    const normalized = normalizeLineConfig(config);
    const candidate = {
      id_producto: Number(product.id_producto),
      ...normalized,
    };

    setCart((current) => {
      const existingIndex = current.findIndex((line) => sameLineSelection(line, candidate));

      if (existingIndex >= 0) {
        return current.map((line, index) => (
          index === existingIndex
            ? { ...line, cantidad: Number(line.cantidad || 1) + normalized.cantidad }
            : line
        ));
      }

      return [
        ...current,
        {
          key: buildLineKey(),
          id_producto: candidate.id_producto,
          cantidad: normalized.cantidad,
          extras: normalized.extras,
          removals: normalized.removals,
        },
      ];
    });
  };

  const updateCartItem = (key, nextQuantity) => {
    const normalizedQuantity = Number.parseInt(nextQuantity, 10) || 0;

    if (normalizedQuantity <= 0) {
      setCart((current) => current.filter((item) => item.key !== key));
      return;
    }

    setCart((current) => current.map((item) => (
      item.key === key ? { ...item, cantidad: normalizedQuantity } : item
    )));
  };

  const removeCartItem = (key) => {
    setCart((current) => current.filter((item) => item.key !== key));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerInfo) => {
    if (!cart.length) {
      throw new Error('Agrega al menos un producto antes de confirmar.');
    }

    if (hasBlockedItems) {
      throw new Error('Hay productos sin stock suficiente en tu carrito. Revísalos antes de continuar.');
    }

    const response = await api.post('/pedidos/online', {
      metodo_pago: customerInfo.metodo_pago,
      notas: customerInfo.notas,
      customer: {
        nombre: customerInfo.nombre,
        apellido: customerInfo.apellido,
        telefono: customerInfo.telefono,
        email: customerInfo.email,
        direccion: customerInfo.direccion,
        referencia: customerInfo.referencia,
      },
      items: toApiOrderItems(cart),
    });

    const codigo = response.pedido?.codigo || '';
    setLatestOrderCode(codigo);
    setCart([]);
    await refreshCatalog();
    return response.pedido;
  };

  const fetchOrderByCode = async (code) => {
    const trimmed = String(code || '').trim().toUpperCase();
    if (!trimmed) {
      throw new Error('Ingresa un código de pedido.');
    }

    const response = await api.get(`/pedidos/seguimiento/${encodeURIComponent(trimmed)}`);
    return response.pedido;
  };

  const value = {
    catalog,
    categories,
    loadingCatalog,
    catalogError,
    refreshCatalog,
    cartItems,
    cartCount,
    subtotal,
    total,
    hasBlockedItems,
    latestOrderCode,
    addConfiguredProduct,
    updateCartItem,
    removeCartItem,
    clearCart,
    placeOrder,
    fetchOrderByCode,
  };

  return (
    <CustomerUiContext.Provider value={value}>
      {children}
    </CustomerUiContext.Provider>
  );
}

export function useCustomerUi() {
  return useContext(CustomerUiContext);
}
