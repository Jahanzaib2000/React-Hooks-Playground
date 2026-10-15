// useTransition lesson definitions and execution traces
import { getInitialUseTransitionInfo } from './helpers.js';

export function getInitialRender(lessonId, effTokenId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { isHeavyRunning: false, isTransitionOn: effTokenId === 'use-transition' },
    transitionInfo: getInitialUseTransitionInfo(lessonId, effTokenId)
  };
}

export const lessons = [
    {
      id: 'ut-freeze-demo',
      title: '01. The 3 Buttons & Transition Toggle',
      hook: 'useTransition',
      summary: 'A toggle controls useTransition. The Heavy Computation button turns Cyan for 10 seconds, then reverts to White. When the toggle is OFF, Button 1 & 2 are frozen. When ON, Button 1 & 2 can be pressed immediately and turn LightBlue.',
      theory: {
        signature: 'const [isPending, startTransition] = useTransition()',
        useWhen: 'Heavy computations or slow UI re-renders where you need other buttons, inputs, and tabs to stay immediately clickable.',
        dontUseWhen: 'Direct keystroke inputs or immediate state where a loading phase is unnecessary.',
        classicPitfall: 'Treating startTransition like an async promise runner instead of a React state priority classifier.',
        mentalModel: 'Priority scheduling: transition updates are marked as low-priority. When the user clicks Button 1 or Button 2, React immediately interrupts the transition to paint the urgent click.'
      },
      predict: {
        question: 'With the useTransition toggle set to OFF, you click Heavy Computation (turns Cyan). What happens when you try to click Button 1?',
        options: [
          { id: 'opt-frozen', label: 'Button 1 is completely frozen and cannot turn LightBlue until the 10 seconds finish', correct: true, explain: 'Correct! Without useTransition, the synchronous execution blocks the component, locking Button 1 and Button 2 out of any interactions.' },
          { id: 'opt-instant', label: 'Button 1 turns LightBlue immediately with no delay', correct: false, explain: 'Incorrect: with the toggle OFF, the heavy task freezes the other buttons.' },
          { id: 'opt-cyan', label: 'Button 1 turns Cyan instead of LightBlue', correct: false, explain: 'Incorrect: Button 1 turns LightBlue when active, but it is blocked while frozen.' }
        ]
      },
      tokenKey: 'transitionTogglePattern',
      tokenOptions: [
        { id: 'use-transition', label: 'startTransition(() => runHeavy()) [Concurrent: Buttons 1 & 2 Responsive]', preview: 'useTransition [Responsive]', isBroken: false, hint: 'Keeps Button 1 & 2 responsive' },
        { id: 'blocking-sync', label: 'runHeavy() // Direct blocking call [Freezes Buttons 1 & 2 for 10s]', preview: 'Blocking [Freezes UI]', isBroken: true, hint: 'Locks all other buttons for 10 seconds' }
      ],
      codeTemplate: (_token) => `function ConcurrencyDemo({ isTransitionOn }) {
  const [isPending, startTransition] = useTransition();
  const [btn1Active, setBtn1Active] = useState(false);
  const [btn2Active, setBtn2Active] = useState(false);
  const [isHeavyRunning, setIsHeavyRunning] = useState(false);

  const handleHeavyClick = () => {
    <TOKEN>
  };

  return (
    <div>
      <button style={{ backgroundColor: isHeavyRunning ? '#06b6d4' : '#ffffff' }} onClick={handleHeavyClick}>
        Heavy Computation
      </button>
      <button style={{ backgroundColor: btn1Active ? '#38bdf8' : '' }} onClick={() => setBtn1Active(p => !p)}>
        Button 1
      </button>
      <button style={{ backgroundColor: btn2Active ? '#38bdf8' : '' }} onClick={() => setBtn2Active(p => !p)}>
        Button 2
      </button>
    </div>
  );
}`,
      explain: {
        takeaway: 'useTransition prevents long-running operations from hijacking the user interface. While a 10-second heavy computation runs, urgent user events on Button 1 and Button 2 interrupt and paint immediately.',
        myths: [
          'Myth: useTransition makes JavaScript code execute faster. (It does not speed up CPU execution; it manages UI priority so other buttons do not freeze.)',
          'Myth: You must show countdown timers with useTransition. (Color feedback like Cyan and LightBlue clearly conveys state without visual clutter.)'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, tokenId = '') {
  switch (lessonId) {
    case 'ut-freeze-demo':
    case 'ut-interrupt-lane':
    case 'ut-pending-feedback': {
      const isSync = tokenId === 'blocking-sync';
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ConcurrencyDemo',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: isSync ? 'useState' : 'useTransition',
            status: isSync ? 'Sync Lane (Blocking)' : 'Concurrent Lane (Non-blocking)'
          },
          { slot: 1, name: 'useState', status: 'isHeavyRunning: false (White)' },
          { slot: 2, name: 'useState', status: 'btn1Active: false, btn2Active: false' }
        ],
        commit: {
          diffSummary: 'Mounted <ConcurrencyDemo /> with 3 buttons: Heavy Computation, Button 1, Button 2',
          mutationsCount: 1
        },
        effects: null,
        transitionInfo: getInitialUseTransitionInfo(lessonId, tokenId)
      };
    }
    default:
      return null;
  }
}
