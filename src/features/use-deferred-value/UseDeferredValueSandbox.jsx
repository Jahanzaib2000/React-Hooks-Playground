import { createInitialFactors } from './helpers.js';
import { DEFERRED_COUNTDOWN_SECONDS, DEFERRED_COUNTDOWN_STEP_SECONDS, SYNC_SIMULATION_MS, DEFERRED_TIMING_MS } from '../../constants/use-deferred-value.js';

import { memo, useState, useEffect, useRef, useDeferredValue } from 'react';
import { SandboxContainer } from '../../shared/components';
import {
  generateRandomFactors,
  buildDeferredClickInfo
} from './helpers.js';

const MemoizedCalculationCard = memo(function MemoizedCalculationCard({ factors, isStale }) {
  const product = factors.a * factors.b;
  return (
    <div className={`deferred-result-card ${isStale ? 'is-stale' : 'is-synced'}`}>
      <div className="deferred-result-header">
        <span className="deferred-card-label">Deferred Computation Result:</span>
        <span className={`server-status-pill ${isStale ? 'offline' : 'online'}`} style={{ fontSize: 11 }}>
          {isStale ? '⏳ Computing' : '✓ Synced'}
        </span>
      </div>

      <div className="deferred-formula-row">
        <span className="deferred-factors-text">{factors.a} × {factors.b} =</span>
        <span className="deferred-product-val">{product.toLocaleString()}</span>
      </div>

      <div className="deferred-card-footer">
        <span style={{ fontSize: 11, color: isStale ? '#fbbf24' : 'var(--salt-dim)' }}>
          {isStale
            ? 'UI is responsive! Showing previous calculation until background compute completes...'
            : 'Computation up-to-date with deferred value.'}
        </span>
      </div>
    </div>
  );
});

function UseDeferredValueInnerSandbox({
  _selectedTokenId,
  factors,
  deferredFactors,
  isComputing,
  countdown,
  onCalculate
}) {
  const isStale = factors.id !== deferredFactors.id || isComputing;

  return (
    <div
      className="deferred-sandbox-root"
      data-urgent-a={factors.a}
      data-urgent-b={factors.b}
      data-deferred-a={deferredFactors.a}
      data-deferred-b={deferredFactors.b}
      data-stale={isStale ? 'true' : 'false'}
      data-countdown={countdown}
    >
      <div className="demo-display-box" style={{ maxWidth: '100%', width: '100%' }}>
        <MemoizedCalculationCard
          factors={deferredFactors}
          isStale={isStale}
        />
      </div>

      {/* Primary Action Button */}
      <div className="demo-btn-group" style={{ marginTop: 14 }}>
        <button
          type="button"
          className="salt-btn"
          style={{ width: '100%', padding: '14px 20px', fontSize: 15, fontWeight: 700 }}
          onClick={onCalculate}
        >
          🎲 Calculate Random Multiplication (3s Delay)
        </button>
      </div>
    </div>
  );
}

// ==========================================
// useTransition Sandbox: 3 Buttons & Toggle
// ==========================================

