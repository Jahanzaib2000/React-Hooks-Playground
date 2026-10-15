// useDebugValue lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { isOnline: true, theme: 'Dark', cartCount: 3 }
  };
}

export const lessons = [
    {
      id: 'udv-devtools-labels',
      title: '01. Custom Hook DevTools Labels',
      hook: 'useDebugValue',
      summary: 'useDebugValue formats and displays diagnostic labels for custom hooks inside React DevTools without modifying the rendered DOM.',
      theory: {
        signature: 'useDebugValue(value, formatFn?)',
        useWhen: 'Authoring custom hooks in shared libraries or design systems to provide readable diagnostics in React DevTools.',
        dontUseWhen: 'For simple internal hooks where standard state is clear, or when trying to render text into the UI (it only exists in DevTools).',
        classicPitfall: 'Calling expensive formatting operations without passing the optional formatting function as the second argument.',
        mentalModel: 'A developer-only label pinned beside custom hook entries in the React DevTools inspector; completely invisible to end-users.'
      },
      predict: {
        question: 'Where does the value passed to useDebugValue appear in the application?',
        options: [
          { id: 'opt-devtools', label: 'Exclusively inside React DevTools beside the custom hook name', correct: true, explain: 'Correct! useDebugValue is strictly developer-facing and has zero impact on the rendered DOM.' },
          { id: 'opt-dom', label: 'Directly in the HTML DOM as a data-debug attribute on the element', correct: false, explain: 'Incorrect: useDebugValue never renders or injects anything into the user-facing DOM.' }
        ]
      },
      tokenKey: 'debugFormatting',
      tokenOptions: [
        {
          id: 'standard',
          label: '01. Custom Hook DevTools Labels',
          preview: 'useDebugValue(isOnline ? "Online" : "Offline")',
          isBroken: false,
          hint: 'Formats diagnostic labels in React DevTools'
        }
      ],
      codeTemplate: () => `// React: useDebugValue for Custom Hook Diagnostics
import { useState, useDebugValue } from 'react';

// 1. Custom Hook: Online Status
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // Label displayed beside this hook in React DevTools:
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}

// 2. Custom Hook: Theme Preference
function useTheme() {
  const [theme, setTheme] = useState('Dark');

  useDebugValue(theme);

  return theme;
}

// 3. Custom Hook: Shopping Cart with deferred formatter
function useCart() {
  const [cart, setCart] = useState(['Laptop', 'Mouse', 'Keyboard']);

  // Second argument formatter function runs only when DevTools inspects the component
  useDebugValue(cart, c => \`\${c.length} items\`);

  return cart;
}

// User-facing Component:
function ProfileCard() {
  const isOnline = useOnlineStatus();
  const theme = useTheme();
  const cart = useCart();

  // Notice: DevTools labels never appear in this rendered DOM!
  return (
    <div className="profile-card">
      <div className="avatar">Alex Morgan</div>
      <div className="status">{isOnline ? 'Online' : 'Offline'}</div>
      <div className="theme">Theme: {theme}</div>
      <div className="cart">Cart: {cart.length} items</div>
    </div>
  );
}`,
      explain: {
        takeaway: 'useDebugValue labels custom hooks inside React DevTools so developers can inspect internal state instantly without polluting the UI.',
        myths: [
          'Myth: useDebugValue adds attributes or text to the rendered HTML DOM.',
          'Myth: Every custom hook must call useDebugValue.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'udv-devtools-labels': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ProfileCard',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useOnlineStatus',
            status: 'useDebugValue("Online")',
            actionRequired: false,
            prevState: 'undefined',
            nextState: '"Online"'
          },
          {
            slot: 1,
            name: 'useTheme',
            status: 'useDebugValue("Dark")',
            actionRequired: false,
            prevState: 'undefined',
            nextState: '"Dark"'
          },
          {
            slot: 2,
            name: 'useCart',
            status: 'useDebugValue("3 items")',
            actionRequired: false,
            prevState: 'undefined',
            nextState: '"3 items"'
          }
        ],
        commit: {
          diffSummary: 'Mounted ProfileCard with custom hooks labeled for React DevTools',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
