import { EffectEventCallView } from './EffectEventCallView.jsx';
import { INITIAL_CALL_THEME, EFFECT_EVENT_TIMING_MS } from '../../constants/use-effect-event.js';
import { useState, useEffect, useRef } from 'react';

export function UseEffectEventCallComparisonSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [theme, setTheme] = useState(INITIAL_CALL_THEME);
  const [timerWith, setTimerWith] = useState(0);
  const [timerWithout, setTimerWithout] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [renderCount, setRenderCount] = useState(1);

  const isReconnectingRef = useRef(false);
  const reconnectTimerRef = useRef(null);

  // Timer interval runs continuously from the moment the module is opened
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerWith((prev) => prev + 1);
      if (!isReconnectingRef.current) {
        setTimerWithout((prev) => prev + 1);
      }
    }, EFFECT_EVENT_TIMING_MS.callTick);

    return () => clearInterval(interval);
  }, []);

  // Cleanup any active timer on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const nextRender = renderCount + 1;
    setTheme(nextTheme);
    setRenderCount(nextRender);

    // Call WITH useEffectEvent:
    // Does NOT get interrupted; timer keeps running smoothly.

    // Call WITHOUT useEffectEvent:
    // Theme is in its dependency array! Triggers effect teardown & reconnect for 2 seconds.
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

    isReconnectingRef.current = true;
    setIsReconnecting(true);
    setReconnectCount((prev) => prev + 1);

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: `Toggled Theme to "${nextTheme}"`,
        prevState: { theme },
        currentState: { theme: nextTheme }
      });
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'Theme Change (Cosmetic)',
        target: 'Theme Context',
        summary: `Switched theme to ${nextTheme}. Call WITHOUT useEffectEvent dropped socket and is reconnecting. Call WITH useEffectEvent stayed uninterrupted.`
      });
    }

    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: `Theme changed -> "${nextTheme}"`, type: 'Theme Toggle' },
        componentName: 'CallComparison',
        renderNumber: nextRender,
        hooks: [
          {
            slot: 0,
            name: 'Without useEffectEvent',
            status: 'Disconnected: Reconnecting for 2.0s',
            actionRequired: true
          },
          {
            slot: 1,
            name: 'With useEffectEvent',
            status: 'Uninterrupted: onConnected reads new theme non-reactively',
            actionRequired: false
          }
        ],
        commit: {
          diffSummary: `Theme changed to ${nextTheme}: 1 call dropped & restarting timer; 1 call preserved`,
          mutationsCount: 1
        },
        effects: null
      });
    }

    // 2-second reconnect pop on top
    reconnectTimerRef.current = setTimeout(() => {
      setIsReconnecting(false);
      isReconnectingRef.current = false;
      // Restarts the timer!
      setTimerWithout(0);
    }, EFFECT_EVENT_TIMING_MS.reconnect);
  };

  const handleResetDemo = () => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    isReconnectingRef.current = false;
    setIsReconnecting(false);
    setTheme(INITIAL_CALL_THEME);
    setTimerWith(0);
    setTimerWithout(0);
    setReconnectCount(0);
    setRenderCount(1);
    if (onReset) onReset();
  };

  return (
    <EffectEventCallView
      theme={theme}
      handleToggleTheme={handleToggleTheme}
      handleResetDemo={handleResetDemo}
      isReconnecting={isReconnecting}
      timerWithout={timerWithout}
      reconnectCount={reconnectCount}
      timerWith={timerWith}
    />
  );
}
