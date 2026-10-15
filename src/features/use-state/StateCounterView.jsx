import { SandboxContainer } from '../../shared/components';

export function StateCounterView({
  handleReset,
  isRenderFlashing,
  activeLessonId,
  count,
  handleSnapshotClick,
  constPopupError,
  setConstPopupError,
  handleConstIncrementClick,
  textValue,
  handleTextStateChange
}) {
  return (
<SandboxContainer
      hookName="useState"
      onReset={handleReset}
      isRenderFlashing={isRenderFlashing}
    >
      {activeLessonId === 'us-snapshot' && (
        <>
          <div className="demo-display-box">
            <div style={{ fontSize: 12, color: 'var(--salt-dim)' }}>Current Render State:</div>
            <div className="demo-value" id="count-display">
              Count: <span id="count-value">{count}</span>
            </div>
          </div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="salt-btn"
              style={{ flex: '0 0 auto', minWidth: 160 }}
              onClick={handleSnapshotClick}
            >
              +1 Increment
            </button>
          </div>
        </>
      )}

      {activeLessonId === 'us-const-error' && (
        <div className="us-const-wrapper">
          {constPopupError && (
            <div className="us-const-popup-card" role="alert">
              <div className="us-const-popup-header">
                <span className="us-const-popup-badge">TypeError</span>
                <button
                  type="button"
                  className="us-const-popup-close-btn"
                  onClick={() => setConstPopupError(false)}
                  aria-label="Dismiss error notification"
                >
                  ×
                </button>
              </div>
              <div className="us-const-popup-body">
                <p className="us-const-popup-message">
                  State of const variable cannot be changed
                </p>
              </div>
              <div className="us-const-popup-footer">
                <span className="us-const-popup-hint">Auto-dismissing in 3 seconds</span>
              </div>
            </div>
          )}

          <div className="demo-display-box">
            <div style={{ fontSize: 12, color: 'var(--salt-dim)' }}>Declared as Local Constant:</div>
            <div className="demo-value" id="const-count-display">
              Count: <span id="const-count-value">0</span>
            </div>
            <div style={{ fontSize: 11, color: '#a1a1aa', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
              const count = 0;
            </div>
          </div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="salt-btn"
              style={{ flex: '0 0 auto', minWidth: 160 }}
              onClick={handleConstIncrementClick}
            >
              +1 Increment
            </button>
          </div>
        </div>
      )}

      {activeLessonId === 'us-text-state' && (
        <div className="us-text-state-wrapper">
          <div className="demo-display-box us-text-display-box">
            <div style={{ fontSize: 12, color: 'var(--salt-dim)' }}>Current Text State:</div>
            <div className="us-text-preview" id="text-state-display">
              {textValue}
            </div>
          </div>
          <div className="us-text-input-group">
            <label htmlFor="us-text-input-field" className="us-text-input-label">
              Text Input:
            </label>
            <input
              id="us-text-input-field"
              type="text"
              className="us-state-text-input"
              value={textValue}
              onChange={handleTextStateChange}
              placeholder="Type to update state..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      )}
    </SandboxContainer>
  );
}
