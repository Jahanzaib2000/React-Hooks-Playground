import { buildCartTrace } from './cartTelemetry.js';
import { recordAction } from '../../shared/utils/telemetry.js';
import { useState, useReducer } from 'react';
import { SandboxContainer } from '../../shared/components';
import { createInitialCartState, cartReducer, buildReducerClickInfo } from './helpers.js';
import { UseReducerInnerSandbox } from './ReducerPlayground.jsx';

export function UseReducerSandbox({
  _activeLessonId,
  selectedTokenId,
  onRecordRender,
  onRecordTrace,
  _onRecordMutation,
  onReset
}) {
  const [renderCount, setRenderCount] = useState(1);
  const [cartState, cartDispatch] = useReducer(cartReducer, undefined, createInitialCartState);

  const handleAddToCart = (product) => {
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const prevCart = cartState;
    const nextState = cartReducer(prevCart, { type: 'ADD_ITEM', payload: product });
    cartDispatch({ type: 'ADD_ITEM', payload: product });

    const reducerInfo = buildReducerClickInfo({
      actionType: 'ADD_ITEM',
      actionPayload: product,
      prevState: prevCart,
      nextState,
      strategy: selectedTokenId
    });

    recordAction({
      onRecordRender,
      onRecordTrace,
      renderNumber: nextRender,
      trigger: `Dispatch: ADD_ITEM (${product.name})`,
      prevState: { totalCount: prevCart.totalCount, totalAmount: prevCart.totalAmount },
      currentState: { totalCount: nextState.totalCount, totalAmount: nextState.totalAmount },
      reducerInfo,
      trace: buildCartTrace({
        label: `Dispatch: ADD_ITEM ("${product.name}")`,
        renderNumber: nextRender,
        status: `dispatched { type: 'ADD_ITEM', payload: { id: '${product.id}', name: '${product.name}', price: ${product.price} } }`,
        prevState: `items: ${prevCart.totalCount}, total: $${prevCart.totalAmount}`,
        actionLabel: 'cartReducer computed next immutable state snapshot',
        nextState: `items: ${nextState.totalCount}, total: $${nextState.totalAmount}`,
        diffSummary: `Added ${product.name} ($${product.price}) to cart. Total items: ${nextState.totalCount}, total: $${nextState.totalAmount}`,
        reducerInfo
      })
    });
  };

  const handleRemoveFromCart = (productId) => {
    const prevCart = cartState;
    const targetItem = prevCart.items.find(i => i.id === productId);
    if (!targetItem) return;

    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const itemName = targetItem.name;
    const action = { type: 'REMOVE_ITEM', payload: { id: productId, name: itemName } };
    const nextState = cartReducer(prevCart, action);
    cartDispatch(action);

    const reducerInfo = buildReducerClickInfo({
      actionType: 'REMOVE_ITEM',
      actionPayload: action.payload,
      prevState: prevCart,
      nextState,
      strategy: selectedTokenId
    });

    recordAction({
      onRecordRender,
      onRecordTrace,
      renderNumber: nextRender,
      trigger: `Dispatch: REMOVE_ITEM (${itemName})`,
      prevState: { totalCount: prevCart.totalCount, totalAmount: prevCart.totalAmount },
      currentState: { totalCount: nextState.totalCount, totalAmount: nextState.totalAmount },
      reducerInfo,
      trace: buildCartTrace({
        label: `Dispatch: REMOVE_ITEM ("${itemName}")`,
        renderNumber: nextRender,
        status: `dispatched { type: 'REMOVE_ITEM', payload: { id: '${productId}' } }`,
        prevState: `items: ${prevCart.totalCount}, total: $${prevCart.totalAmount}`,
        actionLabel: `cartReducer removed ${itemName} from items array`,
        nextState: `items: ${nextState.totalCount}, total: $${nextState.totalAmount}`,
        diffSummary: `Removed ${itemName} from cart. Total items: ${nextState.totalCount}, total: $${nextState.totalAmount}`,
        reducerInfo
      })
    });
  };

  const handleDecrementFromCart = (productId) => {
    const prevCart = cartState;
    const targetItem = prevCart.items.find(i => i.id === productId);
    if (!targetItem) return;

    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const itemName = targetItem.name;
    const action = { type: 'DECREMENT_ITEM', payload: { id: productId, name: itemName } };
    const nextState = cartReducer(prevCart, action);
    cartDispatch(action);

    const reducerInfo = buildReducerClickInfo({
      actionType: 'DECREMENT_ITEM',
      actionPayload: action.payload,
      prevState: prevCart,
      nextState,
      strategy: selectedTokenId
    });

    recordAction({
      onRecordRender,
      onRecordTrace,
      renderNumber: nextRender,
      trigger: `Dispatch: DECREMENT_ITEM (${itemName})`,
      prevState: { totalCount: prevCart.totalCount, totalAmount: prevCart.totalAmount },
      currentState: { totalCount: nextState.totalCount, totalAmount: nextState.totalAmount },
      reducerInfo,
      trace: buildCartTrace({
        label: `Dispatch: DECREMENT_ITEM ("${itemName}")`,
        renderNumber: nextRender,
        status: `dispatched { type: 'DECREMENT_ITEM', payload: { id: '${productId}' } }`,
        prevState: `items: ${prevCart.totalCount}, total: $${prevCart.totalAmount}`,
        actionLabel: targetItem.quantity > 1
            ? `cartReducer decremented ${itemName} quantity from ${targetItem.quantity} to ${targetItem.quantity - 1}`
            : `cartReducer removed ${itemName} as quantity reached 0`,
        nextState: `items: ${nextState.totalCount}, total: $${nextState.totalAmount}`,
        diffSummary: targetItem.quantity > 1
          ? `Decremented 1 ${itemName}. Total items: ${nextState.totalCount}, total: $${nextState.totalAmount}`
          : `Removed ${itemName} as quantity reached 0. Total items: ${nextState.totalCount}, total: $${nextState.totalAmount}`,
        reducerInfo
      })
    });
  };

  const handleClearCart = () => {
    if (cartState.items.length === 0) return;
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const prevCart = cartState;
    const nextState = cartReducer(prevCart, { type: 'CLEAR_CART' });
    cartDispatch({ type: 'CLEAR_CART' });

    const reducerInfo = buildReducerClickInfo({
      actionType: 'CLEAR_CART',
      actionPayload: null,
      prevState: prevCart,
      nextState,
      strategy: selectedTokenId
    });

    recordAction({
      onRecordRender,
      onRecordTrace,
      renderNumber: nextRender,
      trigger: 'Dispatch: CLEAR_CART',
      prevState: { totalCount: prevCart.totalCount, totalAmount: prevCart.totalAmount },
      currentState: { totalCount: 0, totalAmount: 0 },
      reducerInfo,
      trace: buildCartTrace({
        label: 'Dispatch: CLEAR_CART',
        renderNumber: nextRender,
        status: "dispatched { type: 'CLEAR_CART' }",
        prevState: `items: ${prevCart.totalCount}, total: $${prevCart.totalAmount}`,
        actionLabel: 'cartReducer reset cart to empty state',
        nextState: 'items: 0, total: $0',
        diffSummary: 'Cart cleared. All items removed. Total: $0',
        reducerInfo
      })
    });
  };

  const handleReset = () => {
    cartDispatch({ type: 'CLEAR_CART' });
    if (onReset) onReset();
  };

  return (
    <SandboxContainer hookName="useReducer" onReset={handleReset} isFullArena={true}>
      <UseReducerInnerSandbox
        cartState={cartState}
        onAddToCart={handleAddToCart}
        onDecrementFromCart={handleDecrementFromCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </SandboxContainer>
  );
}