export function UseDeferredValueSandbox({
  _activeLessonId,
  selectedTokenId,
  onRecordRender,
  onRecordTrace,
  _onRecordMutation,
  onReset
}) {
  const [renderCount, setRenderCount] = useState(1);
  const [factors, setFactors] = useState(createInitialFactors);
  const _deferredFactors = useDeferredValue(factors);
  const [committedDeferredFactors, setCommittedDeferredFactors] = useState(createInitialFactors);
  const [isDeferredComputing, setIsDeferredComputing] = useState(false);
  const [deferredCountdown, setDeferredCountdown] = useState(0);
  const deferredTimerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isDeferredComputing && deferredCountdown > 0) {
      interval = setInterval(() => {
        setDeferredCountdown((prev) => {
          if (prev <= DEFERRED_COUNTDOWN_STEP_SECONDS) {
            clearInterval(interval);
            return 0;
          }
          return parseFloat((prev - DEFERRED_COUNTDOWN_STEP_SECONDS).toFixed(1));
        });
      }, DEFERRED_TIMING_MS.countdownTick);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDeferredComputing, deferredCountdown]);

    const handleDeferredCalculate = () => {
    const nextFactors = generateRandomFactors();
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const isSync = selectedTokenId === 'blocking-sync';
    const isNakedTimeout = selectedTokenId === 'naked-timeout';

    onRecordTrace({
      trigger: { label: 'Click: Calculate Multiplication', type: 'Deferred Calculation' },
      componentName: 'DeferredMultiplierDemo',
      renderNumber: nextRender,
      hooks: [
        { slot: 0, name: 'useState', status: `factors: { a: ${nextFactors.a}, b: ${nextFactors.b} }` },
        {
          slot: 1,
          name: isSync ? 'useState' : 'useDeferredValue',
          status: isSync
            ? 'Synchronous state (blocking)'
            : `deferredFactors: { a: ${committedDeferredFactors.a}, b: ${committedDeferredFactors.b} } (stale)`
        }
      ],
      commit: {
        diffSummary: isSync
          ? `Synchronous freeze for 3000ms: ${nextFactors.a} × ${nextFactors.b}`
          : `Urgent update: ${nextFactors.a} × ${nextFactors.b}; deferred calculation queued for 3s`,
        mutationsCount: 1
      },
      effects: null,
      deferredInfo: buildDeferredClickInfo({
        urgentFactors: nextFactors,
        deferredFactors: committedDeferredFactors,
        isStale: true,
        isComputing: true,
        strategy: selectedTokenId
      })
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: `Urgent: ${nextFactors.a} × ${nextFactors.b}`,
      prevState: { factors },
      currentState: { factors: nextFactors, deferred: committedDeferredFactors, isStale: true },
      deferredInfo: buildDeferredClickInfo({
        urgentFactors: nextFactors,
        deferredFactors: committedDeferredFactors,
        isStale: true,
        isComputing: true,
        strategy: selectedTokenId
      })
    });

    if (isSync) {
      // Synchronous thread blocking simulation
      const start = Date.now();
      while (Date.now() - start < SYNC_SIMULATION_MS) { /* sync simulated heavy work */ }
      setFactors(nextFactors);
      setCommittedDeferredFactors(nextFactors);
      return;
    }

    if (isNakedTimeout) {
      if (deferredTimerRef.current) clearTimeout(deferredTimerRef.current);
      setIsDeferredComputing(true);
      setDeferredCountdown(DEFERRED_COUNTDOWN_SECONDS);
      deferredTimerRef.current = setTimeout(() => {
        setFactors(nextFactors);
        setCommittedDeferredFactors(nextFactors);
        setIsDeferredComputing(false);
        setDeferredCountdown(0);
      }, DEFERRED_TIMING_MS.computation);
      return;
    }

    // Idiomatic useDeferredValue:
    // 1. Urgent state updates immediately with 0ms latency!
    setFactors(nextFactors);
    setIsDeferredComputing(true);
    setDeferredCountdown(DEFERRED_COUNTDOWN_SECONDS);

    window.dispatchEvent(new CustomEvent('deferred-lifecycle-event', {
      detail: { type: 'start', urgentFactors: nextFactors }
    }));

    if (deferredTimerRef.current) clearTimeout(deferredTimerRef.current);
    deferredTimerRef.current = setTimeout(() => {
      setCommittedDeferredFactors(nextFactors);
      setIsDeferredComputing(false);
      setDeferredCountdown(0);

      window.dispatchEvent(new CustomEvent('deferred-lifecycle-event', {
        detail: { type: 'commit', deferredFactors: nextFactors }
      }));
    }, DEFERRED_TIMING_MS.computation);
  };

  // ==========================================
  // useTransition Handlers

  const handleReset = () => {
    setFactors(createInitialFactors());
    setCommittedDeferredFactors(createInitialFactors());
    setIsDeferredComputing(false);
    setDeferredCountdown(0);
    if (deferredTimerRef.current) clearTimeout(deferredTimerRef.current);
    if (onReset) onReset();
  };

  return (
    <SandboxContainer hookName="useDeferredValue" onReset={handleReset}>
      <UseDeferredValueInnerSandbox
        selectedTokenId={selectedTokenId}
        factors={factors}
        deferredFactors={committedDeferredFactors}
        isComputing={isDeferredComputing}
        countdown={deferredCountdown}
        onCalculate={handleDeferredCalculate}
      />
    </SandboxContainer>
  );
}
