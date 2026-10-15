// useEffect lesson definitions
export const lessons = [
  {
    id: 'ue-deps-count',
    title: 'State 1: [count]',
    hook: 'useEffect',
    summary: 'Perimeter [count]: Fires on Initial Render, and re-fires whenever count updates.',
    theory: {
      signature: 'useEffect(() => { /* effect */ }, [count])',
      useWhen: 'Executing side effects when reactive count updates post-paint.',
      dontUseWhen: 'Calculating values that can be derived during rendering.',
      classicPitfall: 'Missing reactive dependencies in the dependency array.',
      mentalModel: 'Initial render always fires the effect. Subsequent renders check if [count] changed. If changed, the effect runs.'
    },
    predict: {
      question: 'When does useEffect execute with perimeter [count]?',
      options: [
        { id: 'opt-all', label: 'On Initial Render and whenever count updates', correct: true, explain: 'Correct! [count] fires on Initial Render and on every render where count updates.' },
        { id: 'opt-mount', label: 'Only on Initial Render', correct: false, explain: 'Incorrect: [count] re-runs on count updates.' },
        { id: 'opt-never', label: 'Never', correct: false, explain: 'Incorrect: useEffect always runs on Initial Render.' }
      ]
    },
    tokenKey: 'perimeter',
    tokenOptions: [
      {
        id: 'with-count',
        label: 'useEffect(() => { showPopup("This pop was called by the useEffect hook as a side Effect of count being updated to " + count); }, [count]);',
        preview: 'Perimeter: [count]',
        isBroken: false,
        hint: 'Fires on Initial Render and count updates'
      }
    ],
    codeTemplate: () => `function EffectDemo() {
  const [count, setCount] = useState(0);

  // Hook perimeter: [count]
  useEffect(() => {
    if (isFirstRender.current) {
      showPopup("This pop was called by the useEffect hook on Initial Render");
    } else {
      showPopup("This pop was called by the useEffect hook as a side Effect of count being updated to " + count);
    }
  }, [count]);

  return (
    <div className="sandbox-center">
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +1 Increment Count
      </button>
    </div>
  );
}`,
    explain: {
      takeaway: 'Perimeter [count] causes useEffect to run on Initial Render and whenever count changes.',
      myths: [
        'Myth: Dependency array prevents initial render execution.',
        'Myth: useEffect runs synchronously before paint.'
      ]
    }
  },
  {
    id: 'ue-deps-empty',
    title: 'State 2: []',
    hook: 'useEffect',
    summary: 'Perimeter []: Fires on Initial Render only, and never on the change of count.',
    theory: {
      signature: 'useEffect(() => { /* effect */ }, [])',
      useWhen: 'Executing one-time initialization post-paint on component mount.',
      dontUseWhen: 'You need the effect to synchronize with updating state.',
      classicPitfall: 'Expecting [] to re-run when state updates.',
      mentalModel: 'An empty array [] has zero dependencies, so dependencies never change across renders.'
    },
    predict: {
      question: 'When does useEffect execute with empty perimeter []?',
      options: [
        { id: 'opt-mount', label: 'Only on Initial Render', correct: true, explain: 'Correct! Empty dependency array [] fires on Initial Render and never on count updates.' },
        { id: 'opt-count', label: 'On every count update', correct: false, explain: 'Incorrect: An empty array [] never re-runs on count updates.' },
        { id: 'opt-never', label: 'Never', correct: false, explain: 'Incorrect: useEffect always executes on Initial Render.' }
      ]
    },
    tokenKey: 'perimeter',
    tokenOptions: [
      {
        id: 'empty',
        label: 'useEffect(() => { showPopup("This pop was called by the useEffect hook on Initial Render"); }, []);',
        preview: 'Perimeter: []',
        isBroken: false,
        hint: 'Fires on Initial Render ONLY'
      }
    ],
    codeTemplate: () => `function EffectDemo() {
  const [count, setCount] = useState(0);

  // Hook perimeter: []
  useEffect(() => {
    showPopup("This pop was called by the useEffect hook on Initial Render");
  }, []);

  return (
    <div className="sandbox-center">
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        +1 Increment Count
      </button>
    </div>
  );
}`,
    explain: {
      takeaway: 'Perimeter [] locks execution to Initial Render only. Subsequent state updates never fire this effect.',
      myths: [
        'Myth: An empty array prevents execution on Initial Render.',
        'Myth: useEffect without dependencies is the same as an empty array.'
      ]
    }
  }
];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'ue-deps-count':
    case 'ue-deps':
    case 'ue-lifecycle':
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'EffectDemo',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'count: 0' },
          {
            slot: 1,
            name: 'useEffect',
            status: tokenId === 'empty' ? 'Deps: [] (Mount only)' : 'Deps: [count] (On change)'
          }
        ],
        commit: { diffSummary: 'Mounted <EffectDemo /> with count: 0', mutationsCount: 1 },
        effects: {
          ran: true,
          cleanupRan: false,
          description: 'This pop was called by the useEffect hook on Initial Render',
          closureValues: { count: 0 }
        }
      };

    case 'ue-deps-empty':
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'EffectDemo',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'count: 0' },
          {
            slot: 1,
            name: 'useEffect',
            status: 'Deps: [] (Mount only)'
          }
        ],
        commit: { diffSummary: 'Mounted <EffectDemo /> with count: 0', mutationsCount: 1 },
        effects: {
          ran: true,
          cleanupRan: false,
          description: 'This pop was called by the useEffect hook on Initial Render',
          closureValues: { count: 0 }
        }
      };

    case 'ue-cleanup':
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'TimerComponent',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'seconds: 0' },
          { slot: 1, name: 'useEffect', status: 'Timer Subscription Setup' }
        ],
        commit: { diffSummary: 'Mounted <TimerComponent />', mutationsCount: 1 },
        effects: {
          ran: true,
          cleanupRan: false,
          description: 'Started timer subscription (setInterval)',
          closureValues: { seconds: 0 }
        }
      };

    default:
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'EffectDemo',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'count: 0' },
          { slot: 1, name: 'useEffect', status: 'Deps: [count]' }
        ],
        commit: { diffSummary: 'Mounted <EffectDemo />', mutationsCount: 1 },
        effects: { ran: true, cleanupRan: false, description: 'Effect ran on mount', closureValues: { count: 0 } }
      };
  }
}

export function getInitialRender(lessonId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: lessonId === 'ue-cleanup' ? { seconds: 0 } : { count: 0 }
  };
}
