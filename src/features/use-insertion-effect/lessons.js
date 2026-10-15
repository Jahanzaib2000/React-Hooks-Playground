// useInsertionEffect lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { count: 0 }
  };
}

export const lessons = [
    {
      id: 'uie-style-injection',
      title: '01. Synchronous Style Injection',
      hook: 'useInsertionEffect',
      summary: 'useInsertionEffect runs synchronously before DOM mutations, allowing CSS-in-JS libraries to inject style tags before layout effects read DOM geometry.',
      theory: {
        signature: 'useInsertionEffect(() => { /* inject styles */ return () => { /* cleanup */ }; }, deps)',
        useWhen: 'Injecting dynamic style tags into the DOM document (<head>) for CSS-in-JS libraries.',
        dontUseWhen: 'Reading layout measurements, mutating state, or running application business logic.',
        classicPitfall: 'Mutating component state inside useInsertionEffect or reading refs, which are not yet attached.',
        mentalModel: 'Runs before React mutates the DOM. Guarantees styles are in place before any useLayoutEffect measures DOM elements.'
      },
      predict: {
        question: 'When does useInsertionEffect execute relative to DOM mutations?',
        options: [
          {
            id: 'opt-pre-dom',
            label: 'Before React mutates the real DOM (synchronously)',
            correct: true,
            explain: 'Correct! useInsertionEffect executes synchronously before React mutates the real DOM, allowing style rules to be ready before layout calculations.'
          },
          {
            id: 'opt-post-dom',
            label: 'After React mutates the real DOM, alongside useLayoutEffect',
            correct: false,
            explain: 'Incorrect: useLayoutEffect runs after DOM mutations. useInsertionEffect runs before DOM mutations.'
          },
          {
            id: 'opt-post-paint',
            label: 'Asynchronously after browser paint, like useEffect',
            correct: false,
            explain: 'Incorrect: useEffect runs asynchronously after browser paint.'
          }
        ]
      },
      tokenKey: 'injectionMethod',
      tokenOptions: [
        {
          id: 'insertion-effect',
          label: 'useInsertionEffect(() => { injectSheet(themeCss); }, [theme]);',
          preview: 'useInsertionEffect [Pre-DOM Commit]',
          isBroken: false,
          hint: 'Injects styles before DOM mutation, preventing layout reflow'
        },
        {
          id: 'layout-effect',
          label: 'useLayoutEffect(() => { injectSheet(themeCss); }, [theme]);',
          preview: 'useLayoutEffect [Post-DOM Commit]',
          isBroken: true,
          hint: 'Forces browser to recalculate layout if other layout effects run'
        }
      ],
      codeTemplate: (_token) => `import React, { useInsertionEffect } from 'react';
import themeCss from './insertionTheme.css?raw';

function DynamicThemedCard({ isApplied }) {
  // Synchronous pre-DOM mutation style injection:
  <TOKEN>

  return (
    <div className={isApplied ? "insertion-theme-active" : "sandbox-default"}>
      <h2>Dynamic Themed Card</h2>
      <p>Styles injected into head before DOM layout calculations.</p>
    </div>
  );
}`,
      explain: {
        takeaway: 'useInsertionEffect ensures dynamic styles are injected before any DOM mutations or layout calculations occur.',
        myths: [
          'Myth: useInsertionEffect is meant for normal application code.',
          'Myth: Refs to DOM nodes are available inside useInsertionEffect.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'uie-style-injection': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'InsertionEffectPlayground',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useInsertionEffect',
            status: 'Synchronous (Pre-DOM Commit)',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'Injected'
          }
        ],
        commit: {
          diffSummary: 'Mounted Dynamic Themed Sandbox & Style Injector',
          mutationsCount: 1
        },
        effects: {
          ran: true,
          cleanupRan: false,
          description: 'useInsertionEffect runs synchronously before DOM mutations to inject styles',
          closureValues: {}
        }
      };
    }
    default:
      return null;
  }
}
