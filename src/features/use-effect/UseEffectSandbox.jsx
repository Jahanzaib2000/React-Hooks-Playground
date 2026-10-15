import { useState, useEffect, useRef } from 'react';
import { SandboxContainer } from '../../shared/components';

export function UseEffectSandbox({
  activeLessonId,
  selectedTokenId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const isCountPerimeter = activeLessonId === 'ue-deps-count' || selectedTokenId === 'with-count' || (!activeLessonId?.includes('empty') && !selectedTokenId?.includes('empty'));
  const depMode = isCountPerimeter ? 'with-count' : 'empty';
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [popup, setPopup] = useState({
    isOpen: true,
    message: 'This pop was called by the useEffect hook on Initial Render',
    triggerReason: 'initial-render',
    renderId: 1
  });
  const [skippedNotice, setSkippedNotice] = useState(null);
  const isFirstRender = useRef(true);

  // Real React useEffect implementation matching specification
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      queueMicrotask(() => {
        setPopup({
          isOpen: true,
          message: 'This pop was called by the useEffect hook on Initial Render',
          triggerReason: 'initial-render',
          renderId: 1
        });
      });
      return;
    }

    // In State 1 ([count]): Effect fires because count changed
    if (depMode === 'with-count') {
      queueMicrotask(() => {
        setSkippedNotice(null);
        setPopup({
          isOpen: true,
          message: `This pop was called by the useEffect hook as a side Effect of count being updated to ${count}`,
          triggerReason: 'count-updated',
          renderId: Date.now()
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depMode === 'with-count' ? [count] : []);

  const handleIncrement = () => {
    const prevCount = count;
    const nextCount = prevCount + 1;
    const nextRender = renderCount + 1;
    setCount(nextCount);
    setRenderCount(nextRender);

    if (depMode === 'empty') {
      setPopup(prev => ({ ...prev, isOpen: false }));
      setSkippedNotice(`Count is to ${nextCount}, but useEffect did NOT fire because perimeter is empty [].`);
    }

    if (onRecordMutation) {
      onRecordMutation({
        type: 'characterData',
        targetSelector: '#effect-count-val',
        oldValue: `${prevCount}`,
        newValue: `${nextCount}`,
        timestamp: Date.now()
      });
    }

    if (onRecordRender) {
      onRecordRender({
        renderNumber: nextRender,
        trigger: 'Click: +1 Increment Count',
        prevState: { count: prevCount },
        currentState: { count: nextCount }
      });
    }

    if (onRecordTrace) {
      const willRun = depMode === 'with-count';
      onRecordTrace({
        trigger: { label: 'Click: +1 Increment Count', type: 'State Update' },
        componentName: 'EffectDemo',
        renderNumber: nextRender,
        hooks: [
          {
            slot: 0,
            name: 'useState',
            status: `count: ${nextCount}`,
            prevState: prevCount,
            actionLabel: `setCount(${nextCount})`,
            nextState: nextCount,
            bailedOut: false
          },
          {
            slot: 1,
            name: 'useEffect',
            status: willRun ? 'Deps: [count] changed -> Executed' : 'Deps: [] unchanged -> Skipped',
            deps: willRun ? [nextCount] : [],
            willRun
          }
        ],
        commit: {
          diffSummary: willRun
            ? `Updated count to ${nextCount}. useEffect executed post-paint.`
            : `Updated count to ${nextCount}. useEffect was skipped ([]).`,
          mutationsCount: 1
        },
        effects: {
          ran: willRun,
          cleanupRan: false,
          description: willRun
            ? `This pop was called by the useEffect hook as a side Effect of count being updated to ${nextCount}`
            : 'Effect skipped: [] perimeter never fires on count change',
          closureValues: { count: willRun ? nextCount : prevCount }
        }
      });
    }
  };

  const handleReset = () => {
    setCount(0);
    setRenderCount(1);
    setSkippedNotice(null);
    isFirstRender.current = true;
    setPopup({
      isOpen: true,
      message: 'This pop was called by the useEffect hook on Initial Render',
      triggerReason: 'initial-render',
      renderId: Date.now()
    });
    if (onReset) onReset();
  };

  const handleClosePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <SandboxContainer
      hookName="useEffect"
      onReset={handleReset}
    >
      <div className="ue-playground-root">
        {/* Perimeter Status Header */}
        <div className="ue-perimeter-header-badge">
          <span className="ue-perimeter-tag">
            Perimeter (Selected in Component Source): <code>{depMode === 'with-count' ? '[count]' : '[]'}</code>
          </span>
          <span className={`ue-status-tag ${depMode === 'with-count' ? 'tag-reactive' : 'tag-mount-only'}`}>
            {depMode === 'with-count' ? 'State 1: Re-runs on count updates' : 'State 2: Initial Render only'}
          </span>
        </div>

        {/* Centered Area */}
        <div className="ue-stage-center">
          {/* 1. Centered Count Display */}
          <div className="ue-counter-display">
            Count: <span className="ue-counter-val" id="effect-count-val">{count}</span>
          </div>

          {/* 2. Pop-up on top of the increment button */}
          {popup.isOpen && (
            <div key={popup.renderId} className="ue-popup-container">
              <div className="ue-popup-card">
                <div className="ue-popup-header">
                  <div className="ue-popup-tag-row">
                    <span className="ue-popup-tag">useEffect</span>
                    <span className="ue-popup-phase">
                      {popup.triggerReason === 'initial-render' ? 'Initial Render' : 'Count Update'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="ue-popup-close-btn"
                    onClick={handleClosePopup}
                    aria-label="Dismiss pop-up"
                  >
                    ✕
                  </button>
                </div>
                <div className="ue-popup-body">
                  <p className="ue-popup-message">{popup.message}</p>
                </div>
                <div className="ue-popup-footer">
                  <span className="ue-popup-status">
                    {popup.triggerReason === 'initial-render'
                      ? 'Fired post-paint on initial render.'
                      : 'Fired post-paint because count was updated.'}
                  </span>
                  <button
                    type="button"
                    className="ue-popup-dismiss-text-btn"
                    onClick={handleClosePopup}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Centered Action Buttons */}
          <div className="ue-actions-row">
            <button
              type="button"
              className="ue-increment-btn"
              id="ue-increment-btn"
              onClick={handleIncrement}
            >
              +1 Increment Count
            </button>
            <button
              type="button"
              className="ue-reset-btn"
              id="ue-reset-btn"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          {skippedNotice && (
            <div className="ue-skipped-notice">
              <span className="ue-skipped-bullet">•</span>
              <span>{skippedNotice}</span>
            </div>
          )}
        </div>
      </div>
    </SandboxContainer>
  );
}
