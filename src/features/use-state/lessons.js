// useState lesson definitions extracted from lessonsData.js
export const lessons = [
  {
    id: 'us-snapshot',
    title: '01. Simple Increment Counter',
    hook: 'useState',
    summary: 'Standard useState hook that preserves state across renders and triggers re-renders on update.',
    theory: {
      signature: 'const [count, setCount] = useState(initialValue)',
      useWhen: 'A value must persist across renders and changing it should trigger a re-render.',
      dontUseWhen: 'The value can be computed from existing props or state during render.',
      classicPitfall: 'Expecting state variables to mutate in place synchronously.',
      mentalModel: 'State belongs to React fiber memory. Calling setCount schedules a new render with the updated state.'
    },
    predict: {
      question: 'When you click "+1 Increment", how does React update the count?',
      options: [
        { id: 'opt-0', label: 'Schedules a new render with count + 1', correct: true, explain: 'Correct! React enqueues the state update and re-renders the component with the next count value.' },
        { id: 'opt-1', label: 'Directly mutates the current JavaScript variable in place', correct: false, explain: 'React state variables are immutable snapshots per render.' }
      ]
    },
    tokenKey: 'updateMethod',
    tokenOptions: [
      { id: 'direct', label: 'setCount(count + 1)', preview: 'count + 1', isBroken: false, hint: 'Direct setter updating count' }
    ],
    codeTemplate: () => `function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="counter-card">
      <div className="count-display">
        Count: <span className="highlight">{count}</span>
      </div>
      <button onClick={handleIncrement}>+1 Increment</button>
    </div>
  );
}`,
    explain: {
      takeaway: 'useState preserves state values between renders and re-renders the component whenever setCount is called.',
      myths: [
        'Myth: setCount mutates the variable immediately in place.',
        'Myth: Local component variables persist across renders without useState.'
      ]
    }
  },
  {
    id: 'us-const-error',
    title: '02. Const Variable (Immutable Error)',
    hook: 'useState',
    summary: 'Demonstrates why local const variables cannot act as state. Reassigning a const triggers a runtime TypeError.',
    theory: {
      signature: 'const count = 0 (Regular JavaScript constant)',
      useWhen: 'Declaring immutable values that never change.',
      dontUseWhen: 'You need values that update or trigger UI re-renders.',
      classicPitfall: 'Attempting to reassign or increment a constant variable.',
      mentalModel: 'JavaScript constants are strictly immutable. Only React state can store values that update over time.'
    },
    predict: {
      question: 'What happens when you attempt to increment a local const variable (count = count + 1)?',
      options: [
        { id: 'opt-err', label: 'TypeError: Assignment to constant variable', correct: true, explain: 'Correct! In JavaScript, const variables cannot be reassigned or mutated.' },
        { id: 'opt-ok', label: 'The variable silently increments and updates the UI', correct: false, explain: 'Incorrect: JavaScript strictly prohibits reassigning const identifiers.' }
      ]
    },
    tokenKey: 'constMethod',
    tokenOptions: [
      { id: 'const-assign', label: 'count = count + 1 // TypeError', preview: 'count = count + 1', isBroken: true, hint: 'Assignment to constant variable fails' }
    ],
    codeTemplate: () => `function ConstCounter() {
  // Local const variable instead of useState:
  const count = 0;

  const handleIncrement = () => {
    // TypeError: Assignment to constant variable
    count = count + 1; 
  };

  return (
    <div className="counter-card">
      <div className="count-display">
        Count: <span className="highlight">{count}</span>
      </div>
      <button onClick={handleIncrement}>+1 Increment</button>
    </div>
  );
}`,
    explain: {
      takeaway: 'Constants in JavaScript cannot be reassigned. To store mutable data that triggers UI re-renders across time, React useState is required.',
      myths: [
        'Myth: Local variables inside React components automatically trigger re-renders when modified.',
        'Myth: const variables can be reassigned if declared inside a React component.'
      ]
    }
  },
  {
    id: 'us-text-state',
    title: '03. Text State Input',
    hook: 'useState',
    summary: 'Demonstrates a controlled text input where user typing dynamically updates component state and UI in real time.',
    theory: {
      signature: 'const [text, setText] = useState("Hello React")',
      useWhen: 'Managing text inputs, form fields, and search queries.',
      dontUseWhen: 'Managing uncontrolled DOM references without re-rendering.',
      classicPitfall: 'Forgetting to provide an onChange handler for controlled inputs.',
      mentalModel: 'State drives the input value; the input onChange event updates the state, creating a controlled loop.'
    },
    predict: {
      question: 'When the user types into the input, how does the text displayed above change?',
      options: [
        { id: 'opt-sync', label: 'Updates immediately on every keystroke via setText(e.target.value)', correct: true, explain: 'Correct! The onChange event fires per keystroke, triggering a re-render with the updated text string.' },
        { id: 'opt-blur', label: 'Only updates after the user clicks outside or presses Enter', correct: false, explain: 'onChange in React fires on every keystroke, keeping state continuously in sync.' }
      ]
    },
    tokenKey: 'inputMethod',
    tokenOptions: [
      { id: 'controlled', label: 'setText(e.target.value)', preview: 'Controlled Input', isBroken: false, hint: 'Controlled input synchronizing text state' }
    ],
    codeTemplate: () => `function TextInputDemo() {
  const [text, setText] = useState("Hello React");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="text-demo-card">
      <div className="text-display">
        <span>Current Text: </span>
        <strong>{text}</strong>
      </div>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Type to update state..."
      />
    </div>
  );
}`,
    explain: {
      takeaway: 'Binding input onChange to useState allows React to drive controlled form inputs, synchronizing the DOM text in real time with component state.',
      myths: [
        'Myth: Text state updates require debouncing just to display on screen.',
        'Myth: Uncontrolled inputs are required for simple text displays.'
      ]
    }
  }
];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'us-snapshot':
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'Counter',
        renderNumber: 1,
        hooks: [
          { slot: 0, name: 'useState', status: 'count: 0', actionRequired: false, prevState: 'undefined', nextState: 0 }
        ],
        commit: { diffSummary: 'Mounted <Counter /> with count: 0', mutationsCount: 1 },
        effects: null
      };

    case 'us-const-error':
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ConstCounter',
        renderNumber: 1,
        hooks: [{ slot: 0, name: 'const variable', status: 'count: 0 (Immutable constant)', prevState: 'undefined', nextState: '0' }],
        commit: { diffSummary: 'Mounted ConstCounter with immutable const count: 0', mutationsCount: 1 },
        effects: null
      };

    case 'us-text-state':
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'TextInputDemo',
        renderNumber: 1,
        hooks: [{ slot: 0, name: 'useState', status: 'text: "Hello React"', prevState: 'undefined', nextState: '"Hello React"' }],
        commit: { diffSummary: 'Mounted TextInputDemo with text: "Hello React"', mutationsCount: 1 },
        effects: null
      };

    default:
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'Counter',
        renderNumber: 1,
        hooks: [{ slot: 0, name: 'useState', status: 'count: 0', prevState: 'undefined', nextState: '0' }],
        commit: { diffSummary: 'Mounted Counter with count: 0', mutationsCount: 1 },
        effects: null
      };
  }
}

export function getInitialRender(lessonId) {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: lessonId === 'us-text-state'
      ? { text: 'Hello React' }
      : (lessonId === 'us-const-error' ? { count: 0, isConst: true } : { count: 0 })
  };
}
