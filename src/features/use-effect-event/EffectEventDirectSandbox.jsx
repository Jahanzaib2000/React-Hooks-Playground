import { recordEffectRun, recordEffectEvent } from './effectEventTelemetry.js';
import { useTransientLight } from './useTransientLight.js';
import { EffectEventDependencyView } from './EffectEventDependencyView.jsx';
import { ALTERNATE_ROOM_ID, BACKUP_SERVER_URL, INITIAL_EVENT_THEME, INITIAL_ROOM_ID, INITIAL_SERVER_URL, EFFECT_EVENT_TIMING_MS } from '../../constants/use-effect-event.js';
import { useState } from 'react';

export function UseEffectEventDirectSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  _onReset
}) {
  const [isConnected, setIsConnected] = useState(true);
  const [theme, setTheme] = useState(INITIAL_EVENT_THEME);
  const [roomId, setRoomId] = useState(INITIAL_ROOM_ID);
  const [serverUrl, setServerUrl] = useState(INITIAL_SERVER_URL);

  const [renderCount, setRenderCount] = useState(1);
  const [roomLight, flashRoom] = useTransientLight(EFFECT_EVENT_TIMING_MS.light);
  const [serverLight, flashServer] = useTransientLight(EFFECT_EVENT_TIMING_MS.light);
  const [themeLight, flashTheme] = useTransientLight(EFFECT_EVENT_TIMING_MS.light);

  const triggerLight = (target) => {
    if (target === 'room' || target === 'all') flashRoom();
    if (target === 'server' || target === 'all') flashServer();
    if (target === 'theme' || target === 'all') flashTheme();
  };

  // 1. Root useEffect Click: Lights ALL nodes for 3 seconds
  const handleRunEffect = () => {
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);
    triggerLight('all');

    recordEffectRun({ onRecordRender, onRecordMutation, onRecordTrace, nextRender, isConnected, theme, roomId, serverUrl });
  };

  // 2. Click roomId Node ("Id"): Reactive -> Turns ALL 3 lights ON
  const handleClickRoomNode = () => {
    const nextRoom = roomId === INITIAL_ROOM_ID ? ALTERNATE_ROOM_ID : INITIAL_ROOM_ID;
    const nextRender = renderCount + 1;
    setRoomId(nextRoom);
    setRenderCount(nextRender);
    triggerLight('all');

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: `Clicked roomId Node ("${nextRoom}")`,
        prevState: { isConnected, theme, roomId, serverUrl },
        currentState: { isConnected, theme, roomId: nextRoom, serverUrl }
      });
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'Reactive Dependency Click (roomId)',
        target: 'Dependency Node: roomId',
        summary: `Clicked roomId ("${nextRoom}"). As a reactive dependency, it triggered effect re-synchronization and turned ALL 3 lights ON.`
      });
    }

    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: `Clicked roomId Node -> "${nextRoom}"`, type: 'Reactive Trigger' },
        componentName: 'ChatRoom',
        renderNumber: nextRender,
        hooks: [
          { slot: 0, name: 'useEffectEvent(onConnected)', status: isConnected ? `Active (reads Theme: "${theme}")` : 'Hidden', actionRequired: false },
          { slot: 1, name: 'useEffect', status: `Synchronized [roomId: "${nextRoom}", serverUrl]`, actionRequired: false }
        ],
        commit: { diffSummary: `Clicked roomId: reactive dependency turned ALL 3 lights ON for 3 seconds`, mutationsCount: 1 },
        effects: null
      });
    }
  };

  // 3. Click serverUrl Node ("url"): Reactive -> Turns ALL 3 lights ON
  const handleClickServerNode = () => {
    const nextUrl = serverUrl === INITIAL_SERVER_URL ? BACKUP_SERVER_URL : INITIAL_SERVER_URL;
    const nextRender = renderCount + 1;
    setServerUrl(nextUrl);
    setRenderCount(nextRender);
    triggerLight('all');

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: `Clicked serverUrl Node ("${nextUrl}")`,
        prevState: { isConnected, theme, roomId, serverUrl },
        currentState: { isConnected, theme, roomId, serverUrl: nextUrl }
      });
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'Reactive Dependency Click (serverUrl)',
        target: 'Dependency Node: serverUrl',
        summary: `Clicked serverUrl ("${nextUrl}"). As a reactive dependency, it triggered effect re-synchronization and turned ALL 3 lights ON.`
      });
    }

    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: `Clicked serverUrl Node -> "${nextUrl}"`, type: 'Reactive Trigger' },
        componentName: 'ChatRoom',
        renderNumber: nextRender,
        hooks: [
          { slot: 0, name: 'useEffectEvent(onConnected)', status: isConnected ? `Active (reads Theme: "${theme}")` : 'Hidden', actionRequired: false },
          { slot: 1, name: 'useEffect', status: `Synchronized [roomId, serverUrl: "${nextUrl}"]`, actionRequired: false }
        ],
        commit: { diffSummary: `Clicked serverUrl: reactive dependency turned ALL 3 lights ON for 3 seconds`, mutationsCount: 1 },
        effects: null
      });
    }
  };

  // 4. Click Theme Node ("theme"):
  // If useEffectEvent is ON (Connected) -> Turns ONLY Theme light ON (does NOT turn the other 2 on)!
  // If useEffectEvent is OFF (Disconnected) -> Turns ALL 3 lights ON!
  const handleClickThemeNode = () => {
    const nextTheme = theme === 'Dark' ? 'Light' : 'Dark';
    const nextRender = renderCount + 1;
    setTheme(nextTheme);
    setRenderCount(nextRender);

    if (isConnected) {
      // useEffectEvent is ON: turns on ONLY Theme light for 3 seconds!
      triggerLight('theme');

      if (onRecordRender) {
        onRecordRender({
          renderNumber: nextRender,
          trigger: `Clicked Theme Node ("${nextTheme}") with useEffectEvent ON`,
          prevState: { isConnected, theme, roomId, serverUrl },
          currentState: { isConnected, theme: nextTheme, roomId, serverUrl }
        });
      }

      if (onRecordMutation) {
        onRecordMutation({
          type: 'Non-Reactive Theme Click (useEffectEvent ON)',
          target: 'Dependency Node: Theme',
          summary: `Clicked Theme ("${nextTheme}"). Because useEffectEvent is ON, only the Theme light turned ON (did NOT turn the other 2 on).`
        });
      }

      if (onRecordTrace) {
        onRecordTrace({
          trigger: { label: `Clicked Theme Node -> "${nextTheme}" (Non-Reactive)`, type: 'Event Isolation' },
          componentName: 'ChatRoom',
          renderNumber: nextRender,
          hooks: [
            { slot: 0, name: 'useEffectEvent(onConnected)', status: `Active (reads Theme: "${nextTheme}")`, actionRequired: false },
            { slot: 1, name: 'useEffect', status: 'Dormant (0 re-runs)', actionRequired: false }
          ],
          commit: { diffSummary: `useEffectEvent is ON: clicking Theme turned ONLY Theme light ON (did NOT turn the other 2 on)`, mutationsCount: 0 },
          effects: null
        });
      }
    } else {
      // useEffectEvent is OFF: Theme is in dependency array -> turns ALL 3 lights ON!
      triggerLight('all');

      if (onRecordRender) {
        onRecordRender({
          renderNumber: nextRender,
          trigger: `Clicked Theme Node ("${nextTheme}") with useEffectEvent OFF`,
          prevState: { isConnected, theme, roomId, serverUrl },
          currentState: { isConnected, theme: nextTheme, roomId, serverUrl }
        });
      }

      if (onRecordMutation) {
        onRecordMutation({
          type: 'Reactive Dependency Click (Theme in deps)',
          target: 'Dependency Node: Theme',
          summary: `Clicked Theme ("${nextTheme}"). Because useEffectEvent is OFF, Theme is in dependencies and turned ALL 3 lights ON.`
        });
      }

      if (onRecordTrace) {
        onRecordTrace({
          trigger: { label: `Clicked Theme Node -> "${nextTheme}" (Reactive Dep)`, type: 'Reactive Trigger' },
          componentName: 'ChatRoom',
          renderNumber: nextRender,
          hooks: [
            { slot: 0, name: 'useEffectEvent(onConnected)', status: 'Hidden / Disconnected', actionRequired: false },
            { slot: 1, name: 'useEffect', status: `Synchronized [roomId, serverUrl, theme: "${nextTheme}"]`, actionRequired: false }
          ],
          commit: { diffSummary: `useEffectEvent is OFF: Theme is in effect deps, turned ALL 3 lights ON for 3 seconds`, mutationsCount: 1 },
          effects: null
        });
      }
    }
  };

  // 5. useEffectEvent Button Click: Lights ONLY Theme node for 3 seconds
  const handleFireEvent = () => {
    if (!isConnected) return;
    const nextRender = renderCount;
    triggerLight('theme');
    recordEffectEvent({ onRecordMutation, onRecordTrace, nextRender, theme });
  };

  // 6. Toggle Connection Switch
  const handleToggleConnection = (connected) => {
    setIsConnected(connected);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    if (onRecordMutation) {
      onRecordMutation({
        type: 'Architecture Mode Change',
        target: 'useEffectEvent Bridge',
        summary: connected
          ? 'Connected: Theme extracted out of useEffect dependencies via useEffectEvent'
          : 'Disconnected: useEffectEvent hidden; Theme forced into useEffect dependencies array'
      });
    }
  };

  return (
    <EffectEventDependencyView
      isConnected={isConnected}
      handleToggleConnection={handleToggleConnection}
      handleRunEffect={handleRunEffect}
      handleClickRoomNode={handleClickRoomNode}
      roomId={roomId}
      roomLight={roomLight}
      handleClickServerNode={handleClickServerNode}
      serverUrl={serverUrl}
      serverLight={serverLight}
      handleClickThemeNode={handleClickThemeNode}
      theme={theme}
      themeLight={themeLight}
      handleFireEvent={handleFireEvent}
    />
  );
}
