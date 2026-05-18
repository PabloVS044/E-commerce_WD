import {
  buildLineKey,
  normalizeLineConfig,
  sameLineSelection,
} from '../utils/orders.js';

export const CUSTOMER_CART_ACTIONS = {
  ADD_CONFIGURED_PRODUCT: 'ADD_CONFIGURED_PRODUCT',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LATEST_ORDER_CODE: 'SET_LATEST_ORDER_CODE',
};

export function createCustomerCartState(initialCart = [], initialOrderCode = '') {
  return {
    cart: Array.isArray(initialCart) ? initialCart : [],
    latestOrderCode: typeof initialOrderCode === 'string' ? initialOrderCode : '',
  };
}

function addConfiguredProduct(state, product, config = {}) {
  const normalized = normalizeLineConfig(config);
  const candidate = {
    id_producto: Number(product.id_producto),
    ...normalized,
  };

  const existingIndex = state.cart.findIndex((line) => sameLineSelection(line, candidate));

  if (existingIndex >= 0) {
    return {
      ...state,
      cart: state.cart.map((line, index) => (
        index === existingIndex
          ? { ...line, cantidad: Number(line.cantidad || 1) + normalized.cantidad }
          : line
      )),
    };
  }

  return {
    ...state,
    cart: [
      ...state.cart,
      {
        key: buildLineKey(),
        id_producto: candidate.id_producto,
        cantidad: normalized.cantidad,
        extras: normalized.extras,
        removals: normalized.removals,
      },
    ],
  };
}

function updateCartItem(state, key, nextQuantity) {
  const normalizedQuantity = Number.parseInt(nextQuantity, 10) || 0;

  if (normalizedQuantity <= 0) {
    return {
      ...state,
      cart: state.cart.filter((item) => item.key !== key),
    };
  }

  return {
    ...state,
    cart: state.cart.map((item) => (
      item.key === key ? { ...item, cantidad: normalizedQuantity } : item
    )),
  };
}

export function customerCartReducer(state, action) {
  switch (action.type) {
    case CUSTOMER_CART_ACTIONS.ADD_CONFIGURED_PRODUCT:
      return addConfiguredProduct(state, action.product, action.config);

    case CUSTOMER_CART_ACTIONS.UPDATE_CART_ITEM:
      return updateCartItem(state, action.key, action.nextQuantity);

    case CUSTOMER_CART_ACTIONS.REMOVE_CART_ITEM:
      return {
        ...state,
        cart: state.cart.filter((item) => item.key !== action.key),
      };

    case CUSTOMER_CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case CUSTOMER_CART_ACTIONS.SET_LATEST_ORDER_CODE:
      return {
        ...state,
        latestOrderCode: String(action.code || ''),
      };

    default:
      return state;
  }
}
