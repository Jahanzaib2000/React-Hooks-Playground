// useOptimistic lesson definitions and execution traces
import { getInitialUseOptimisticInfo } from './helpers.js';

export function getInitialRender(lessonId, effTokenId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { confirmedColor: '#ffffff', optimisticColor: '#ffffff' },
    optimisticInfo: getInitialUseOptimisticInfo(lessonId, effTokenId)
  };
}

export const lessons = [
    {
      id: 'uo-server-toggle',
      title: '01. The Button & Server Toggle',
      hook: 'useOptimistic',
      summary: 'Update the UI immediately with useOptimistic. If Server is ON, commit the color change permanently. If Server is OFF, display the optimistic color for 3 seconds, then automatically rollback.',
      theory: {
        signature: 'const [optimisticState, setOptimistic] = useOptimistic(passthroughState, updateFn)',
        useWhen: 'Async actions that send requests to a server and need zero-latency visual feedback (buttons, upvotes, likes, inline edits).',
        dontUseWhen: 'Operations that cannot be safely rolled back (e.g. credit card charge, permanent delete), or synchronous local state.',
        classicPitfall: 'Writing redundant try/catch rollback code instead of letting React automatically discard the optimistic overlay when the transition completes.',
        mentalModel: 'An optimistic overlay: active while the async transition is pending. If the server fails or base state is not updated, React automatically discards the overlay when the transition finishes.'
      },
      predict: {
        question: 'With Server toggle set to OFF, if you click the White button to turn it Cyan, what will the button color be at 1 second, and what will it be at 4 seconds?',
        options: [
          { id: 'opt-auto-revert', label: 'Cyan at 1s (optimistic), then automatically reverts to White at 4s (server failed)', correct: true, explain: 'Spot on! The optimistic state displays Cyan instantly for the 3s transition. When the server rejects, React discards the optimistic overlay and reveals the unchanged confirmed state (White).' },
          { id: 'opt-blocked', label: 'White at both 1s and 4s (action blocked when server is offline)', correct: false, explain: 'Incorrect: useOptimistic renders the optimistic state immediately before waiting for the network request.' },
          { id: 'opt-permanent', label: 'Cyan at 1s, and stays Cyan permanently at 4s', correct: false, explain: 'Incorrect: without confirmed state updating, React automatically clears the optimistic overlay when the transition settles.' }
        ]
      },
      tokenKey: 'optimisticPattern',
      tokenOptions: [
        { id: 'optimistic-transition', label: 'useOptimistic + startTransition [Instant 0ms + Auto-Rollback]', preview: 'useOptimistic [Idiomatic]', isBroken: false, hint: 'Changes color instantly, auto-rolls back after 3s if server is off' },
        { id: 'traditional-sluggish', label: 'useState only [Sluggish 3s delay before UI updates]', preview: 'useState [Sluggish 3s]', isBroken: true, hint: 'Waits for the 3s server delay before changing color' },
        { id: 'premature-mutation', label: 'Direct useState mutation without rollback [Broken Desync]', preview: 'Direct useState [Desync Bug]', isBroken: true, hint: 'Changes color immediately, but when server fails, UI stays permanently wrong' }
      ],
      codeTemplate: (_token) => `function ColorButton({ isServerOn }) {
  const [confirmedColor, setConfirmedColor] = useState('#ffffff'); // White

  // React 19 useOptimistic:
  <TOKEN>

  const handleClick = () => {
    startTransition(async () => {
      // 1. Instant optimistic update:
      setOptimisticColor('#06b6d4'); // Cyan

      // 2. 3-second server mutation:
      const res = await api.updateColor('#06b6d4', { isServerOn, timeout: 3000 });

      // 3. If server confirmed, commit base state:
      if (res.ok) {
        setConfirmedColor('#06b6d4');
      }
      // If server failed: React auto-reverts to White on transition end.
    });
  };

  return (
    <button style={{ backgroundColor: optimisticColor }} onClick={handleClick}>
      Button
    </button>
  );
}`,
      explain: {
        takeaway: 'useOptimistic decouples perceived UI responsiveness from network delay. When an async transition finishes without updating the confirmed base state, React automatically purges the optimistic state with zero custom rollback code.',
        myths: [
          'Myth: You must write manual try/catch rollback logic with useOptimistic. (React clears it automatically!)',
          'Myth: useOptimistic replaces useState. (It sits on top of confirmed state as a transient overlay.)'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'uo-server-toggle': {
      const isSluggish = tokenId === 'traditional-sluggish';
      const isDesync = tokenId === 'premature-mutation';
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ColorButton',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'confirmedColor: "#ffffff" (White)' },
          {
            slot: 1,
            name: isSluggish || isDesync ? 'useState' : 'useOptimistic',
            status: isSluggish
              ? 'Traditional useState (no optimism)'
              : isDesync
              ? 'useState (premature mutation)'
              : 'optimisticColor: "#ffffff" (White)'
          }
        ],
        commit: {
          diffSummary: 'Mounted <ColorButton /> with confirmed White (#ffffff)',
          mutationsCount: 1
        },
        effects: null,
        optimisticInfo: getInitialUseOptimisticInfo(lessonId, tokenId)
      };
    }

    case 'uo-transition-gate':
    case 'uo-multi-queue': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ColorButton',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'confirmedColor: "#ffffff"' },
          { slot: 1, name: 'useOptimistic', status: 'optimisticColor: "#ffffff"' }
        ],
        commit: { diffSummary: 'Mounted <ColorButton />', mutationsCount: 1 },
        effects: null,
        optimisticInfo: getInitialUseOptimisticInfo(lessonId, tokenId)
      };
    }
    default:
      return null;
  }
}
