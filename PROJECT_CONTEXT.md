# React Hooks Playground: Project Context

This file describes the implemented architecture as of 2026-10-15 (Asia/Karachi). The authoritative refactor plan is [codebase-refactor-plan.md](codebase-refactor-plan.md). All seven phases are complete. Historical phase-validation and baseline artifacts have been removed; the architecture, validation commands and known limitations are retained here.

## Purpose and scope

The app teaches 18 React hooks through interactive sandboxes, educational code templates, lesson/token selection, render history, execution traces and DOM mutation inspection. Some visualizations simulate React behavior; a displayed code variant does not necessarily replace the running sandbox implementation. Preserve each lesson's existing teaching contract rather than turning these demonstrations into a generic runtime.

React and React DOM, Vite, vanilla CSS, and Wouter are the application stack. There is no state library, CSS framework, TypeScript migration, lazy feature registry, or lesson URL scheme.

## Source structure and ownership

```text
src/
  main.jsx                   React StrictMode entry; one eager CSS import
  AppRoutes.jsx              URL matching, root redirect, unknown route
  App.jsx                    Persistent shell and keyed lesson/telemetry workspace
  routes/paths.js            Canonical root and hook URLs
  constants/                 Focused static configuration files
  features/
    index.js                 Hook component/lesson/initial-telemetry registry
    <kebab-case-hook>/
      <HookName>Sandbox.jsx   Coordinating state, effects and event handlers
      lessons.js             Lesson metadata, templates and initial telemetry
      helpers.js             Feature calculations/metadata, where needed
      *.jsx                  Coherent sibling components and views
      *.js                   Focused feature hooks/helpers, where needed
      *.css or styles/*.css  Feature-owned styles
  shared/
    components/              Header, viewers, inspectors, timeline, drawer and sheets
    primitives/              Reused switches, theme controls and status pills
    styles/                  Tokens, document rules, layout, controls and manifest
    utils/                   Telemetry, trace factory and simulation countdown
scripts/
  check-line-count.mjs        Repository source/configuration line-count gate
  check-line-count.test.mjs   Gate boundary, exclusion and CLI regression tests
  calculations.test.mjs       Cart, packet geometry and time-format regressions
```

Folders remain flat unless a coherent feature responsibility warrants a small subfolder, such as reducer styles. The old `src/modules`, `src/styles`, monolithic stylesheet and forwarding compatibility files are absent. The former `docs/plans/codebase-refactor-plan.md` location is obsolete. Curriculum plans under `docs/plans/` are historical specifications, not a source inventory.

Run `npm run check:lines` to check current maintained source/configuration file sizes.

## Routing and state flow

`main.jsx` mounts `AppRoutes` inside StrictMode. `AppRoutes` uses Wouter's location hook as the source of truth, matches `HOOK_PATHS` to existing camel-case hook keys, replaces `/` with `/hooks/use-state`, and renders the unknown-route view for unmatched paths. No custom History API synchronization or competing active-hook state exists.

Header renders the existing two configured rows as canonical links. The active link has its existing active class and `aria-current="page"`. Keyboard focus survives navigation because Header belongs to the persistent App shell.

App receives the URL-selected hook and keys `HookWorkspace` by that hook. Each hook change, including Back/Forward, initializes the first lesson, first token, render history, active render index, execution trace and mutation list together. App retains the inspector tab and theory-open state across hook changes. Reselecting the current URL preserves the local lesson. Lesson/token changes and reset use the existing local metadata reset flow; there are no deeper lesson URLs.

Localhost is the current host. Vite development and production preview serve the entry HTML for nested hook paths. A future deployment host must provide SPA fallback to `dist/index.html` for application URLs while serving static assets normally.

## Features and canonical URLs

| Feature directory | URL | Existing demonstration |
| --- | --- | --- |
| use-state | /hooks/use-state | State snapshots, const error, text input |
| use-effect | /hooks/use-effect | Dependency selection and post-paint popup |
| use-id | /hooks/use-id | Field identity, collisions and accessible associations |
| use-optimistic | /hooks/use-optimistic | Optimistic color update, confirmation and rollback |
| use-deferred-value | /hooks/use-deferred-value | Urgent factors and deferred product |
| use-transition | /hooks/use-transition | Urgent interaction versus heavy calculation |
| use-ref | /hooks/use-ref | Ref-controlled light boxes |
| use-reducer | /hooks/use-reducer | Shopping-cart dispatch, reducer, packet and trash sequence |
| use-context | /hooks/use-context | Direct and tree theme propagation |
| use-imperative-handle | /hooks/use-imperative-handle | Parent/child glow and fireworks controls |
| use-form-status | /hooks/use-form-status | Traditional/modern forms, pending state and storage |
| use-layout-effect | /hooks/use-layout-effect | Lifecycle order and pre-/post-paint comparison |
| use-insertion-effect | /hooks/use-insertion-effect | Early dynamic stylesheet injection and cleanup |
| use-sync-external-store | /hooks/use-sync-external-store | External store subscription and snapshot |
| use-action-state | /hooks/use-action-state | Async login action state and validation |
| use | /hooks/use | Traditional versus Suspense execution timeline |
| use-debug-value | /hooks/use-debug-value | Online status, theme and cart diagnostics |
| use-effect-event | /hooks/use-effect-event | Non-reactive dependency lights and call reconnect comparison |

`features/index.js` exports `HOOK_MODULES` and `HOOK_LESSONS`. Each module supplies `Sandbox`, `lessons`, `getInitialRender`, `getInitialTrace`, and the existing `initialTrace` alias. Keep registry entries explicit. Do not recreate a global sandbox or lessons monolith.

