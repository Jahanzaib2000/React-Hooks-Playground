import { formatCallTime } from './formatCallTime.js';

export function EffectEventCallView({
  theme,
  handleToggleTheme,
  handleResetDemo,
  isReconnecting,
  timerWithout,
  reconnectCount,
  timerWith
}) {
  return (
    <div className="uee-compare-arena">
      {/* Top Action Bar */}
      <div className="uee-compare-top-bar">
        <div className="uee-compare-title-block">
          <span className="uee-compare-title">Live Call Comparison: Theme Change Impact</span>
          <span className="uee-compare-subtitle">
            Toggling theme is cosmetic UI state. Watch how dependency array placement affects the live call.
          </span>
        </div>
        <div className="uee-compare-actions">
          <button
            type="button"
            className={`uee-theme-toggle-btn ${theme === 'light' ? 'is-light-theme' : ''}`}
            onClick={handleToggleTheme}
            title="Click to toggle theme between Light and Dark"
          >
            <span>Change Theme ({theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})</span>
          </button>
          <button
            type="button"
            className="uee-compare-reset-btn"
            onClick={handleResetDemo}
            title="Reset timers and reconnection status"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 2 Identical Calls Grid */}
      <div className="uee-calls-grid">
        {/* Call 1: Without useEffectEvent */}
        <div className={`uee-call-card theme-${theme}`}>
          {/* 2-sec Reconnect Pop on Top */}
          {isReconnecting && (
            <div className="uee-reconnect-pop">
              Reconnecting
            </div>
          )}

          {/* Card Header */}
          <div className="uee-call-header">
            <div className="uee-call-title-wrap">
              <span className="uee-call-heading">Without useEffectEvent</span>
              <span className="uee-call-sub">useEffect(() =&gt; ..., [roomId, theme])</span>
            </div>
            <span className="uee-call-badge badge-vulnerable">Vulnerable</span>
          </div>

          {/* Call Body */}
          <div className="uee-call-body">
            <span className="uee-call-room-pill">Voice Room: #team-standup</span>

            {/* Equalizer Waveform */}
            <div className={`uee-equalizer ${isReconnecting ? 'paused' : 'active'}`}>
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
            </div>

            {/* Timer Display */}
            <div className="uee-timer-display-box">
              <span className="uee-timer-label">Call Duration</span>
              <span className={`uee-timer-digits ${isReconnecting ? 'restarting' : ''}`}>
                {isReconnecting ? '00:00' : formatCallTime(timerWithout)}
              </span>
            </div>

            {/* Call Status Pill */}
            <div className="uee-call-status-pill">
              <span className={`uee-status-indicator-dot ${isReconnecting ? 'reconnecting' : ''}`} />
              <span>
                {isReconnecting ? 'Reconnecting Socket (Teardown)...' : 'Live Call Active'}
              </span>
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="uee-call-footer">
            <span>
              Reconnections:{' '}
              <span className={`uee-call-stat-highlight ${reconnectCount > 0 ? 'stat-bad' : ''}`}>
                {reconnectCount} {reconnectCount > 0 ? '(Restarted)' : ''}
              </span>
            </span>
            <span>
              Theme: <span className="uee-call-stat-highlight">{theme}</span>
            </span>
          </div>
        </div>

        {/* Call 2: With useEffectEvent */}
        <div className={`uee-call-card theme-${theme}`}>
          {/* Card Header */}
          <div className="uee-call-header">
            <div className="uee-call-title-wrap">
              <span className="uee-call-heading">With useEffectEvent</span>
              <span className="uee-call-sub">useEffect(() =&gt; ..., [roomId]) + useEffectEvent</span>
            </div>
            <span className="uee-call-badge badge-resilient">Uninterrupted</span>
          </div>

          {/* Call Body */}
          <div className="uee-call-body">
            <span className="uee-call-room-pill">Voice Room: #team-standup</span>

            {/* Equalizer Waveform */}
            <div className="uee-equalizer active">
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
              <div className="uee-eq-bar" />
            </div>

            {/* Timer Display */}
            <div className="uee-timer-display-box">
              <span className="uee-timer-label">Call Duration</span>
              <span className="uee-timer-digits">
                {formatCallTime(timerWith)}
              </span>
            </div>

            {/* Call Status Pill */}
            <div className="uee-call-status-pill">
              <span className="uee-status-indicator-dot" />
              <span>Live Call Active (Continuous)</span>
            </div>
          </div>

          {/* Footer Metrics */}
          <div className="uee-call-footer">
            <span>
              Reconnections:{' '}
              <span className="uee-call-stat-highlight stat-good">
                0 (Zero Drops)
              </span>
            </span>
            <span>
              Theme: <span className="uee-call-stat-highlight">{theme}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
