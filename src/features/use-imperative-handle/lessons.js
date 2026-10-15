// useImperativeHandle lesson definitions and execution traces
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
      id: 'uih-basic-handle',
      title: '01. Exposing Custom Imperative Methods',
      hook: 'useImperativeHandle',
      summary: 'Allow the Parent Box to imperatively trigger child animations (Red & Blue Fireworks) by exposing targeted methods through useImperativeHandle.',
      theory: {
        signature: 'useImperativeHandle(ref, createHandle, [deps])',
        useWhen: 'A parent needs imperative access to specialized child workflows (animations, resets, media playback, canvas redraws) without exposing raw DOM nodes.',
        dontUseWhen: 'Data or actions can be naturally represented with declarative props and callback handlers.',
        classicPitfall: 'Mutating DOM state directly from the parent instead of wrapping imperative behaviors inside child methods.',
        mentalModel: 'A sealed hotel room door with an intercom: the parent cannot barge in, but can press a button on the intercom to request a service.'
      },
      predict: {
        question: 'What happens when Box 1 clicks "Red Fireworks" with the useImperativeHandle toggle ON?',
        options: [
          {
            id: 'opt-handle-fires',
            label: 'The parent invokes refLeft.current.triggerFireworks(), triggering red fireworks on the parent without accessing raw DOM nodes.',
            correct: true,
            explain: 'Correct! useImperativeHandle provides a clean, controlled public API that only exposes triggerFireworks.'
          },
          {
            id: 'opt-entire-dom',
            label: 'The parent receives the entire HTML div element of the child and manually appends canvas elements.',
            correct: false,
            explain: 'Incorrect: useImperativeHandle replaces the default DOM ref value with a tailored object.'
          },
          {
            id: 'opt-rerender-all',
            label: 'The parent triggers a complete component remount across all children.',
            correct: false,
            explain: 'Incorrect: Imperative handles invoke internal methods directly without remounting.'
          }
        ]
      },
      tokenKey: 'handlePattern',
      tokenOptions: [
        {
          id: 'custom-handle',
          label: 'useImperativeHandle(ref, () => ({ triggerFireworks })); // Selective API',
          preview: 'useImperativeHandle [Expose fireworks method]',
          isBroken: false,
          hint: 'Exposes only designated methods to the parent'
        },
        {
          id: 'leaky-dom-ref',
          label: 'useImperativeHandle(ref, () => domElement); // Leaky Abstraction',
          preview: 'Raw DOM [Breaks Encapsulation]',
          isBroken: true,
          hint: 'Leaking the raw DOM node exposes internal styles and children to parent mutation'
        }
      ],
      codeTemplate: (_token) => `function ChildFireworksBox({ ref }) {
  const [active, setActive] = useState(false);

  const triggerFireworks = () => {
    setActive(true);
    setTimeout(() => setActive(false), 2000);
  };

  <TOKEN>

  return <div className="child-box">{active && <Fireworks />}</div>;
}`,
      explain: {
        takeaway: 'useImperativeHandle lets you define a strict, secure public API on your components, ensuring parent components only trigger intended actions.',
        myths: [
          'Myth: useImperativeHandle is required for every ref in React.',
          'Myth: useImperativeHandle bypasses all React reconciliation rules.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'uih-basic-handle':
    case 'uih-encapsulation':
    case 'uih-react19-refs': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ImperativePlayground',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useImperativeHandle',
            status: 'Handle Bridge: OFF (Encapsulation Active)',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'null'
          }
        ],
        commit: {
          diffSummary: 'Mounted 3 boxes (Parent + Left Child + Right Child) with Ref Bridge OFF',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
