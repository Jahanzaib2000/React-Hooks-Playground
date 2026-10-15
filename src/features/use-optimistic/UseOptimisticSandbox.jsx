import { OptimisticSandboxView } from './OptimisticSandboxView.jsx';
import { COLOR_WHITE, COLOR_CYAN, SERVER_DELAY_MS, OPTIMISTIC_COUNTDOWN_SECONDS } from '../../constants/use-optimistic.js';
import { useState, useOptimistic, startTransition } from 'react';
import {
  simulateServerDelay,
  buildOptimisticClickInfo
} from './helpers.js';

export function UseOptimisticSandbox({
  _activeLessonId,
  selectedTokenId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [renderCount, setRenderCount] = useState(1);
  const [confirmedColor, setConfirmedColor] = useState(COLOR_WHITE.hex);
  const [optimisticColor, setOptimisticColor] = useOptimistic(
    confirmedColor,
    (current, next) => next
  );
  const [sluggishColor, setSluggishColor] = useState(COLOR_WHITE.hex);
  const [isServerOn, setIsServerOn] = useState(true);
  const [isOptimisticPending, setIsOptimisticPending] = useState(false);
  const [optimisticCountdown, setOptimisticCountdown] = useState(0);
  const [optimisticStatusBanner, setOptimisticStatusBanner] = useState(null);

    const handleServerToggle = () => {
    setIsServerOn((prev) => !prev);
  };

  const handleChameleonClick = () => {
    const isSluggish = selectedTokenId === 'traditional-sluggish';
    const isDesync = selectedTokenId === 'premature-mutation';

    const currentColor = isSluggish ? sluggishColor : optimisticColor;
    const isCurrentWhite = currentColor.toLowerCase() === COLOR_WHITE.hex;
    const nextColorHex = isCurrentWhite ? COLOR_CYAN.hex : COLOR_WHITE.hex;
    const nextColorName = isCurrentWhite ? 'Cyan' : 'White';
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    setIsOptimisticPending(true);
    setOptimisticCountdown(OPTIMISTIC_COUNTDOWN_SECONDS);
    setOptimisticStatusBanner({
      type: 'pending',
      message: isSluggish
        ? '⏳ Waiting 3.0s for server before updating UI...'
        : `⚡ Optimistic: UI changed to ${nextColorName} (0ms)! Server in-flight...`
    });

    onRecordMutation({
      type: 'attributes',
      targetSelector: 'button.chameleon-btn',
      oldValue: `background: ${currentColor}`,
      newValue: isSluggish ? `background: ${currentColor} (Waiting)` : `background: ${nextColorHex} (Optimistic preview)`,
      timestamp: Date.now()
    });

    onRecordTrace({
      trigger: { label: `Click: "${nextColorName}"`, type: 'Optimistic Action' },
      componentName: 'ColorButton',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useState',
          status: `confirmedColor: "${confirmedColor}"`,
          prevState: confirmedColor,
          actionLabel: isDesync ? `setConfirmedColor("${nextColorHex}")` : 'Base unchanged until server resolves',
          nextState: isDesync ? nextColorHex : confirmedColor,
          bailedOut: !isDesync
        },
        {
          slot: 1,
          name: isSluggish || isDesync ? 'useState' : 'useOptimistic',
          status: isSluggish
            ? 'Delayed until 3s response'
            : isDesync
            ? 'Prematurely mutated (Desync Risk)'
            : `optimisticColor: "${nextColorHex}" (Instant)`,
          prevState: currentColor,
          actionLabel: isSluggish
            ? 'No optimistic setter called'
            : `setOptimisticColor("${nextColorHex}")`,
          nextState: isSluggish ? currentColor : nextColorHex,
          bailedOut: false
        }
      ],
      commit: {
        diffSummary: isSluggish
          ? 'Button waiting for network'
          : `Button changed to ${nextColorName} (${nextColorHex}) instantly`,
        mutationsCount: 1
      },
      effects: null,
      optimisticInfo: buildOptimisticClickInfo({
        confirmedColorHex: confirmedColor,
        optimisticColorHex: isSluggish ? currentColor : nextColorHex,
        nextColorHex: nextColorHex,
        isServerOn,
        isPending: true,
        strategy: selectedTokenId
      })
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: `Optimistic: ${nextColorName}`,
      prevState: { color: currentColor },
      currentState: { color: isSluggish ? currentColor : nextColorHex, isOptimistic: !isSluggish },
      optimisticInfo: buildOptimisticClickInfo({
        confirmedColorHex: confirmedColor,
        optimisticColorHex: isSluggish ? currentColor : nextColorHex,
        nextColorHex: nextColorHex,
        isServerOn,
        isPending: true,
        strategy: selectedTokenId
      })
    });

    // Case 1: Traditional Sluggish (useState without optimism)
    if (isSluggish) {
      simulateServerDelay(SERVER_DELAY_MS, isServerOn)
        .then(() => {
          setSluggishColor(nextColorHex);
          setConfirmedColor(nextColorHex);
          setOptimisticStatusBanner({
            type: 'success',
            message: `✓ 200 OK: Color changed to ${nextColorName} after 3s.`
          });
        })
        .catch(() => {
          setOptimisticStatusBanner({
            type: 'error',
            message: '⚠️ 500 Offline: Server rejected. Button stayed unchanged.'
          });
        })
        .finally(() => {
          setIsOptimisticPending(false);
          setOptimisticCountdown(0);
        });
      return;
    }

    // Case 2: Premature mutation without rollback (Desync bug)
    if (isDesync) {
      setConfirmedColor(nextColorHex);
      simulateServerDelay(SERVER_DELAY_MS, isServerOn)
        .then(() => {
          setOptimisticStatusBanner({
            type: 'success',
            message: '✓ 200 OK: Succeeded.'
          });
        })
        .catch(() => {
          setOptimisticStatusBanner({
            type: 'error',
            message: '⚠️ 500 Offline: Server rejected, but useState has no auto-rollback!'
          });
        })
        .finally(() => {
          setIsOptimisticPending(false);
          setOptimisticCountdown(0);
        });
      return;
    }

    // Case 3: Native useOptimistic + startTransition (Idiomatic React 19)
    window.dispatchEvent(new CustomEvent('optimistic-lifecycle-event', {
      detail: { type: 'start', optimisticColor: nextColorHex }
    }));

    startTransition(async () => {
      // 1. Instantly set optimistic state in React 19
      setOptimisticColor(nextColorHex);

      // 2. Perform 3-second server simulation
      try {
        await simulateServerDelay(SERVER_DELAY_MS, isServerOn);
        // Server ON: Commit to base state
        setConfirmedColor(nextColorHex);
        setIsOptimisticPending(false);
        setOptimisticCountdown(0);
        setOptimisticStatusBanner({
          type: 'success',
          message: `✓ 200 OK: Server confirmed! Persisted ${nextColorName}.`
        });
        window.dispatchEvent(new CustomEvent('optimistic-lifecycle-event', {
          detail: { type: 'commit', confirmedColor: nextColorHex }
        }));
      } catch {
        // Server OFF: Do NOT update confirmed state!
        // When this transition ends, React automatically discards the optimistic overlay!
        setIsOptimisticPending(false);
        setOptimisticCountdown(0);
        setOptimisticStatusBanner({
          type: 'error',
          message: `🔄 500 Offline: Server rejected! React auto-reverted to ${confirmedColor.toLowerCase() === COLOR_WHITE.hex ? 'White' : 'Cyan'}!`
        });
        window.dispatchEvent(new CustomEvent('optimistic-lifecycle-event', {
          detail: { type: 'rollback', confirmedColor }
        }));
      }
    });
  };

  // ==========================================
  // useDeferredValue Handler

  const handleReset = () => {
    setConfirmedColor(COLOR_WHITE.hex);
    setSluggishColor(COLOR_WHITE.hex);
    setIsServerOn(true);
    setIsOptimisticPending(false);
    setOptimisticCountdown(0);
    setOptimisticStatusBanner(null);
    if (onReset) onReset();
  };

  return (
    <OptimisticSandboxView
      handleReset={handleReset}
      selectedTokenId={selectedTokenId}
      confirmedColor={confirmedColor}
      sluggishColor={sluggishColor}
      optimisticColor={optimisticColor}
      isServerOn={isServerOn}
      isOptimisticPending={isOptimisticPending}
      optimisticCountdown={optimisticCountdown}
      optimisticStatusBanner={optimisticStatusBanner}
      handleServerToggle={handleServerToggle}
      handleChameleonClick={handleChameleonClick}
    />
  );
}