Large views are separated from coordinators. Examples include ProductCatalog/Cart, context boxes/wires, form cards/storage, ID field demonstrations, imperative parent/child components, and inspector views. Coordinating state remains in sandboxes. Reducer geometry/trace construction and effect-event formatting/telemetry have focused helpers. `useTransientLight(durationMs)` restarts its timeout on a repeated trigger and clears it on unmount.

## Constants boundaries

`src/constants/app.js` owns application title/descriptions, default hook/inspector, arena membership and the mutation-history cap. `navigation.js` owns the existing row grouping/order. `simulation.js` owns countdown configuration. Feature-named files own static palettes, labels, configured initial values and timing values.

Constants are leaf data modules. Keep functions, state, effects, refs, stores, derived calculations and mutable instances with their implementation. Use fresh initialization helpers or copies for mutable defaults. Keep educational source strings in lessons; CSS tokens remain in CSS. Canonical URL strings belong in `routes/paths.js`, not feature constants.

## CSS ownership and loading

`main.jsx` imports `shared/styles/index.css` once. That manifest eagerly loads shared and feature styles in the preserved cascade order. Components do not independently import those sheets. There are 80 authored CSS files, including the raw theme.

- `shared/styles/tokens.css`: design values and scoped theme variables.
- `base.css`: document/reset/background/scrollbars.
- `layout.css`: app shell, workspace/panels and recurring layout.
- `controls.css`: equivalent button/input bases, hover, focus and disabled behavior.
- Shared component and primitive sibling sheets own their visual contracts.
- Feature sibling sheets own unique demos, effects, animation keyframes and intentional lesson/theme variants.

`features/use-insertion-effect/insertionTheme.css` is imported as `?raw`, then injected and removed by the sandbox. It is intentionally excluded from the eager manifest. Preserve timing, bytes, scope, reset and unmount cleanup.

Equivalent declarations may be grouped without renaming selectors. Preserve specificity and source order. Dynamic classes, SVG animation states, lesson variants and scoped white/serif themes must not be deleted based on text-search absence. Matching declarations can represent intentionally independent animations or feature variants.

## Lesson and telemetry contracts

A lesson has `id`, `title`, `hook`, `summary`, `theory`, prediction/explanation metadata, `tokenOptions` and `codeTemplate`. Some supply `splitCodes`. Keep `<TOKEN>` markers and template text intact where present; some existing lessons deliberately have no visible token control. `CodeViewer` owns its local switcher state.

Sandboxes receive `activeLessonId`, `selectedTokenId`, optional token selection, render/trace/mutation callbacks and reset. Preserve optional callback guards and existing action order. Do not force every action to emit all three telemetry types; existing demonstrations differ.

- Render snapshots use `renderNumber`, `trigger`, `prevState`, `currentState`, plus feature metadata such as reducer/ID/optimistic/deferred/transition/ref information.
- Traces use a trigger, component name, render number, hooks, commit summary and optional effects. Initial factories stay with the feature.
- Mutation history is capped at the configured ten records. Existing mutation payload shapes differ; preserve their contract with the inspector rather than silently normalizing them during unrelated work.
- `recordAction()` emits optional mutation, then render, then optional trace. Reuse it only where that order and guard behavior match.
- `useSimulationTimer()` provides the existing countdown/pending/reset contract. Dependency lights, reconnect intervals and staged cart animations have intentionally different contracts.

`TimelineDock` selects historical snapshots without changing live sandbox state. `ExecutionTree` displays the latest trace. ID wiring reads actual DOM associations, collision and focus state. Parent telemetry resets and local sandbox resets are not universally equivalent.

## Validation and extension rules

Run `npm run validate` before completing changes. On this PowerShell setup, use `npm.cmd run validate` if npm.ps1 is blocked. The command runs the line-count gate, checker and calculation tests, ESLint and production build. `npm run check:lines`, `npm test`, `npm run lint` and `npm run build` remain individually available.

The line gate targets 250 physical lines and fails above 270. Blank lines, comments and embedded code count. It scans maintained JS/JSX/MJS/CJS/TS/TSX/CSS/HTML/JSON/SVG/YAML/TOML and `.gitignore`; dependencies, generated build/coverage output, documentation/audit fixtures, lockfiles, repository/tool metadata and disposable browser profiles are explicitly excluded. New maintained file types must be added to the gate when introduced. Split by responsibility; do not compress formatting or strip useful comments to meet the limit.

For existing behavior changes, add targeted calculation/lifecycle/regression tests where useful. When UI behavior changes, check the affected hook screens, lessons/tokens, reset, previews, panels, narrow layouts, themes, focus, disabled controls and animations. The historical browser audit tools and their saved comparisons have been removed. Preserve baseline limitations unless separately authorized.

When extending an existing feature, keep its state, lessons, helpers and unique styles colocated. A separately authorized new hook would need its feature module/initial factories, registry entry, canonical path, configured header placement and any manifest entries. Static data belongs in the focused constants owner. Avoid universal UI factories, speculative abstractions and hidden cross-feature state.

## Recorded limitations

The existing Header has no working theory opener (`_onOpenTheory` does not consume App's `onOpenTheory`); the drawer component is verified independently. Narrow layouts retain baseline overflow. useEffect's changing dependency-array size logs the existing React warning. Development StrictMode and production show different mount telemetry/popup observations. Some lesson variants affect previews only, some resets clear only telemetry, and mutation display fields are not normalized across all demos. The production JavaScript chunk remains above Vite's warning threshold. These are documented baseline behaviors, not new refactor regressions.
