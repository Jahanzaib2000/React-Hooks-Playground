// use lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { stepIndex: 0, phase: 't0 - Initial Mount', rendersWithoutUse: 2, rendersWithUse: 1 }
  };
}

export const lessons = [
    {
      id: 'use-promise-suspense',
      title: '01. Suspense & Timeline Execution',
      hook: 'use',
      summary: 'use unwraps asynchronous resources (Promises) and Context directly during render, pausing execution via Suspense without committing partial DOM states.',
      theory: {
        signature: 'const value = use(resource)',
        useWhen: 'Unwrapping Promises or reading Context dynamically inside render, loops, or conditional branches in React 19.',
        dontUseWhen: 'Inside async functions or catch blocks (use must be invoked directly within synchronous component render passes).',
        classicPitfall: 'Instantiating fresh Promises inside component render body instead of receiving them from props or a cache, causing infinite suspension loops.',
        mentalModel: 'Synchronous resource unwrap: if ready, returns value immediately; if pending, pauses render and hands control to Suspense without committing partial UI.'
      },
      predict: {
        question: 'What happens when a component executes use(pendingPromise)?',
        options: [
          { id: 'opt-pause', label: 'Pauses render via Suspense and displays fallback without DOM layout shift', correct: true, explain: 'Correct! use() pauses fiber execution and resumes directly once resolved, needing only 1 render pass.' },
          { id: 'opt-waterfall', label: 'Commits an empty state, triggers an effect after paint, and re-renders twice', correct: false, explain: 'Incorrect: That is traditional useEffect behavior. use() avoids this waterfall.' }
        ]
      },
      tokenKey: 'executionMode',
      tokenOptions: [
        {
          id: 'standard',
          label: '01. Suspense & Timeline Execution',
          preview: 'use(promise) [Suspense Pause & Resume]',
          isBroken: false,
          hint: 'Dual-lane timeline comparing Without use vs With use on a shared time axis'
        }
      ],
      codeTemplate: () => `// React 19: The use() Hook / API
// -------------------------------------------------------------
// Top Lane: Without use (Traditional 5-block useEffect waterfall)
// Renders: 2 passes | Commits empty state | Causes layout shift
function ProfileWithoutUse({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 3. Effect fires -> 4. Fetch runs in background
    fetchProfile(userId).then(setData);
  }, [userId]);

  // 1. Render -> 2. Shows empty or loading state (Render #1 commit)
  if (!data) return <SkeletonLoader />;

  // 5. Re-render with data (Render #2 commit)
  return <div>{data.name}</div>;
}

// -------------------------------------------------------------
// Bottom Lane: With use (React 19 4-block Suspense flow)
// Renders: 1 pass | Zero empty DOM flash | Seamless resume
function ProfileWithUse({ userPromise }) {
  // 1. Render starts (standard component function execution)
  // 2. Reaches the data request -> [use] asks for the data
  // 3. Paused [hatched bar] -> [use] pauses the render (Suspense)
  // 4. Render finishes with data -> [use] hands back the data
  const data = use(userPromise);

  return <div>{data.name}</div>;
}`,
      explain: {
        takeaway: 'The React 19 use() hook unwraps Promises directly in render. If pending, use() pauses the component render and lets Suspense handle the fallback, eliminating double-render waterfalls and loading flickers.',
        myths: [
          'Myth: use() is just useEffect with simpler syntax.',
          'Myth: Components must always commit empty states to the DOM before showing fetched data.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'use-promise-suspense': {
      return {
        trigger: { label: 'Initial Mount (t0)', type: 'Mount' },
        componentName: 'ProfileWithUse',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'use(userPromise)',
            status: 'Ready: 2 horizontal lanes on 1 time axis',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'Resolved { name: "Alice" }'
          }
        ],
        commit: {
          diffSummary: 'Dual-lane timeline ready: "Without use" (5 blocks) vs "With use" (4 blocks)',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
