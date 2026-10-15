

// Shared shopping-cart trace schema; action-specific descriptions stay at dispatch sites.
export function buildCartTrace({
  label, renderNumber, status, prevState, actionLabel, nextState, diffSummary, reducerInfo
}) {
  return {
    trigger: { label, type: 'Action Dispatch' },
    componentName: 'ShoppingCart',
    renderNumber,
    hooks: [{
      slot: 0,
      name: 'useReducer',
      status,
      prevState,
      actionLabel,
      nextState,
      bailedOut: false
    }],
    commit: { diffSummary, mutationsCount: 1 },
    effects: null,
    reducerInfo
  };
}
