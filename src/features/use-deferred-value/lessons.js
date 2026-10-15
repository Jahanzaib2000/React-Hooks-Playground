// useDeferredValue lesson definitions and execution traces
import { getInitialUseDeferredValueInfo } from './helpers.js';

export function getInitialRender(lessonId, effTokenId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { urgentProduct: 408, deferredProduct: 408 },
    deferredInfo: getInitialUseDeferredValueInfo(lessonId, effTokenId)
  };
}

export const lessons = [
    {
      id: 'udv-delayed-multi',
      title: '01. The 3-Second Delayed Multiplier',
      hook: 'useDeferredValue',
      summary: 'A button triggers the multiplication of 2 random numbers. The button and input factors respond immediately (0ms), while the computation is deferred for 3 seconds using useDeferredValue.',
      theory: {
        signature: 'const deferredValue = useDeferredValue(value, initialValue?)',
        useWhen: 'Expensive mathematical calculations, heavy subtrees, or fast-changing inputs where the urgent UI must remain 100% interactive without freezing.',
        dontUseWhen: 'Asynchronous network fetching (prefer useTransition or React 19 Actions), or lightweight synchronous state that renders instantly.',
        classicPitfall: 'Forgetting that child components consuming deferred values must be memoized with React.memo or useMemo, otherwise they re-render during the urgent pass regardless.',
        mentalModel: 'Dual-phase rendering: urgent pass paints the click and inputs at 0ms; deferred background pass computes the heavy mathematical product while keeping previous output visible with an isStale flag.'
      },
      predict: {
        question: 'When you press the button to generate two new random numbers (e.g. 47 and 83), what does the calculation box show during the 3-second delay?',
        options: [
          { id: 'opt-stale-visible', label: 'The previous multiplication remains visible in a dimmed/stale state (UI never freezes or blanks out)', correct: true, explain: 'Spot on! useDeferredValue keeps the old value active while React prepares the new pass. Comparing value !== deferredValue allows us to visually dim the card and indicate in-flight work.' },
          { id: 'opt-blank-out', label: 'The entire calculation area blanks out until the 3 seconds elapse', correct: false, explain: 'Incorrect: useDeferredValue avoids jarring blank layouts by preserving the existing DOM result until the next is ready.' },
          { id: 'opt-freeze', label: 'The button freezes in place and blocks further clicks for 3 seconds', correct: false, explain: 'Incorrect: with useDeferredValue the urgent UI remains 100% responsive and clickable with zero thread locking.' }
        ]
      },
      tokenKey: 'deferredPattern',
      tokenOptions: [
        { id: 'deferred-value', label: 'useDeferredValue(factors) + isStale [Idiomatic 0ms + Deferred 3s]', preview: 'useDeferredValue [Idiomatic]', isBroken: false, hint: 'Instant button response, deferred 3s calculation with stale indicator' },
        { id: 'blocking-sync', label: 'Synchronous Blocking [Laggy 3s Main-Thread Freeze]', preview: 'Sync Blocking [Frozen UI]', isBroken: true, hint: 'Freezes the entire browser tab for 3s' },
        { id: 'naked-timeout', label: 'Raw setTimeout only [No isStale, Stale Closure Trap]', preview: 'setTimeout only [No Stale]', isBroken: true, hint: 'Delays everything without React concurrency or stale UI indicators' }
      ],
      codeTemplate: (_token) => `function DeferredMultiplierDemo() {
  const [factors, setFactors] = useState({ a: 12, b: 34 });

  // React 18/19 useDeferredValue:
  <TOKEN>

  const isStale = factors !== deferredFactors;

  const handleCompute = () => {
    // 1. Instant 0ms urgent state update:
    setFactors({
      a: Math.floor(Math.random() * 90) + 10,
      b: Math.floor(Math.random() * 90) + 10
    });
  };

  return (
    <div className="multiplier-container">
      <button onClick={handleCompute}>Calculate Multiplication</button>
      <div className="urgent-badge">Inputs: {factors.a} × {factors.b}</div>
      <CalculationCard factors={deferredFactors} isStale={isStale} delayMs={3000} />
    </div>
  );
}`,
      explain: {
        takeaway: 'useDeferredValue decouples the urgent event response (0ms button click) from the heavy deferred computation (3-second multiplication). The user stays in control of the interface while background work progresses.',
        myths: [
          'Myth: useDeferredValue is a replacement for debouncing network requests. (It is for CPU/render deferral, not API rate-limiting.)',
          'Myth: useDeferredValue delays state setting. (State updates immediately; React only defers the downstream consumer render.)'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'udv-delayed-multi':
    case 'udv-memo-boundary':
    case 'udv-vs-transition': {
      const isSync = tokenId === 'blocking-sync';
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'DeferredMultiplierDemo',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'factors: { a: 12, b: 34 }' },
          {
            slot: 1,
            name: isSync ? 'useState' : 'useDeferredValue',
            status: isSync
              ? 'Synchronous state (blocking)'
              : 'deferredFactors: { a: 12, b: 34 }'
          }
        ],
        commit: {
          diffSummary: 'Mounted <DeferredMultiplierDemo />: 12 × 34 = 408',
          mutationsCount: 1
        },
        effects: null,
        deferredInfo: getInitialUseDeferredValueInfo(lessonId, tokenId)
      };
    }
    default:
      return null;
  }
}
