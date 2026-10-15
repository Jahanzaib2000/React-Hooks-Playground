// useSyncExternalStore lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { isConnected: true }
  };
}

export const lessons = [
    {
      id: 'useses-server-connection',
      title: '01. Server Connection Store',
      hook: 'useSyncExternalStore',
      summary: 'useSyncExternalStore subscribes to an external mutable store outside of React and synchronously reads its snapshot, preventing tearing in concurrent renders.',
      theory: {
        signature: 'const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)',
        useWhen: 'Subscribing to external non-React stores (browser APIs, global mutable state, network connection managers).',
        dontUseWhen: 'Managing state that is already scoped within React components (use useState or useReducer).',
        classicPitfall: 'Returning a newly created object reference from getSnapshot on every call, causing infinite re-render loops.',
        mentalModel: 'A direct synchronous wire between an external mutable source of truth and React component rendering.'
      },
      predict: {
        question: 'What happens to the UI Interface when the server connection toggle is changed?',
        options: [
          { id: 'opt-sync', label: 'Updates synchronously to Connected (Green) or Disconnected (Red)', correct: true, explain: 'Correct! useSyncExternalStore immediately reads the store snapshot and renders without tearing.' },
          { id: 'opt-async', label: 'Waits for an asynchronous useEffect commit before updating', correct: false, explain: 'Incorrect: useSyncExternalStore is synchronous and does not delay until post-paint.' },
          { id: 'opt-none', label: 'Does not update until a parent component re-renders', correct: false, explain: 'Incorrect: The subscription listener triggers an immediate re-render of the subscribed component.' }
        ]
      },
      tokenKey: 'storeSubscription',
      tokenOptions: [
        {
          id: 'sync-store',
          label: 'const isConnected = useSyncExternalStore(serverConnectionStore.subscribe, serverConnectionStore.getSnapshot);',
          preview: 'useSyncExternalStore [Synchronous Store Subscription]',
          isBroken: false,
          hint: 'Subscribes directly to external server connection store'
        }
      ],
      codeTemplate: () => `// External Store:
let isConnected = true;
const listeners = new Set();
const serverConnectionStore = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  getSnapshot: () => isConnected,
  setConnected(status) {
    isConnected = status;
    listeners.forEach(fn => fn());
  }
};

function UIInterface() {
  // Synchronous subscription to external store:
  const isConnected = useSyncExternalStore(
    serverConnectionStore.subscribe,
    serverConnectionStore.getSnapshot
  );

  return (
    <div className="ui-interface-node">
      <span>Status: </span>
      <span className={isConnected ? "status-connected" : "status-disconnected"}>
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}`,
      explain: {
        takeaway: 'useSyncExternalStore allows React components to subscribe to any external data source safely and synchronously without tearing.',
        myths: [
          'Myth: useSyncExternalStore only works with Redux or state management libraries.',
          'Myth: getSnapshot can return a new object literal on every invocation.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'useses-server-connection': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'UIInterface',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useSyncExternalStore',
            status: 'isServerConnected: true (Connected)',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'true'
          }
        ],
        commit: {
          diffSummary: 'Mounted 3-Tier Vertical Tree with Server Connection: ON, UI Interface: Connected (Green)',
          mutationsCount: 1
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
