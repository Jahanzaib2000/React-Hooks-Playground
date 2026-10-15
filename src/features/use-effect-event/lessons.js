// useEffectEvent lesson definitions and execution traces
export function getInitialRender() {
  return {
    renderNumber: 1,
    trigger: 'Initial Mount',
    prevState: null,
    currentState: { isConnected: true, theme: 'Dark', roomId: 'general-chat' }
  };
}

export const lessons = [
    {
      id: 'uee-extract-theme',
      title: '01. Extracting Non-Reactive Logic',
      hook: 'useEffectEvent',
      summary: 'useEffectEvent extracts non-reactive state reads out of useEffect so reactive dependencies remain strictly focused on synchronization.',
      theory: {
        signature: 'const onEvent = useEffectEvent(callback)',
        useWhen: 'You need to read fresh state or props inside an effect (e.g. current theme, notification sounds, analytics data) without causing the effect to re-synchronize when those values change.',
        dontUseWhen: 'The logic is truly reactive and the effect synchronization lifecycle genuinely depends on that value (e.g. roomId or userId).',
        classicPitfall: 'Passing useEffectEvent functions as props to children or attempting to add them to dependency arrays.',
        mentalModel: 'An event listener inside your component that always sees fresh state, but acts as a stable non-reactive boundary that never re-triggers an effect.'
      },
      predict: {
        question: 'When the theme changes, should a chat connection effect disconnect and reconnect?',
        options: [
          { id: 'opt-no', label: 'No: theme is non-reactive and should be read via useEffectEvent without reconnecting', correct: true, explain: 'Correct! useEffectEvent lets the effect read the latest theme without having theme in the dependency array.' },
          { id: 'opt-yes', label: 'Yes: every value used in the component must re-run the effect on every change', correct: false, explain: 'Incorrect: Reconnecting a socket just because the user switched themes causes unnecessary disconnects and server churn.' }
        ]
      },
      tokenKey: 'eventExtraction',
      tokenOptions: [
        {
          id: 'standard',
          label: '01. Extracting Non-Reactive Logic',
          preview: 'const onConnected = useEffectEvent(() => ...)',
          isBroken: false,
          hint: 'Extracts non-reactive theme reading from the effect dependencies'
        }
      ],
      codeTemplate: () => `// React: Extracting Non-Reactive Logic with useEffectEvent
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, serverUrl, theme }) {
  // 1. Non-Reactive Event: Always reads fresh theme without triggering re-sync
  const onConnected = useEffectEvent(() => {
    logConnection(\`Connected to \${roomId}\`, theme);
  });

  // 2. Reactive Effect: Re-synchronizes ONLY when roomId or serverUrl changes
  useEffect(() => {
    const socket = createSocket(serverUrl, roomId);

    socket.on('open', () => {
      onConnected(); // Reads latest theme safely
    });

    return () => socket.close();
  }, [roomId, serverUrl]); // Notice: theme is intentionally NOT in dependencies!

  return (
    <div className={\`chat-room theme-\${theme.toLowerCase()}\`}>
      <h3>Room: {roomId}</h3>
      <p>Server: {serverUrl}</p>
    </div>
  );
}`,
      explain: {
        takeaway: 'useEffectEvent separates reactive synchronization from non-reactive event handling, preventing unnecessary effect teardowns and re-executions.',
        myths: [
          'Myth: Every variable read inside an effect callback must always trigger a full re-synchronization.',
          'Myth: useEffectEvent functions can be passed as props to other components.'
        ]
      }
    },
    {
      id: 'uee-uninterrupted-call',
      title: '02. Uninterrupted Call vs Reconnection',
      hook: 'useEffectEvent',
      summary: 'Demonstrates two active calls: changing theme forces the standard effect to disconnect and restart its timer, while the useEffectEvent call remains completely uninterrupted.',
      theory: {
        signature: 'const onConnected = useEffectEvent(callback)',
        useWhen: 'Reading non-reactive UI values (like theme or notifications) without tearing down persistent connections.',
        dontUseWhen: 'A dependency change genuinely requires tearing down and establishing a new connection (e.g. roomId).',
        classicPitfall: 'Including theme in dependencies array, which drops active socket/media connections on cosmetic UI changes.',
        mentalModel: 'useEffect controls connection lifecycle; useEffectEvent handles event callbacks with latest state without restarting the lifecycle.'
      },
      predict: {
        question: 'When the theme changes, what happens to the two calls?',
        options: [
          {
            id: 'opt-reconnect-vs-keep',
            label: 'The call without useEffectEvent disconnects and restarts, while the call with useEffectEvent stays uninterrupted.',
            correct: true,
            explain: 'Correct! Without useEffectEvent, theme is a dependency so the effect cleans up and reconnects. With useEffectEvent, theme is read non-reactively so the call remains alive.'
          },
          {
            id: 'opt-both-reconnect',
            label: 'Both calls must disconnect because theme alters the DOM styling.',
            correct: false,
            explain: 'Incorrect: Theme changes are cosmetic and should not disrupt persistent network connections.'
          }
        ]
      },
      tokenKey: 'connectionArchitecture',
      tokenOptions: [
        {
          id: 'compare',
          label: '02. Uninterrupted Call vs Reconnection',
          preview: 'Standard Effect vs useEffectEvent',
          isBroken: false,
          hint: 'Compare active call timers when changing theme'
        }
      ],
      codeTemplate: () => `// 1. Without useEffectEvent: Drops and restarts connection on theme change
function CallWithout({ roomId, theme }) {
  useEffect(() => {
    const call = connectCall(roomId);
    call.onConnect(() => logStatus(\`Connected: \${roomId}\`, theme));
    return () => call.disconnect(); // Runs on every theme change!
  }, [roomId, theme]); // theme triggers disconnect!
}

// 2. With useEffectEvent: Preserves active connection across theme changes
function CallWith({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    logStatus(\`Connected: \${roomId}\`, theme);
  });

  useEffect(() => {
    const call = connectCall(roomId);
    call.onConnect(() => onConnected()); // Reads fresh theme safely
    return () => call.disconnect(); // Only runs if roomId changes!
  }, [roomId]); // theme is NOT a dependency!
}`,
      splitCodes: {
        left: {
          title: 'Without useEffectEvent',
          badge: 'Drops Connection on Theme Change',
          code: `function ActiveCallWithout({ roomId, theme }) {
  // Theme change triggers full effect teardown:
  useEffect(() => {
    const call = connectCall(roomId);
    call.onConnect(() => {
      notify(\`Active in \${roomId}\`, theme);
    });

    // Cleanup: DROPS call and restarts timer!
    return () => call.disconnect();
  }, [roomId, theme]); // theme in deps!
}`,
          note: 'Vulnerable: Every theme toggle drops the active connection and restarts the timer from zero.'
        },
        right: {
          title: 'With useEffectEvent',
          badge: 'Uninterrupted: Zero Disconnects',
          code: `function ActiveCallWith({ roomId, theme }) {
  // Non-reactive event handler reads latest theme:
  const onConnected = useEffectEvent(() => {
    notify(\`Active in \${roomId}\`, theme);
  });

  // Effect only tracks roomId:
  useEffect(() => {
    const call = connectCall(roomId);
    call.onConnect(() => onConnected());

    return () => call.disconnect();
  }, [roomId]); // theme is NOT in deps!
}`,
          note: 'Robust: Theme updates instantly in event callbacks without interrupting the live call.'
        }
      },
      explain: {
        takeaway: 'useEffectEvent prevents non-reactive visual updates from breaking continuous background connections and resetting stateful timers.',
        myths: [
          'Myth: You must choose between stale state or reconnecting on every change.',
          'Myth: useEffectEvent can be substituted with an empty dependency array.'
        ]
      }
    }
  ];

