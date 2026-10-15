import { useRef, useEffect } from 'react';

function formatStateDisplay(state) {
  if (state === undefined || state === null || state === 'none' || state === 'None') {
    return 'None';
  }
  if (typeof state === 'number' || typeof state === 'string' || typeof state === 'boolean') {
    return String(state);
  }
  if (typeof state === 'object') {
    if ('count' in state && Object.keys(state).length === 1) {
      return `count: ${state.count}`;
    }
    if ('score' in state) {
      return `${state.name || 'user'}: score ${state.score}`;
    }
    return JSON.stringify(state).replace(/"/g, '').replace(/,/g, ', ');
  }
  return String(state);
}

export function TimelineDock({ renderHistory, activeRenderIndex, onSelectRender }) {
  const streamRef = useRef(null);

  // Auto-scroll timeline horizontally when a new render is added
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({
        left: streamRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [renderHistory.length]);

  return (
    <section className="timeline-dock">
      <div className="timeline-header">
        <span className="timeline-title">
          <span>Snapshot Timeline</span>
          <span className="panel-badge">{renderHistory.length} Renders</span>
        </span>
        <span style={{ fontSize: 11, color: 'var(--salt-dim)' }}>
          Scrollable history (click card to inspect)
        </span>
      </div>

      <div className="timeline-stream" ref={streamRef}>
        {renderHistory.map((render, idx) => {
          const isActive = idx === activeRenderIndex;
          const prevState = render.prevState !== undefined ? render.prevState : (idx > 0 ? renderHistory[idx - 1].currentState || renderHistory[idx - 1].stateSnapshot : null);
          const currentState = render.currentState !== undefined ? render.currentState : render.stateSnapshot;
          const uidInfo = render.useIdInfo;
          const optInfo = render.optimisticInfo;
          const defInfo = render.deferredInfo;
          const transInfo = render.transitionInfo;
          const refInfo = render.refInfo;
          const reducerInfo = render.reducerInfo;

          return (
            <div
              key={idx}
              className={`timeline-card ${isActive ? 'active' : ''} ${uidInfo ? 'has-uid' : ''} ${optInfo ? 'has-optimistic' : ''} ${defInfo ? 'has-deferred' : ''} ${transInfo ? 'has-transition' : ''} ${refInfo ? 'has-ref' : ''} ${reducerInfo ? 'has-reducer' : ''}`}
              onClick={() => onSelectRender(idx)}
            >
              <div className="timeline-card-header">
                <span>Render #{render.renderNumber}</span>
                <span className="timeline-trigger-badge" title={render.trigger}>
                  {render.trigger}
                </span>
              </div>

              {uidInfo && uidInfo.mappings && uidInfo.mappings.length > 0 ? (
                <div className="timeline-uid-list">
                  {uidInfo.mappings.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className={`timeline-uid-row-item ${m.isNew ? 'is-new' : ''}`}
                    >
                      <span className="timeline-uid-input-name">{m.inputLabel}</span>
                      <span className="timeline-uid-arrow">-&gt;</span>
                      <span className={`timeline-uid-val ${m.isDuplicate ? 'duplicate' : ''} ${m.isUnstable ? 'unstable' : ''}`}>
                        {m.id}
                      </span>
                      {m.isNew && <span className="m-new-tag">NEW</span>}
                    </div>
                  ))}
                </div>
              ) : optInfo ? (
                <div className="timeline-state-box">
                  <div className="timeline-state-row">
                    <span className="state-label">Confirmed:</span>
                    <span className="state-val" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: optInfo.confirmedColor }} />
                      <span>{optInfo.confirmedColorName || optInfo.confirmedColor}</span>
                    </span>
                  </div>
                  <div className="timeline-state-row">
                    <span className="state-label">Optimistic:</span>
                    <span className="state-val" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: optInfo.diverged ? '#fbbf24' : '#34d399' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: optInfo.optimisticColor }} />
                      <span>{optInfo.optimisticColorName || optInfo.optimisticColor}</span>
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, marginTop: 4, color: 'var(--salt-dim)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                    <span>{optInfo.isServerOn ? '🟢 Online' : '🔴 Offline'}</span>
                    <span style={{ color: optInfo.diverged ? '#fbbf24' : '#a1a1aa' }}>
                      {optInfo.summaryBadge || (optInfo.isPending ? 'In-Flight' : 'Committed')}
                    </span>
                  </div>
                </div>
              ) : defInfo ? (
                <div className="timeline-state-box">
                  <div className="timeline-state-row">
                    <span className="state-label">Urgent Input:</span>
                    <span className="state-val" style={{ color: '#38bdf8', fontSize: 11, fontWeight: 700 }}>
                      {defInfo.urgentFormula}
                    </span>
                  </div>
                  <div className="timeline-state-row">
                    <span className="state-label">Deferred Result:</span>
                    <span className="state-val" style={{ color: defInfo.isStale ? '#fbbf24' : '#34d399', fontSize: 11, fontWeight: 700 }}>
                      = {defInfo.deferredProduct?.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, marginTop: 4, color: 'var(--salt-dim)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                    <span>{defInfo.isStale ? '⏳ Stale Window' : '✓ Synced'}</span>
                    <span style={{ color: defInfo.isStale ? '#fbbf24' : '#a1a1aa' }}>
                      {defInfo.strategy}
                    </span>
                  </div>
                </div>
              ) : transInfo ? (
                <div className="timeline-state-box">
                  <div className="timeline-state-row">
                    <span className="state-label">Heavy Button:</span>
                    <span className="state-val" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: transInfo.heavyColor, border: '1px solid rgba(255,255,255,0.4)' }} />
                      <span style={{ color: transInfo.isHeavyRunning ? '#06b6d4' : '#f1f5f9' }}>
                        {transInfo.isHeavyRunning ? 'Cyan (In-Flight)' : 'White (Idle)'}
                      </span>
                    </span>
                  </div>
                  <div className="timeline-state-row">
                    <span className="state-label">Buttons 1 &amp; 2:</span>
                    <span className="state-val" style={{ fontSize: 11 }}>
                      {transInfo.btn1Active ? 'B1: LightBlue' : 'B1: Off'} | {transInfo.btn2Active ? 'B2: LightBlue' : 'B2: Off'}
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, marginTop: 4, color: 'var(--salt-dim)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                    <span>{transInfo.isTransitionOn ? '🟢 Concurrent' : '🔴 Blocking'}</span>
                    <span style={{ color: transInfo.isHeavyRunning ? '#06b6d4' : '#a1a1aa' }}>
                      {transInfo.action}
                    </span>
                  </div>
                </div>
              ) : refInfo ? (
                <div className="timeline-state-box">
                  <div className="timeline-state-row">
                    <span className="state-label">Box 2 Light:</span>
                    <span className="state-val" style={{ color: refInfo.isBox2On ? '#fbbf24' : '#94a3b8', fontSize: 11, fontWeight: 700 }}>
                      {refInfo.isBox2On ? '💡 ON' : '◯ OFF'}
                    </span>
                  </div>
                  <div className="timeline-state-row">
                    <span className="state-label">Box 3 Light:</span>
                    <span className="state-val" style={{ color: refInfo.isBox3On ? '#fbbf24' : '#94a3b8', fontSize: 11, fontWeight: 700 }}>
                      {refInfo.isBox3On ? '💡 ON' : '◯ OFF'}
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, marginTop: 4, color: 'var(--salt-dim)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                    <span>{refInfo.action}</span>
                    <span style={{ color: '#fbbf24' }}>
                      {refInfo.targetBox ? `Target: Box ${refInfo.targetBox}` : 'useRef'}
                    </span>
                  </div>
                </div>
              ) : reducerInfo ? (
                <div className="timeline-state-box">
                  <div className="timeline-state-row">
                    <span className="state-label">Action:</span>
                    <span className="state-val" style={{ color: 'var(--salt-pure)', fontSize: 11, fontWeight: 700 }}>
                      {reducerInfo.actionType}
                    </span>
                  </div>
                  <div className="timeline-state-row">
                    <span className="state-label">Cart Summary:</span>
                    <span className="state-val" style={{ fontSize: 11 }}>
                      {reducerInfo.totalCount} items (${reducerInfo.totalAmount})
                    </span>
                  </div>
                  <div style={{ fontSize: 9.5, marginTop: 4, color: 'var(--salt-dim)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
                    <span>{reducerInfo.items?.length || 0} unique lines</span>
                    <span style={{ color: '#34d399' }}>
                      {reducerInfo.lastItemName ? reducerInfo.lastItemName : 'useReducer'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="timeline-state-box">
                  <div className="timeline-state-row">
                    <span className="state-label">Prev State</span>
                    <span className="state-val prev-val" title={formatStateDisplay(prevState)}>
                      {formatStateDisplay(prevState)}
                    </span>
                  </div>
                  <div className="timeline-state-row">
                    <span className="state-label">Current State</span>
                    <span className="state-val current-val" title={formatStateDisplay(currentState)}>
                      {formatStateDisplay(currentState)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
