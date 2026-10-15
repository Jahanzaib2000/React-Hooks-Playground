# React Hooks Playground: Consolidated Master Plan

Confidence tags: **[Certain]** verified React behavior / codebase architecture, **[Design Choice]** playground-specific implementation decision.

---

## 1. Vision & Pedagogical Model

The **React Hooks Playground** is an interactive educational workbench teaching all 18 React hooks through focused mental models, visual state machines, and active experimentation.

### 1.1 The 5-Step Lesson Loop
Every hook lesson guides learners through a structured learning cycle:
1. **Predict:** Learner commits to an answer (timeline guess, numeric value, or behavior) before execution begins.
2. **Poke:** Learner tests the live component, triggers handlers, scrubs timelines, or dials speed.
3. **Break:** Learner clicks interactive tokens to introduce a classic pitfall (e.g., stale closure, direct mutation).
4. **Fix:** Learner modifies tokens to reach a stated objective (e.g., *"Make one click add 3"*).
5. **Explain:** Learner reviews the definitive mechanism, debunking common misconceptions.

### 1.2 Core Architectural Principles
- **State is a Snapshot:** Each render is an immutable frame with its own props, state, and closures.
- **Closures Capture Render Values:** Handlers and timers hold values from the exact render that scheduled them.
- **External Store for Telemetry:** Runtime inspection (renders, reference chips, DOM mutations) must never use component state, preventing recursive renders.
- **Salt & Pepper Design System:** High-contrast dark theme (`#09090b` canvas, `#18181b` cards, `#27272a` borders) with zero emojis.

---

