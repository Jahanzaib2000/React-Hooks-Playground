// Helper utilities for the useReducer Shopping Cart Playground

export function createInitialCartState() {
  return {
    items: [],
    totalCount: 0,
    totalAmount: 0
  };
}

function computeTotals(items) {
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, totalCount, totalAmount };
}

/**
 * Pure shopping cart reducer function
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const targetId = typeof action.payload === 'object' && action.payload !== null
        ? action.payload.id
        : action.payload;
      const existingIndex = state.items.findIndex((i) => i.id === targetId);
      let nextItems;
      if (existingIndex > -1) {
        nextItems = state.items.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const productData = typeof action.payload === 'object' ? action.payload : { id: targetId };
        nextItems = [...state.items, { ...productData, quantity: 1 }];
      }
      return computeTotals(nextItems);
    }

    case 'DECREMENT_ITEM': {
      const targetId = typeof action.payload === 'object' && action.payload !== null
        ? (action.payload.id || action.payload.productId)
        : action.payload;
      const existing = state.items.find((i) => i.id === targetId);
      if (!existing) return state;

      let nextItems;
      if (existing.quantity > 1) {
        nextItems = state.items.map((item) =>
          item.id === targetId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        nextItems = state.items.filter((item) => item.id !== targetId);
      }
      return computeTotals(nextItems);
    }

    case 'REMOVE_ITEM': {
      const targetId = typeof action.payload === 'object' && action.payload !== null
        ? (action.payload.id || action.payload.productId)
        : action.payload;
      const existing = state.items.find((i) => i.id === targetId);
      if (!existing) return state;

      const nextItems = state.items.filter((item) => item.id !== targetId);
      return computeTotals(nextItems);
    }

    case 'CLEAR_CART': {
      return { items: [], totalCount: 0, totalAmount: 0 };
    }

    default:
      return state;
  }
}

/**
 * Builds metadata for Timeline render cards for useReducer actions
 */
export function buildReducerClickInfo({
  actionType,
  actionPayload,
  _prevState,
  nextState,
  detail = '',
  totalCount,
  totalAmount,
  itemsCount,
  strategy = 'use-reducer'
}) {
  const finalTotalCount = nextState !== undefined ? nextState.totalCount : (totalCount || 0);
  const finalTotalAmount = nextState !== undefined ? nextState.totalAmount : (totalAmount || 0);
  const items = nextState ? nextState.items : [];
  const itemName = actionPayload?.name || (typeof actionPayload === 'string' ? actionPayload : '');

  return {
    actionType,
    actionPayload,
    lastItemName: itemName,
    items,
    detail: detail || `${actionType}: ${itemName || 'cart'}`,
    totalCount: finalTotalCount,
    totalAmount: finalTotalAmount,
    itemsCount: items.length || itemsCount || 0,
    summary: `${finalTotalCount} item${finalTotalCount === 1 ? '' : 's'} ($${finalTotalAmount})`,
    strategy
  };
}

/**
 * Provides initial timeline metadata on lesson mount
 */
export function getInitialUseReducerInfo(_lessonId = 'ured-cart-actions', tokenId = '') {
  return {
    actionType: 'INITIAL_MOUNT',
    detail: 'Cart initialized empty',
    totalCount: 0,
    totalAmount: 0,
    itemsCount: 0,
    summary: '0 items ($0)',
    strategy: tokenId || 'use-reducer'
  };
}
