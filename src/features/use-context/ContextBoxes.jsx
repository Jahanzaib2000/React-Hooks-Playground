import { ThemePill } from '../../shared/primitives';

export function ContextBox1Root({
  theme,
  isDrilling,
  isAnimating,
  onStartPropDrill
}) {
  return (
    <div
      className={`context-box-item box-1-root theme-${theme} ${isDrilling ? 'box-relaying' : ''}`}
      id="context-box-1"
    >
      <div className="context-box-header">
        <div className="context-box-title-row">
          <h4 className="context-box-name">Box 1</h4>
        </div>
        <ThemePill theme={theme} id="box-1-theme-pill" />
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">
          Holds context of Light and Dark theme in React state.
        </p>
        <div className="box-control-row">
          <button
            type="button"
            className="prop-drill-btn"
            id="btn-drill-props"
            disabled={isAnimating}
            onClick={onStartPropDrill}
          >
            Switch Theme
          </button>
        </div>
      </div>

      <div className="context-box-socket socket-bottom" title="Wire to Box 2" />
      <div className="context-box-socket socket-right" title="Direct Context Link" />
    </div>
  );
}

export function ContextBoxChild({
  boxNumber,
  textData,
  theme,
  isReceiving
}) {
  return (
    <div
      className={`context-box-item box-${boxNumber}-child theme-${theme} ${isReceiving ? 'box-pulse-receive' : ''}`}
      id={`context-box-${boxNumber}`}
    >
      <div className="context-box-socket socket-top" title={`Input Wire from Box ${boxNumber - 1}`} />

      <div className="context-box-header">
        <div className="context-box-title-row">
          <h4 className="context-box-name">Box {boxNumber}</h4>
        </div>
        <ThemePill theme={theme} id={`box-${boxNumber}-theme-pill`} />
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">{textData}</p>
      </div>

      {boxNumber < 4 && (
        <div className="context-box-socket socket-bottom" title={`Wire to Box ${boxNumber + 1}`} />
      )}
      <div className="context-box-socket socket-right" title="Direct Context Link" />
    </div>
  );
}

export function SideContextBox({
  _currentTheme,
  isAnimating,
  isBroadcasting,
  onStartContextSwitch
}) {
  return (
    <div
      className={`side-context-hub ${isBroadcasting ? 'hub-broadcasting' : ''}`}
      id="side-usecontext-box"
    >
      <div className="hub-header">
        <div className="hub-badge-row">
          <span className="hub-icon">⚡</span>
          <span className="hub-chip">useContext Hook</span>
        </div>
        <h3 className="hub-title">ThemeContext Hub</h3>
      </div>

      <div className="hub-body">
        <p className="hub-desc">
          Directly connects consumers to the Provider. Bypasses intermediate layers without prop drilling!
        </p>

        <div className="hub-action-wrap">
          <button
            type="button"
            className="context-switch-btn"
            id="btn-context-switch"
            disabled={isAnimating}
            onClick={onStartContextSwitch}
          >
            Switch Theme
          </button>
        </div>
      </div>

      <div className="hub-emitter emitter-1" title="Direct Beam to Box 1" />
      <div className="hub-emitter emitter-2" title="Direct Beam to Box 2" />
      <div className="hub-emitter emitter-3" title="Direct Beam to Box 3" />
      <div className="hub-emitter emitter-4" title="Direct Beam to Box 4" />
    </div>
  );
}
