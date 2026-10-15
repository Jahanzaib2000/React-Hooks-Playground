export const HOOK_SHORT_DESCRIPTIONS = {
  useState: 'Preserves state values across re-renders and triggers a re-render when updated.',
  useEffect: 'Synchronizes a component with external systems and executes side effects after render.',
  useId: 'Generates stable, unique IDs across client and server renders for accessibility.',
  useOptimistic: 'Optimistically updates UI state during async actions with automatic rollback on error.',
  useDeferredValue: 'Defers updating non-critical UI to keep user interactions smooth and responsive.',
  useTransition: 'Marks state updates as non-blocking transitions so the UI stays responsive during heavy updates.',
  useRef: 'Persists a mutable value or DOM reference across renders without triggering a re-render.',
  useReducer: 'Manages complex state logic through action dispatches and a pure reducer function.',
  useContext: 'Subscribes to context data passed down the component tree without prop drilling.',
  useImperativeHandle: 'Customizes the handle and public methods exposed to parent components via a ref.',
  useFormStatus: 'Provides status information (pending state, data, method) for the parent form submission.',
  useLayoutEffect: 'Runs synchronously after all DOM mutations before the browser paints the screen.',
  useInsertionEffect: 'Injects dynamic CSS styles into the DOM before any layout effects read geometry.',
  useSyncExternalStore: 'Subscribes to external data stores with synchronous snapshot reads to prevent visual tearing.',
  useActionState: 'Manages state updated by async form actions, tracking pending status automatically.',
  use: 'Unwraps asynchronous resources like Promises or Context directly in render with Suspense.',
  useDebugValue: 'Displays custom diagnostic labels for custom hooks inside React DevTools.',
  useEffectEvent: 'Extracts non-reactive logic from effects so dependencies stay strictly focused on synchronization.'
};

export const FULL_ARENA_HOOKS = new Set([
  'useReducer', 'useRef', 'useContext', 'useImperativeHandle',
  'useFormStatus', 'useLayoutEffect', 'useInsertionEffect',
  'useEffect', 'useSyncExternalStore', 'useActionState',
  'use', 'useDebugValue', 'useEffectEvent'
]);

export const APP_TITLE = 'React Hooks Playground';
export const DEFAULT_HOOK = 'useState';
export const DEFAULT_INSPECTOR_TAB = 'dom';
export const MAX_MUTATION_HISTORY = 10;
export const DEFAULT_HOOK_DESCRIPTION = 'Synchronizes component lifecycle and state.';
