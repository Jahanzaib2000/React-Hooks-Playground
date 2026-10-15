

export function recordEffectRun({
  onRecordRender,
  onRecordMutation,
  onRecordTrace,
  nextRender,
  isConnected,
  theme,
  roomId,
  serverUrl
}) {
  if (onRecordRender) {
    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Executed useEffect (All dependency lights activated)',
      prevState: { isConnected, theme, roomId, serverUrl },
      currentState: { isConnected, theme, roomId, serverUrl }
    });
  }

  if (onRecordMutation) {
    onRecordMutation({
      type: 'Effect Synchronization',
      target: '<ChatRoom />',
      summary: `useEffect re-synchronized dependencies: [roomId, serverUrl${isConnected ? '' : ', theme'}] (All lights illuminated for 3s)`
    });
  }

  if (onRecordTrace) {
    onRecordTrace({
      trigger: { label: 'useEffect Re-synchronization', type: 'Effect Run' },
      componentName: 'ChatRoom',
      renderNumber: nextRender,
      hooks: [
        { slot: 0, name: 'useEffectEvent(onConnected)', status: isConnected ? `Active (reads Theme: "${theme}")` : 'Hidden / Disconnected', actionRequired: false },
        { slot: 1, name: 'useEffect', status: `Synchronized [roomId, serverUrl${isConnected ? '' : ', theme'}]`, actionRequired: false }
      ],
      commit: { diffSummary: `Effect re-synchronized: lights turned ON for all dependencies for 3 seconds`, mutationsCount: 1 },
      effects: null
    });
  }
}

export function recordEffectEvent({ onRecordMutation, onRecordTrace, nextRender, theme }) {
  if (onRecordMutation) {
    onRecordMutation({
      type: 'Non-Reactive Event Call',
      target: 'useEffectEvent(onConnected)',
      summary: `onConnected called: safely read latest Theme ("${theme}") without re-running useEffect (Only Theme light illuminated)`
    });
  }

  if (onRecordTrace) {
    onRecordTrace({
      trigger: { label: 'useEffectEvent(onConnected) Invoked', type: 'Event Trigger' },
      componentName: 'ChatRoom',
      renderNumber: nextRender,
      hooks: [
        { slot: 0, name: 'useEffectEvent(onConnected)', status: `Executed: read Theme "${theme}"`, actionRequired: false },
        { slot: 1, name: 'useEffect', status: 'Dormant (0 re-runs)', actionRequired: false }
      ],
      commit: { diffSummary: `Non-reactive event executed: only Theme light turned ON for 3s (Effect stayed dormant)`, mutationsCount: 0 },
      effects: null
    });
  }
}
