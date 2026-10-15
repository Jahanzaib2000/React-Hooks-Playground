// useFormStatus lesson definitions and execution traces
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
      id: 'ufs-form-boundary',
      title: '01. The Form Boundary Rule',
      hook: 'useFormStatus',
      summary: 'useFormStatus must be called from a child component inside <form>, reading pending status directly from the form context.',
      theory: {
        signature: 'const { pending, data, method, action } = useFormStatus()',
        useWhen: 'Building design-system buttons, loaders, or indicators that need submission status without prop drilling.',
        dontUseWhen: 'Calling inside the same component that renders the <form> itself.',
        classicPitfall: 'Calling useFormStatus in the parent component containing <form>, which always returns pending: false.',
        mentalModel: 'A passenger inside a train asking the conductor if the train is currently in motion.'
      },
      predict: {
        question: 'What does useFormStatus() return if called in the same component that renders <form>?',
        options: [
          {
            id: 'opt-always-false',
            label: 'It returns pending: false because there is no parent Form Context available to read from.',
            correct: true,
            explain: 'Correct! useFormStatus relies on React internal context provided by a parent form element.'
          },
          {
            id: 'opt-syntax-error',
            label: 'It throws a syntax error during compilation.',
            correct: false,
            explain: 'Incorrect: It runs normally, but returns empty/idle status ({ pending: false }).'
          }
        ]
      },
      tokenKey: 'componentBoundary',
      tokenOptions: [
        {
          id: 'child-boundary',
          label: 'function SubmitButton() { const { pending } = useFormStatus(); ... }',
          preview: 'Child SubmitButton [Correct Context Boundary]',
          isBroken: false,
          hint: 'Reads form context from the parent <form>'
        },
        {
          id: 'parent-boundary',
          label: 'function Form() { const { pending } = useFormStatus(); return <form>...; }',
          preview: 'Parent Form Hook [Broken: No Parent Context]',
          isBroken: true,
          hint: 'Calling in the same component as <form> fails to read status'
        }
      ],
      codeTemplate: (_token) => `import { useFormStatus } from 'react-dom';

<TOKEN>
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Loading' : 'Submit'}
    </button>
  );
}

function FeedbackForm({ action }) {
  return (
    <form action={action}>
      <input type="text" name="entryText" />
      <SubmitButton />
    </form>
  );
}`,
      explain: {
        takeaway: 'useFormStatus gives child components context-based access to form submission states without manual prop forwarding.',
        myths: [
          'Myth: useFormStatus works anywhere in the component that declares <form>.',
          'Myth: useFormStatus requires custom React Context providers.'
        ]
      }
    },
    {
      id: 'ufs-pending-state',
      title: '02. Hook vs Traditional Method',
      hook: 'useFormStatus',
      summary: 'Side-by-side comparison: Traditional parent useState forces 2 full-form re-renders per submit, whereas useFormStatus isolates updates to the button with 0 form re-renders.',
      theory: {
        signature: 'const { pending } = useFormStatus()',
        useWhen: 'Automatically disabling submit buttons and providing loading feedback during async operations with zero parent re-renders.',
        dontUseWhen: 'Handling non-form asynchronous operations (use useTransition instead).',
        classicPitfall: 'Hoisting useState(isSubmitting) to the parent form, which forces the entire form and its inputs to re-render twice per submission.',
        mentalModel: 'An elevator in-transit indicator light wired directly to the elevator cable without rebuilding the entire elevator car.'
      },
      predict: {
        question: 'Why is the useFormStatus method more efficient than hoisting useState in the parent form?',
        options: [
          {
            id: 'opt-isolated-renders',
            label: 'useFormStatus isolates re-renders to the button component, resulting in 0 re-renders for the parent form and text inputs.',
            correct: true,
            explain: 'Exactly! Form Context delivers pending state directly to the consumer button without triggering parent reconciliations.'
          },
          {
            id: 'opt-hoisted-renders',
            label: 'Hoisting useState in the parent is faster because React merges all component renders into one batch.',
            correct: false,
            explain: 'Incorrect: Parent useState updates force the form, inputs, and all children to re-render twice on every submit.'
          }
        ]
      },
      splitCodes: {
        left: {
          title: 'Traditional Method (useState)',
          badge: 'Inefficient: 2 Form Re-renders',
          code: `// Traditional: useState hoisted to parent form
function TraditionalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);  // RENDER 1: Re-renders entire form & inputs
    await sendData(text);
    setText('');
    setIsSubmitting(false); // RENDER 2: Re-renders entire form & inputs
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading' : 'Submit'}
      </button>
    </form>
  );
}`,
          note: 'Full Form Re-renders: Hoisting state to the form causes all inputs, labels, and siblings to re-render twice on every submit.'
        },
        right: {
          title: 'useFormStatus Method (React 19)',
          badge: 'Efficient: 0 Form Re-renders',
          code: `// React 19: useFormStatus inside child button
function SubmitButton() {
  // Reads pending directly from Form Context
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Loading' : 'Submit'}
    </button>
  );
}

function ModernForm({ action }) {
  // Parent form undergoes 0 re-renders on submit!
  return (
    <form action={action}>
      <input type="text" name="entryText" />
      <SubmitButton />
    </form>
  );
}`,
          note: 'Isolated Render Boundary: Pending state updates are scoped strictly to SubmitButton. The parent form and text inputs undergo 0 re-renders.'
        }
      },
      tokenKey: 'pendingPattern',
      tokenOptions: [
        {
          id: 'declarative-status',
          label: 'disabled={pending}> {pending ? "Loading" : "Submit"}',
          preview: 'Declarative useFormStatus [Zero Manual State]',
          isBroken: false,
          hint: 'React handles pending lifecycle automatically'
        },
        {
          id: 'manual-state',
          label: 'disabled={isLoading}> {isLoading ? "Loading" : "Submit"}',
          preview: 'Manual State [Boilerplate useState]',
          isBroken: true,
          hint: 'Requires manual try/finally state tracking'
        }
      ],
      codeTemplate: (_token) => `function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" <TOKEN> </button>
  );
}`,
      explain: {
        takeaway: 'useFormStatus eliminates boilerplate loading states and prevents wasteful parent form re-renders by leveraging Form Context.',
        myths: [
          'Myth: useFormStatus only works with HTML POST methods.',
          'Myth: Hoisting useState to the form parent is just as performant as useFormStatus.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'ufs-form-boundary':
    case 'ufs-pending-state': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'FormStatusPlayground',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useFormStatus',
            status: 'pending: false, data: null',
            actionRequired: false,
            prevState: 'undefined',
            nextState: '{ pending: false }'
          }
        ],
        commit: {
          diffSummary: 'Mounted Form and Submissions Storage Box',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
