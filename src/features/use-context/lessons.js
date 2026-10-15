// useContext lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { theme: 'dark' }
  };
}

export const lessons = [
    {
      id: 'uc-theme-drilling',
      title: '01. Prop Drilling vs useContext Teleportation',
      hook: 'useContext',
      summary: 'Compare passing theme data down through 3 intermediate component layers with a 1-second cascade delay versus broadcasting instantaneously to all consumers with useContext.',
      theory: {
        signature: 'const value = useContext(ThemeContext);',
        useWhen: 'Deeply nested components at different levels need shared state (Theme, User, Locale) without passing props through intermediate layers.',
        dontUseWhen: 'Passing props directly down 1 level to an immediate child component.',
        classicPitfall: 'Passing props through 3 or 4 intermediary layers that neither care about nor consume the data.',
        mentalModel: 'Prop drilling is a slow domino cascade (1s/layer). useContext is an instant direct broadcast beam (0s).'
      },
      predict: {
        question: 'What happens when Box 1 passes theme down via props compared to broadcasting via useContext?',
        options: [
          {
            id: 'opt-prop-delay',
            label: 'Prop drilling forces every intermediate box to receive and forward the prop with a delay, while useContext reaches all boxes simultaneously with 0s delay.',
            correct: true,
            explain: 'Exactly! Prop drilling couples intermediate components (Box 2 & 3) to data they do not need. useContext connects consumers directly to the Provider instantly.'
          },
          {
            id: 'opt-props-faster',
            label: 'Prop drilling is always faster than useContext because props use WebAssembly.',
            correct: false,
            explain: 'Incorrect: Prop drilling requires cascading re-renders and manual parameter wiring across every level.'
          },
          {
            id: 'opt-same-thing',
            label: 'There is no difference in architecture between prop drilling and useContext.',
            correct: false,
            explain: 'Incorrect: useContext creates an atomic broadcast subscription, bypassing intermediate component layers.'
          }
        ]
      },
      tokenKey: 'contextMode',
      tokenOptions: [
        {
          id: 'use-context-broadcast',
          label: 'const theme = useContext(ThemeContext); // Direct Teleportation',
          preview: 'useContext [0s Instant Broadcast]',
          isBroken: false,
          hint: 'Connects consumers directly without prop drilling'
        },
        {
          id: 'manual-prop-drilling',
          label: '<PageLayout theme={theme} /> // Manual 3-Level Cascade',
          preview: 'Prop Drilling [1s Delay / Level]',
          isBroken: true,
          hint: 'Forces intermediate boxes to relay props sequentially'
        }
      ],
      codeTemplate: (_token) => `// ThemeContext Definition
const ThemeContext = createContext('dark');

function AppRoot() {
  const [theme, setTheme] = useState('dark');

  // Box 1: Theme Source
  return (
    <ThemeContext.Provider value={theme}>
      <TOKEN>
    </ThemeContext.Provider>
  );
}`,
      explain: {
        takeaway: 'useContext lets leaf components subscribe directly to distant ancestor state, eliminating intermediary prop drilling.',
        myths: [
          'Myth: useContext makes state globally accessible outside the React component tree.',
          'Myth: You must always pass props if components are nested inside each other.'
        ]
      }
    },
    {
      id: 'uc-provider-scope',
      title: '02. Provider Scoping & Component Hierarchy',
      hook: 'useContext',
      summary: 'Understand how React resolves context by looking upward to the nearest Provider ancestor in the tree.',
      theory: {
        signature: 'const value = useContext(MyContext)',
        useWhen: 'Providing localized theme overrides or scoped instances of shared services.',
        dontUseWhen: 'You have only one flat component without hierarchy.',
        classicPitfall: 'Forgetting the value prop on <Provider>, which defaults to undefined instead of the createContext fallback.',
        mentalModel: 'An upward elevator: React travels strictly UP the component tree and stops at the FIRST matching Provider.'
      },
      predict: {
        question: 'If a component calls useContext(ThemeContext), which Provider does it resolve its value from?',
        options: [
          {
            id: 'opt-nearest',
            label: 'The nearest matching Provider above it in the component tree hierarchy.',
            correct: true,
            explain: 'Correct! Context resolution travels upward to find the closest ancestor Provider.'
          },
          {
            id: 'opt-root-only',
            label: 'Always the root Provider at the very top of the app, ignoring nested providers.',
            correct: false,
            explain: 'Incorrect: A closer nested Provider will override the root Provider.'
          },
          {
            id: 'opt-random',
            label: 'A random Provider selected by React reconciliation.',
            correct: false,
            explain: 'Incorrect: Resolution is deterministic based on the component tree.'
          }
        ]
      },
      tokenKey: 'scopingPattern',
      tokenOptions: [
        {
          id: 'nearest-provider',
          label: '<ThemeContext.Provider value="dark"> // Nearest Ancestor',
          preview: 'Nearest Provider [Scoped]',
          isBroken: false,
          hint: 'Resolves value from closest matching provider'
        },
        {
          id: 'missing-value',
          label: '<ThemeContext.Provider> // Missing value prop',
          preview: 'Missing Value [Undefined Trap]',
          isBroken: true,
          hint: 'Evaluates to undefined instead of createContext fallback'
        }
      ],
      codeTemplate: (_token) => `function App() {
  return (
    <TOKEN>
      <PageLayout />
    </ThemeContext.Provider>
  );
}`,
      explain: {
        takeaway: 'Context resolution is strictly hierarchical. Closer providers shadow distant ancestor providers.',
        myths: [
          'Myth: Multiple providers of the same context conflict and cause infinite loops.',
          'Myth: Omitting the value prop on Provider falls back to defaultValue.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'uc-theme-drilling':
    case 'uc-provider-scope':
    case 'uc-rerender-optimization': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ThemePlayground',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useContext',
            status: lessonId === 'uc-provider-scope' ? 'ThemeContext: "light" (Box 1)' : 'ThemeContext: "dark"',
            actionRequired: false,
            prevState: 'undefined',
            nextState: lessonId === 'uc-provider-scope' ? '"light"' : '"dark"'
          }
        ],
        commit: {
          diffSummary: lessonId === 'uc-provider-scope'
            ? 'Mounted 3-Layer Component Tree (Boxes 1-7) and Side useContext Hub'
            : 'Mounted 4 Theme boxes (Box 1, 2, 3, 4) and Side useContext Hub',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
