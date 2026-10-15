import { OptimisticLifecycleView } from './OptimisticLifecycleView.jsx';
import { COLOR_WHITE, COLOR_PALETTE, OPTIMISTIC_TIMING_MS } from '../../constants/use-optimistic.js';
import { useState, useEffect } from 'react';

export function OptimisticLifecycleInspector({
  _activeLessonId,
  selectedTokenId,
  executionTrace
}) {
  const [confirmedColorHex, setConfirmedColorHex] = useState(COLOR_WHITE.hex);
  const [optimisticColorHex, setOptimisticColorHex] = useState(COLOR_WHITE.hex);
  const [isServerOn, setIsServerOn] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recentEvent, setRecentEvent] = useState(null);
  const [telemetry, setTelemetry] = useState({ commits: 0, rollbacks: 0 });

  // Sync with live DOM
  useEffect(() => {
    const updateFromDom = () => {
      const buttonEl = document.querySelector('.chameleon-btn');
      const serverInput = document.querySelector('#server-toggle-input');
      const hudEl = document.querySelector('.optimistic-countdown-hud');
      const confBadge = document.querySelector('.confirmed-color-indicator');

      if (buttonEl) {
        const optColor = buttonEl.getAttribute('data-optimistic-color') || buttonEl.style.backgroundColor;
        if (optColor) setOptimisticColorHex(optColor);
      }
      if (confBadge) {
        const confColor = confBadge.getAttribute('data-confirmed-color');
        if (confColor) setConfirmedColorHex(confColor);
      }
      if (serverInput) {
        setIsServerOn(serverInput.checked);
      }
      if (hudEl) {
        const pendingAttr = hudEl.getAttribute('data-pending') === 'true';
        const remainingAttr = parseFloat(hudEl.getAttribute('data-countdown') || '0');
        setIsPending(pendingAttr);
        setCountdown(remainingAttr);
      }
    };

    updateFromDom();
    const interval = setInterval(updateFromDom, OPTIMISTIC_TIMING_MS.inspectorPoll);
    return () => clearInterval(interval);
  }, []);

  // Sync with custom lifecycle events
  useEffect(() => {
    const handleOptimisticEvent = (e) => {
      const detail = e.detail;
      if (!detail) return;

      if (detail.type === 'start') {
        setIsPending(true);
        setOptimisticColorHex(detail.optimisticColor);
      } else if (detail.type === 'commit') {
        setIsPending(false);
        setConfirmedColorHex(detail.confirmedColor);
        setOptimisticColorHex(detail.confirmedColor);
        setRecentEvent({
          type: 'commit',
          message: '✓ Confirmed (200 OK) — Persisted Cyan to base state'
        });
        setTelemetry((prev) => ({ ...prev, commits: prev.commits + 1 }));
        setTimeout(() => setRecentEvent(null), OPTIMISTIC_TIMING_MS.eventNotice);
      } else if (detail.type === 'rollback') {
        setIsPending(false);
        setOptimisticColorHex(detail.confirmedColor);
        setRecentEvent({
          type: 'rollback',
          message: '🔄 Server Offline (500) — React auto-reverted to White'
        });
        setTelemetry((prev) => ({ ...prev, rollbacks: prev.rollbacks + 1 }));
        setTimeout(() => setRecentEvent(null), OPTIMISTIC_TIMING_MS.eventNotice);
      }
    };

    window.addEventListener('optimistic-lifecycle-event', handleOptimisticEvent);
    return () => window.removeEventListener('optimistic-lifecycle-event', handleOptimisticEvent);
  }, []);

  // Sync with executionTrace
  useEffect(() => {
    if (executionTrace?.optimisticInfo) {
      const info = executionTrace.optimisticInfo;
      queueMicrotask(() => {
        if (info.confirmedColor) setConfirmedColorHex(info.confirmedColor);
        if (info.optimisticColor) setOptimisticColorHex(info.optimisticColor);
        if (info.isServerOn !== undefined) setIsServerOn(info.isServerOn);
      });
    }
  }, [executionTrace]);

  const confirmedObj = COLOR_PALETTE.find(
    (c) => c.hex.toLowerCase() === confirmedColorHex.toLowerCase()
  ) || { name: 'White', hex: confirmedColorHex };

  const optimisticObj = COLOR_PALETTE.find(
    (c) => c.hex.toLowerCase() === optimisticColorHex.toLowerCase()
  ) || { name: 'Cyan', hex: optimisticColorHex };

  const isDiverged = confirmedColorHex.toLowerCase() !== optimisticColorHex.toLowerCase();

  const handleToggleServerRemote = () => {
    const toggleEl = document.querySelector('#server-toggle-input');
    if (toggleEl) {
      toggleEl.click();
    }
  };

  return (
    <OptimisticLifecycleView
      handleToggleServerRemote={handleToggleServerRemote}
      isServerOn={isServerOn}
      recentEvent={recentEvent}
      confirmedColorHex={confirmedColorHex}
      confirmedObj={confirmedObj}
      isDiverged={isDiverged}
      isPending={isPending}
      countdown={countdown}
      optimisticColorHex={optimisticColorHex}
      optimisticObj={optimisticObj}
      selectedTokenId={selectedTokenId}
      telemetry={telemetry}
    />
  );
}