export function getInitialTrace(lessonId, _tokenId = '') {
  switch (lessonId) {
    case 'uee-extract-theme': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'ChatRoom',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'useEffectEvent(onConnected)',
            status: 'Non-reactive event bridge active',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'Theme: "Dark"'
          },
          {
            slot: 1,
            name: 'useEffect',
            status: 'Synchronized [roomId, serverUrl]',
            actionRequired: false,
            prevState: 'undefined',
            nextState: 'Connected'
          }
        ],
        commit: {
          diffSummary: 'Mounted ChatRoom with non-reactive theme event extracted',
          mutationsCount: 1
        },
        effects: null
      };
    }

    case 'uee-uninterrupted-call': {
      return {
        trigger: { label: 'Initial Mount', type: 'Mount' },
        componentName: 'CallComparison',
        renderNumber: 1,
        hooks: [
          {
            slot: 0,
            name: 'Without useEffectEvent',
            status: 'Deps: [roomId, theme] (Vulnerable to re-sync)',
            actionRequired: false
          },
          {
            slot: 1,
            name: 'With useEffectEvent',
            status: 'Deps: [roomId] (Uninterrupted event reads theme)',
            actionRequired: false
          }
        ],
        commit: {
          diffSummary: 'Initialized dual call comparison sandbox',
          mutationsCount: 2
        },
        effects: null
      };
    }
    default:
      return null;
  }
}
