import { describe, expect, it } from 'vitest';
import {
  createCustomerCartState,
  customerCartReducer,
  CUSTOMER_CART_ACTIONS,
} from '../src/context/customerCartReducer';

describe('customerCartReducer', () => {
  it('combina lineas identicas del carrito y acumula la cantidad', () => {
    const initialState = createCustomerCartState();
    const product = { id_producto: 11 };
    const config = {
      cantidad: 2,
      extras: [{ id_extra: 5, cantidad: 1 }],
      removals: [{ id_insumo: 9 }],
    };

    const firstPass = customerCartReducer(initialState, {
      type: CUSTOMER_CART_ACTIONS.ADD_CONFIGURED_PRODUCT,
      product,
      config,
    });

    const secondPass = customerCartReducer(firstPass, {
      type: CUSTOMER_CART_ACTIONS.ADD_CONFIGURED_PRODUCT,
      product,
      config,
    });

    expect(secondPass.cart).toHaveLength(1);
    expect(secondPass.cart[0].cantidad).toBe(4);
  });

  it('elimina una linea cuando la cantidad resultante es cero o menor', () => {
    const state = createCustomerCartState([
      {
        key: 'line-1',
        id_producto: 7,
        cantidad: 2,
        extras: [],
        removals: [],
      },
    ]);

    const nextState = customerCartReducer(state, {
      type: CUSTOMER_CART_ACTIONS.UPDATE_CART_ITEM,
      key: 'line-1',
      nextQuantity: 0,
    });

    expect(nextState.cart).toHaveLength(0);
  });

  it('guarda el ultimo codigo de pedido sin tocar el carrito', () => {
    const state = createCustomerCartState([
      { key: 'line-1', id_producto: 3, cantidad: 1, extras: [], removals: [] },
    ]);

    const nextState = customerCartReducer(state, {
      type: CUSTOMER_CART_ACTIONS.SET_LATEST_ORDER_CODE,
      code: 'PED-001',
    });

    expect(nextState.latestOrderCode).toBe('PED-001');
    expect(nextState.cart).toHaveLength(1);
  });
});
