// useLayoutEffect lesson definitions and execution traces
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
      id: 'ule-timing-blocking',
      title: '01. Timing & Paint Blocking',
      hook: 'useLayoutEffect',
      summary: 'useLayoutEffect runs synchronously immediately after DOM mutations before browser paint, preventing visual layout flicker.',
      theory: {
        signature: 'useLayoutEffect(() => { /* measurements & mutations */ }, deps)',
        useWhen: 'Reading DOM layout measurements (e.g. tooltip sizes, scroll coordinates) or synchronously mutating the DOM before the user sees the screen.',
        dontUseWhen: 'Operations that do not require layout measurements or blocking browser paint (use useEffect instead).',
        classicPitfall: 'Performing expensive computation inside useLayoutEffect, blocking browser paint and causing noticeable UI lag.',
        mentalModel: 'A stage crew positioning furniture behind the stage curtain before the curtain is raised for the audience.'
      },
      predict: {
        question: 'When does useLayoutEffect execute relative to browser paint?',
        options: [
          {
            id: 'opt-before-paint',
            label: 'Synchronously after DOM mutations, but BEFORE the browser paints pixels to the screen.',
            correct: true,
            explain: 'Correct! useLayoutEffect runs synchronously before the browser paints, eliminating layout flicker.'
          },
          {
            id: 'opt-after-paint',
            label: 'Asynchronously after the browser has already painted pixels to the screen.',
            correct: false,
            explain: 'Incorrect: Running asynchronously after paint is the behavior of useEffect.'
          }
        ]
      },
      tokenKey: 'effectTiming',
      tokenOptions: [
        {
          id: 'layout-effect',
          label: 'useLayoutEffect(() => { measureAndAlign(); }, []);',
          preview: 'useLayoutEffect [Synchronous Pre-Paint]',
          isBroken: false,
          hint: 'Runs before paint to prevent flicker'
        },
        {
          id: 'standard-effect',
          label: 'useEffect(() => { measureAndAlign(); }, []);',
          preview: 'useEffect [Asynchronous Post-Paint]',
          isBroken: true,
          hint: 'Can cause visible layout flicker'
        }
      ],
      codeTemplate: (_token) => `import React, { useLayoutEffect, useRef } from 'react';

function Tooltip({ targetRect }) {
  const tooltipRef = useRef(null);

  // Synchronous pre-paint measurement:
  <TOKEN>

  return (
    <div ref={tooltipRef} className="tooltip">
      Tooltip Content
    </div>
  );
}`,
      explain: {
        takeaway: 'useLayoutEffect ensures measurements and adjustments happen before browser paint, avoiding visual flicker.',
        myths: [
          'Myth: useLayoutEffect is faster than useEffect.',
          'Myth: useLayoutEffect runs on the server during SSR.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'ule-timing-blocking': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'LayoutEffectPlayground',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useLayoutEffect',
            status: 'Synchronous (Pre-Paint)',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'Active'
          }
        ],
        commit: {
          diffSummary: 'Mounted Dual Lifecycle Tree Comparison',
          mutationsCount: 1
        },
        effects: {
          ran: true,
          cleanupRan: false,
          description: 'useLayoutEffect runs synchronously before browser paint',
          closureValues: {}
        }
      };
    }
    default:
      return null;
  }
}
