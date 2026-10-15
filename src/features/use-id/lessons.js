// useId lesson definitions and execution traces
import { getInitialUseIdInfo } from './helpers.js';

export function getInitialRender(lessonId, effTokenId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { instances: lessonId === 'uid-basics' ? 3 : 1 },
    useIdInfo: getInitialUseIdInfo(lessonId, effTokenId)
  };
}

export const lessons = [
    {
      id: 'uid-basics',
      title: '01. One Hook, Unique IDs',
      hook: 'useId',
      summary: 'useId generates a unique, stable ID string per component instance. Reusing the same component produces different IDs automatically — no collisions, no hydration mismatches.',
      theory: {
        signature: 'const id = useId()',
        useWhen: 'You need a stable, unique id for <label htmlFor>, aria-describedby, or any DOM attribute that must be unique per component instance.',
        dontUseWhen: 'You need a key for list items (use data-driven keys), or a random token for cryptographic purposes.',
        classicPitfall: 'Hardcoding an id string like "my-input" — breaks when the component is rendered multiple times on the same page (duplicate IDs in the DOM).',
        mentalModel: 'Think of useId as a factory stamp. Every time React mounts an instance of your component, it stamps a new serial number on it. The number never changes for that instance, and no two instances share one.'
      },
      predict: {
        question: 'If <FormField /> is rendered 3 times on the same page, and each instance calls useId(), how many distinct IDs exist?',
        options: [
          { id: 'opt-3', label: '3 distinct IDs (one per instance)', correct: true, explain: 'Each component instance occupies a unique position in the React tree, so useId produces a different string for each.' },
          { id: 'opt-1', label: '1 shared ID (same hook = same value)', correct: false, explain: 'Hooks are scoped to the component instance, not the component definition. Each instance has its own hook state.' },
          { id: 'opt-depends', label: 'It depends on the render count', correct: false, explain: 'useId is stable across re-renders. The value never changes after mount.' }
        ]
      },
      tokenKey: 'idStrategy',
      tokenOptions: [
        { id: 'useid-basic', label: 'const id = useId();', preview: 'useId() [Stable & Unique]', isBroken: false, hint: 'Correct — each instance gets a unique, stable ID' },
        { id: 'hardcoded', label: 'const id = "my-input";', preview: '"my-input" [Hardcoded]', isBroken: true, hint: 'All instances share the same ID — duplicate IDs in the DOM!' },
        { id: 'math-random', label: 'const id = "input-" + Math.random().toString(36).slice(2, 6);', preview: 'Math.random() [Unstable]', isBroken: true, hint: 'Changes every render, breaks SSR hydration' }
      ],
      codeTemplate: (token) => `function FormField({ label }) {
  ${token}

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" placeholder={label} />
      <span className="id-badge">ID: {id}</span>
    </div>
  );
}

// Parent renders multiple instances:
function App() {
  return (
    <>
      <FormField label="Name" />
      <FormField label="Email" />
      <FormField label="Phone" />
    </>
  );
}`,
      explain: {
        takeaway: 'useId guarantees one unique, stable ID per component instance — no collisions, no hydration mismatches, zero configuration.',
        myths: [
          'Myth: useId produces a new value on every re-render. (It is stable — same value for the lifetime of the instance.)',
          'Myth: You can use useId to generate list keys. (Keys serve a different purpose and should come from your data.)'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'uid-basics': {
      const isHardcoded = tokenId === 'hardcoded';
      const isRandom = tokenId === 'math-random';
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'FormField',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useId',
            status: isHardcoded
              ? 'Shared "my-input" (Duplicate Collision!)'
              : isRandom
              ? 'input-* (Random Unstable IDs)'
              : 'Generated unique IDs (:r0:, :r1:, :r2:)'
          }
        ],
        commit: {
          diffSummary: isHardcoded
            ? 'Mounted 3× <FormField /> with duplicate ID "my-input"'
            : isRandom
            ? 'Mounted 3× <FormField /> with random unstable IDs'
            : 'Mounted 3× <FormField /> (Name: :r0:, Email: :r1:, Phone: :r2:)',
          mutationsCount: 3
        },
        effects: null
      };
    }

    case 'uid-a11y': {
      const isNoId = tokenId === 'no-id';
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'AccessibleField',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useId',
            status: isNoId ? 'No IDs provided' : 'Generated :r0: → :r0:-input, :r0:-hint'
          }
        ],
        commit: {
          diffSummary: isNoId
            ? 'Mounted <AccessibleField /> without ID attributes (Inaccessible)'
            : 'Mounted <AccessibleField />: Email input (:r0:-input) linked to label and hint',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