## 2. Screen Anatomy & Interaction Primitives

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Top Nav: Title  │  Hook Picker (2-Line Row)  │  Lesson Breadcrumb  │ React Version│
├──────────────────────────────────────────────────────┬───────────────────────────┤
│ Left Column (50%): Component Source                  │ Right Column (50%): Demo  │
│ ┌──────────────────────────────────────────────────┐ │ ┌───────────────────────┐ │
│ │ 01. Lesson Title                                 │ │ │ Live Interactive      │ │
│ │ Read-only syntax view with clickable token chips:│ │ │ Component Sandbox     │ │
│ │ [ setCount(c => c + 1) ▾ ]                       │ │ └───────────────────────┘ │
│ └──────────────────────────────────────────────────┘ │ Telemetry Bar: Speed/Cost │
├──────────────────────────────────────────────────────┴───────────────────────────┤
│ Bottom Dock: Snapshot Timeline (Render #1 ➔ #2) | DOM Mutations | Hook Tree      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Reusable Interaction Primitives
- **P1 Fill-in Timeline:** Pre-execution prediction inputs comparing learner hypothesis against actual run.
- **P2 Clickable Code Tokens:** Underlined syntax badges swapping authored variants without typing.
- **P3 Closure Time Machine:** Triggers handlers from prior renders to expose stale closures.
- **P4 Time Dial:** Scales asynchronous delays (`0.25x` to `4x`, pause, and step-one-event).
- **P5 Reference Identity Chips:** Displays memory addresses (`#ref-a1`) to track `Object.is` equality.
- **P6 Dependency Array Chips:** Highlights which reactive values triggered effect re-runs.
- **P7 Cost Meter:** Live badges counting total renders, effect cycles, and unnecessary passes.
- **P8 Side-by-Side Runner:** Dual-lane canvas executing contrasting implementations simultaneously.

---

## 3. Hook Specifications & Sandbox Implementations

### 3.1 `useState`: The Foundation
- **Signature:** `const [state, setState] = useState(initialValue | () => initialValue)`
- **Mental Model:** State is a snapshot per render. Updaters (`setCount(c => c + 1)`) queue transformations against pending state.
- **When to Use:** Values displayed on screen whose modifications must trigger a re-render.
- **Pitfalls:** Mutating objects/arrays directly; expecting state changes synchronously after setter.
- **Sandbox Architecture:**
  - *Option 1 (Simple Increment):* Standard counter demonstrating render snapshots.
  - *Option 2 (Const Variable Error):* Demonstrates `const count = 0` increment, opening a 3-second error pop-up: `"State of const variable cannot be changed"`.
  - *Option 3 (Text State Input):* Real-time synchronization between text input and header text.
  - *Core Curriculum:* Snapshot closures, updater functions, batching (`flushSync`), array mutations, and lazy initializers.

### 3.2 `useRef`: Stable Persistence
- **Signature:** `const ref = useRef(initialValue)`
- **Mental Model:** A mutable `{ current: value }` container that persists across renders without causing re-renders.
- **When to Use:** Storing DOM nodes, timer IDs, previous values, or mutable values not displayed in UI.
- **Pitfalls:** Reading or writing `ref.current` during render logic; expecting UI updates when mutating refs.
- **Sandbox Architecture:**
  - 3-box layout: **Box 1 (Controller)** contains two buttons referencing child components.
  - Subtext: *"this references component in box 2"* / *"this references component in box 3"*.
  - **Box 2 & Box 3 (Light Components):** Lights (off by default) toggled imperatively via refs (`ref.current.toggle()`) without re-rendering Box 1.

### 3.3 `useEffect`: Lifecycle & Synchronization
- **Signature:** `useEffect(() => { setup(); return () => cleanup(); }, [deps])`
- **Mental Model:** Asynchronous synchronization with external systems after the browser paints.
- **When to Use:** Network requests, subscriptions, DOM mutations not affecting layout, timers.
- **Pitfalls:** Missing reactive dependencies; omitting cleanup; running state setters in infinite loops.
- **Sandbox Architecture:**
  - Sequence viewer: Render ➔ DOM Commit ➔ Browser Paint ➔ Effect Execution.
  - Dependency toggles (`[]`, `[count]`, omitted) with run counters and post-paint execution badge.
  - Network race condition demo with AbortController / ignore flag.

### 3.4 `useContext`: Direct Broadcast
- **Signature:** `const value = useContext(MyContext)`
- **Mental Model:** Broadcast channel bypassing intermediate tree components.
- **When to Use:** Low-frequency global data (theme, authenticated user, locale).
- **Pitfalls:** Re-render storms when context values change; creating new objects in `value={{...}}`.
- **Sandbox Architecture:**
  - Side-by-side comparison:
    - *Prop Drilling:* 4 vertical boxes cascading updates with 1-second sequential delays (~3s total).
    - *useContext:* Dedicated side broadcast box updating all boxes simultaneously (0ms delay).

### 3.5 `useReducer`: Predictable State Transitions
- **Signature:** `const [state, dispatch] = useReducer(reducer, initialArg, init?)`
- **Mental Model:** Bank transaction register. Dispatches actions (`{ type, payload }`) to a pure reducer function.
- **When to Use:** Multiple interrelated state variables or complex transition branching.
- **Pitfalls:** Mutating state inside the reducer; impure reducer side effects.
- **Sandbox Architecture:**
  - 2-box design: **Box 1 (Store Catalog)** lists hardware items with `+ Add to Cart` buttons.
  - **Box 2 (Shopping Cart):** Displays active items, quantities, item remove triggers, and `Clear Cart`, managed through deterministic reducer actions.

### 3.6 `useMemo` & `useCallback`: Referential Stability
- **Signatures:**
  - `const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])`
  - `const memoizedCallback = useCallback((...args) => doSomething(a, b), [a, b])`
- **Mental Model:** Caching calculation results or function identities across renders based on dependency equality.
- **When to Use:** Measurably expensive computations; passing stable callbacks to memoized children (`React.memo`) or effect dependencies.
- **Pitfalls:** Premature memoization of trivial work; stale values from missing dependencies.
- **Sandbox Architecture:**
  - Cost meter contrasting unmemoized vs memoized execution cycles.
  - Reference chips (`#ref-1` vs `#ref-2`) demonstrating child re-render prevention.

### 3.7 `useLayoutEffect`: Synchronous Pre-Paint Measurement
- **Signature:** `useLayoutEffect(() => { setup(); return () => cleanup(); }, [deps])`
- **Mental Model:** Synchronous effect executed *immediately after* DOM mutations and *before* browser paint.
- **When to Use:** Measuring DOM layout geometry (`getBoundingClientRect`) or modifying DOM to avoid visual flicker.
- **Pitfalls:** Blocks browser paint, degrading responsiveness; triggers SSR warnings.
- **Sandbox Architecture:**
  - Synchronized trees executing a 2.0s step engine:
    - `useEffect`: Render ➔ DOM Commit ➔ Paint ➔ Effect (potential flicker).
    - `useLayoutEffect`: Render ➔ DOM Commit ➔ Layout Adjustment (Sync) ➔ Paint (flicker-free).

### 3.8 `useInsertionEffect`: Pre-DOM Style Injection
- **Signature:** `useInsertionEffect(() => { ... }, [deps])`
- **Mental Model:** Synchronous hook running *before* any DOM mutations and before layout effects read geometry.
- **When to Use:** Dynamic CSS-in-JS library runtime style injection into `<head>`.
- **Pitfalls:** Reading refs or layout geometry; using for normal application effects.
- **Sandbox Architecture:**
  - Live arena demonstrating default dark theme.
  - Triggering `useInsertionEffect` injects custom CSS rules into `<head>` prior to DOM mutation, switching theme and typography without forced layout reflow.

### 3.9 `useImperativeHandle`: Encapsulated Component APIs
- **Signature:** `useImperativeHandle(ref, createHandle, [deps])`
- **Mental Model:** Customizes the instance value exposed to parents via `ref`, preventing raw DOM leakage.
- **When to Use:** Exposing restricted imperative commands (`focus()`, `scrollTo()`, `triggerAnimation()`).
- **Pitfalls:** Bypassing standard declarative prop flow for general communication.
- **Sandbox Architecture:**
  - **Box 1 (Parent)** controls **Box 2 (Left Child)** and **Box 3 (Right Child)**.
  - Bridge toggle: When enabled, parent action buttons trigger 2.0-second red/blue particle fireworks via exported child methods (`ref.current.triggerFireworks()`).

### 3.10 `useId`: Collision-Free Hydration IDs
- **Signature:** `const id = useId()`
- **Mental Model:** Generates stable, unique identifier strings consistent across server and client.
- **When to Use:** Linking form inputs and labels (`htmlFor`/`id`, `aria-describedby`).
- **Pitfalls:** Generating list keys from `useId` (keys must derive from data).
- **Sandbox Architecture:**
  - Dual-form instances demonstrating unique, collision-free input associations without hydration warnings.

### 3.11 `useSyncExternalStore`: Concurrent Store Subscription
- **Signature:** `const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`
- **Mental Model:** Synchronous subscription bridge to external stores preventing visual tearing in Concurrent Mode.
- **When to Use:** Subscribing to browser APIs (`matchMedia`, `onLine`) or third-party state stores.
- **Pitfalls:** Returning new object references in `getSnapshot` causing infinite re-render loops.
- **Sandbox Architecture:**
  - 3-tier vertical tree:
    - **Node 1:** Server Connection (Mutable external online/offline state toggle).
    - **Node 2:** `useSyncExternalStore` bridge running `subscribe` & `getSnapshot`.
    - **Node 3:** UI Interface displaying reactive connectivity status.

### 3.12 `useTransition`: Non-Blocking Concurrency
- **Signature:** `const [isPending, startTransition] = useTransition()`
- **Mental Model:** Assigns state updates to the concurrent Transition Lane, keeping discrete user events responsive.
- **When to Use:** Heavy rendering, tab switching, large filtered lists.
- **Pitfalls:** Wrapping controlled text inputs; wrapping non-state operations.
- **Sandbox Architecture:**
  - Toggle OFF: Heavy computation locks the main thread for 10s (buttons completely frozen).
  - Toggle ON: Heavy computation runs in background transition (`isPending` turns button cyan), while buttons respond with 0ms latency (turning light blue). No numerical countdown badges.

### 3.13 `useDeferredValue`: Background Calculation Deferral
- **Signature:** `const deferredValue = useDeferredValue(value, initialValue?)`
- **Mental Model:** Keeps urgent state immediate while deferring expensive downstream rendering with stale values.
- **When to Use:** Heavy charts or deep lists driven by fast inputs (typing, sliders).
- **Pitfalls:** Forgetting to wrap child consumers in `React.memo` (without memo, children re-render synchronously).
- **Sandbox Architecture:**
  - Urgent factors update with 0ms latency on click.
  - Deferred calculation runs in background (`isStale = value !== deferredValue`) with a 3-second animated ring before catching up.

### 3.14 `use`: Suspense-Native Resource Unwrapping (React 19)
- **Signature:** `const value = use(promise | context)`
- **Mental Model:** Synchronously unwraps promises or contexts directly in render; can be called conditionally.
- **When to Use:** Reading data promises from Server Components; reading conditional context.
- **Pitfalls:** Creating new promises during render without memoization (triggers infinite Suspense loops).
- **Sandbox Architecture:**
  - Two horizontal lanes on a shared time axis:
    - **Top Lane ("Without use"):** 5-block waterfall (`Render` ➔ `Empty/Spinner` ➔ `Effect` ➔ `Fetch` ➔ `Re-render`).
    - **Bottom Lane ("With use"):** 4-block flow (`Render starts` ➔ `use asks for data` ➔ `use pauses render (hatched bar)` ➔ `Render finishes with data`).

### 3.15 `useActionState`: Async Form Action State (React 19)
- **Signature:** `const [state, formAction, isPending] = useActionState(actionFn, initialState)`
- **Mental Model:** Encapsulates async form actions, pending state tracking, and response data in one hook.
- **When to Use:** Form submissions and multi-phase asynchronous mutations.
- **Pitfalls:** Managing pending booleans manually with `useState`.
- **Sandbox Architecture:**
  - Login form with prefilled email (`developer@react.dev`), password input, and hint: `"react123"`.
  - Multi-phase pop-up above sandbox:
    - Phase 1 (0–2s): `"Validating login information."`
    - Phase 2 (2–5s): `"useActionState confirming response"`
    - Phase 3 (5s+): Shows `"logged in"` (green) or `"incorrect login or password"` (red).

### 3.16 `useOptimistic`: Instant UI with Auto-Rollback (React 19)
- **Signature:** `const [optimisticState, setOptimistic] = useOptimistic(passthroughState, updateFn)`
- **Mental Model:** Shows predicted state immediately; automatically reverts if the underlying transition fails.
- **When to Use:** Likes, upvotes, task completions, instant color toggles.
- **Pitfalls:** Calling `setOptimistic` outside an async Transition or Form Action; writing manual rollback logic.
- **Sandbox Architecture:**
  - Color switcher running inside an async transition.
  - Instant optimistic color update. If server simulation is OFF, React discards the optimistic overlay when the transition settles, reverting the button color automatically.

### 3.17 `useFormStatus`: Form Pending Context (React 19)
- **Signature:** `const { pending, data, method, action } = useFormStatus()`
- **Mental Model:** Child components read parent `<form>` submission status directly without prop drilling.
- **When to Use:** Submit buttons and inline form loading indicators.
- **Pitfalls:** Calling `useFormStatus` inside the same component that renders `<form>` (must be inside a child).
- **Sandbox Architecture:**
  - Parent text input form with nested `<SubmitButton />`.
  - Button consumes `useFormStatus()`, switching to `"Loading"` and disabling clicks during submission, with submitted entries saved to a storage box.

### 3.18 `useEffectEvent`: Non-Reactive Effect Logic (Experimental)
- **Signature:** `const onEvent = useEffectEvent(callback)`
- **Mental Model:** Extracts non-reactive logic out of effects into stable event handlers that always see current props/state.
- **When to Use:** Reading latest theme, user IDs, or logging analytics in an effect without re-running the effect.
- **Pitfalls:** Calling outside an effect; passing to child components.
- **Sandbox Architecture:**
  - Interactive dependency tree: `roomId`, `serverUrl`, and `Theme`.
  - Top connection toggle:
    - *Connected:* `useEffectEvent` extracts `Theme`. Clicking `Theme` activates only the Theme light.
    - *Disconnected:* `Theme` is a reactive dependency. Clicking `Theme` re-synchronizes the whole effect, lighting all three nodes.

### 3.19 `useDebugValue`: Custom Hook DevTools Labels
- **Signature:** `useDebugValue(value, formatFn?)`
- **Mental Model:** Displays diagnostic labels inside React DevTools for custom hooks; zero DOM impact.
- **When to Use:** Custom hooks in reusable libraries.
- **Pitfalls:** Using inside standard components; performing expensive computations without `formatFn`.
- **Sandbox Architecture:**
  - Full-width top layout:
    - **Left Side:** User app (`<ProfileCard />` with status, theme, and cart).
    - **Right Side:** Authentic React DevTools panel highlighting custom hook labels (`OnlineStatus: "Online"`).

---

## 4. Cross-Hook Decision Matrix

| Problem / Objective | Primary Hook | Alternative | Deciding Factor |
|---|---|---|---|
| Persist state & re-render UI | `useState` | `useReducer` | Use `useReducer` if state transitions are complex or interdependent. |
| Persist mutable value without re-rendering | `useRef` | `useState` | Use `useRef` if updates shouldn't trigger visual re-renders. |
| Synchronize with external system after paint | `useEffect` | `useLayoutEffect` | Use `useLayoutEffect` only if measuring DOM to prevent paint flicker. |
| Share data deeply across the component tree | `useContext` | Props / Store | Use `useContext` for low-frequency global values (theme, auth). |
| Complex multi-action state transitions | `useReducer` | `useState` | Use `useReducer` to separate "what happened" from "how state updates". |
| Expensive computation or stable identity | `useMemo` / `useCallback` | Normal execution | Use only when profiling proves recalculation cost or child renders warrant it. |
| Subscribe to external non-React store | `useSyncExternalStore` | `useEffect` | Prevents Concurrent Mode tearing and handles synchronous snapshots. |
| Non-blocking heavy background updates | `useTransition` | `useDeferredValue` | `useTransition` wraps state setters; `useDeferredValue` wraps received values. |
| Unwrap promise or conditional context | `use` | `useEffect` + state | `use` integrates directly with React Suspense boundaries. |
| Form actions with pending & error states | `useActionState` | `useState` | Eliminates manual `isPending` and error handling boilerplate. |
| Instant UI update with auto-rollback | `useOptimistic` | Manual rollback | React automatically reverts optimistic state if the transition fails. |
| Read parent form submission state | `useFormStatus` | Prop drilling | Child component directly reads parent `<form>` context. |
| Non-reactive logic inside an effect | `useEffectEvent` | Mutable Ref | Keeps effect dependencies clean without suppressing ESLint warnings. |
| Custom hook inspection in DevTools | `useDebugValue` | None | Purely dev diagnostic; has zero runtime application effect. |
