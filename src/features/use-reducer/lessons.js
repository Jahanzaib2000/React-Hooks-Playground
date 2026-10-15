// useReducer lesson definitions and execution traces
import { getInitialUseReducerInfo } from './helpers.js';

export function getInitialRender(lessonId, effTokenId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { totalCount: 0, totalAmount: 0 },
    reducerInfo: getInitialUseReducerInfo(lessonId, effTokenId)
  };
}

export const lessons = [
    {
      id: 'ured-cart-actions',
      title: '01. The Dispatch & Action Contract',
      hook: 'useReducer',
      summary: 'Manage shopping cart state transitions across Catalog and Cart components using pure action dispatches (ADD_ITEM, REMOVE_ITEM, CLEAR_CART).',
      theory: {
        signature: 'const [state, dispatch] = useReducer(reducer, initialState);',
        useWhen: 'Complex state transitions involving interrelated values (items, counts, total price) or state machine lifecycles.',
        dontUseWhen: 'Simple independent primitive values like a single boolean toggle or text input string (prefer useState).',
        classicPitfall: 'Mutating state directly inside the reducer (e.g. state.items.push()) instead of returning fresh immutable copies.',
        mentalModel: 'Bank teller transaction slip: Components dispatch actions ("what occurred"); the central reducer determines "how state updates".'
      },
      predict: {
        question: 'When Box 1 dispatches { type: "ADD_ITEM", payload: item }, what computes the updated cart totals?',
        options: [
          { id: 'opt-pure-reducer', label: 'The pure cartReducer function calculates the new items array, totalCount, and totalAmount deterministically', correct: true, explain: 'Correct! useReducer centralizes business logic inside a single pure reducer function.' },
          { id: 'opt-box1-handler', label: 'The click handler in Box 1 manually calculates the totals before updating state', correct: false, explain: 'Incorrect: with useReducer, component event handlers only describe the action, leaving calculations to the reducer.' },
          { id: 'opt-async-side-effect', label: 'A background useEffect recalculates the totals after the render completes', correct: false, explain: 'Incorrect: reducer calculations are synchronous and atomic with the state transition.' }
        ]
      },
      tokenKey: 'reducerPattern',
      tokenOptions: [
        { id: 'use-reducer-dispatch', label: 'dispatch({ type: "ADD_ITEM", payload: item }); // Pure action dispatch', preview: 'useReducer [Idiomatic]', isBroken: false, hint: 'Centralized deterministic state' },
        { id: 'dispersed-set-state', label: 'setItems([...items, item]); setTotal(t => t + item.price); // Split setState', preview: 'Split useState [Prone to Desync]', isBroken: true, hint: 'Dispersed logic can desynchronize totals' }
      ],
      codeTemplate: (_token) => `function ShoppingCartSystem() {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const handleAdd = (item) => {
    <TOKEN>
  };

  return (
    <div>
      <CatalogBox onAdd={handleAdd} />
      <CartBox items={state.items} total={state.totalAmount} onClear={() => dispatch({ type: 'CLEAR_CART' })} />
    </div>
  );
}`,
      explain: {
        takeaway: 'useReducer consolidates complex state transitions into one pure function, keeping interrelated values (items, quantities, totals) completely in sync.',
        myths: [
          'Myth: useReducer is only useful for Redux-like global state.',
          'Myth: useReducer makes small apps slower.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'ured-cart-actions':
    case 'ured-immutability':
    case 'ured-vs-state': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ShoppingCartArena',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useReducer',
            status: 'cartState: { items: [], totalCount: 0, totalAmount: 0 }',
            actionRequired: false,
            prevState: 'undefined',
            nextState: '{ items: 0, total: $0 }'
          }
        ],
        commit: {
          diffSummary: 'Mounted 2 boxes: Store Catalog (Box 1) and Shopping Cart (Box 2)',
          mutationsCount: 1
        },
        effects: null,
        reducerInfo: getInitialUseReducerInfo(lessonId, tokenId)
      };
    }
    default:
      return null;
  }
}
