// useRef lesson definitions and execution traces
import { getInitialUseRefInfo } from './helpers.js';

export function getInitialRender(lessonId, effTokenId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { box2LightOn: false, box3LightOn: false },
    refInfo: getInitialUseRefInfo(lessonId, effTokenId)
  };
}

export const lessons = [
    {
      id: 'ur-component-ref',
      title: '01. Component Referencing via useRef',
      hook: 'useRef',
      summary: 'Box 1 holds two buttons that reference and toggle the lights in Box 2 and Box 3 via React refs without re-rendering the controller box.',
      theory: {
        signature: 'const ref = useRef(initialValue);',
        useWhen: 'Holding stable imperative handles to child components or DOM elements across renders.',
        dontUseWhen: 'Values that determine component rendering output (prefer useState for UI values).',
        classicPitfall: 'Reading or writing ref.current during rendering instead of in event handlers or effects.',
        mentalModel: 'A ref is a stable box holding a mutable value. Mutating ref.current does NOT trigger a re-render.'
      },
      predict: {
        question: 'When Button 1 in Box 1 is pressed to turn on the light in Box 2, does Box 1 re-render?',
        options: [
          { id: 'opt-no-rerender', label: 'No, invoking imperative methods on a ref does not cause the parent box to re-render', correct: true, explain: 'Correct! useRef provides a persistent reference that bypasses the React re-render cycle.' },
          { id: 'opt-rerender', label: 'Yes, both Box 1 and Box 2 re-render together', correct: false, explain: 'Incorrect: refs do not trigger parent re-renders.' },
          { id: 'opt-all-boxes', label: 'Yes, Box 1, Box 2, and Box 3 all re-render', correct: false, explain: 'Incorrect: only Box 2 updates its own internal light state.' }
        ]
      },
      tokenKey: 'refMechanism',
      tokenOptions: [
        { id: 'use-ref', label: 'const box2Ref = useRef(null); // Direct imperative ref', preview: 'useRef [Direct]', isBroken: false, hint: 'Direct decoupled handle' },
        { id: 'prop-drilling', label: 'const [box2On, setBox2On] = useState(false); // Lifted state', preview: 'useState [Re-renders parent]', isBroken: true, hint: 'Causes full parent re-render' }
      ],
      codeTemplate: (_token) => `function RefController() {
  <TOKEN>

  return (
    <div className="ref-controller-box">
      <button onClick={() => box2Ref.current?.toggle()}>Button 1</button>
      <span>this references component in box 2</span>
      <button onClick={() => box3Ref.current?.toggle()}>Button 2</button>
      <span>this references component in box 3</span>
    </div>
  );
}`,
      explain: {
        takeaway: 'useRef lets you establish direct, imperative communication handles with child components without forcing the parent component to re-render.',
        myths: [
          'Myth: useRef is only for accessing raw DOM input elements.',
          'Myth: Mutating ref.current triggers a React render cycle.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'ur-component-ref':
    case 'ur-dom-access':
    case 'ur-no-rerender': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'RefController',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useRef', status: 'box2Ref.current ➔ Box 2 Element (Light: OFF)' },
          { slot: 1, name: 'useRef', status: 'box3Ref.current ➔ Box 3 Element (Light: OFF)' }
        ],
        commit: {
          diffSummary: 'Mounted 3 boxes: Controller (Box 1), Light Component (Box 2), Light Component (Box 3)',
          mutationsCount: 1
        },
        effects: null,
        refInfo: getInitialUseRefInfo(lessonId, tokenId)
      };
    }
    default:
      return null;
  }
}
