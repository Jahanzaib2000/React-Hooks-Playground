import { ToggleSwitch } from '../../shared/primitives';

export function TransitionCalculationView({
  isTransitionOn,
  onToggleTransition,
  isHeavyRunning,
  onHeavyCompute,
  btn1Active,
  isFrozen,
  onToggleBtn1,
  btn2Active,
  onToggleBtn2
}) {
  return (
    <div className="transition-sandbox-panel">
      {/* useTransition Toggle Switch */}
      <div className="transition-toggle-bar">
        <label className="switch-label" style={{ margin: 0 }}>
          <span className="switch-text">useTransition:</span>
          <ToggleSwitch
            id="transition-toggle-input"
            checked={isTransitionOn}
            onChange={onToggleTransition}
          />
          <span className={`server-status-pill ${isTransitionOn ? 'online' : 'offline'}`}>
            {isTransitionOn ? 'ON (Concurrent)' : 'OFF (Blocking)'}
          </span>
        </label>

        <span style={{ fontSize: 11, color: 'var(--salt-dim)', fontFamily: 'var(--font-mono)' }}>
          {isTransitionOn
            ? 'Buttons 1 & 2 stay responsive during 10s'
            : 'Buttons 1 & 2 will freeze for 10s'}
        </span>
      </div>

      {/* Main Buttons Arena */}
      <div className="demo-display-box" style={{ maxWidth: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Heavy Computation Button */}
        <div className="transition-heavy-container">
          <button
            type="button"
            className={`heavy-btn ${isHeavyRunning ? 'is-running' : ''}`}
            style={{
              backgroundColor: isHeavyRunning ? '#06b6d4' : '#ffffff',
              color: '#0a0b0e'
            }}
            onClick={onHeavyCompute}
          >
            Heavy Computation
          </button>
        </div>

        {/* Button 1 & Button 2 */}
        <div className="secondary-buttons-row">
          <button
            type="button"
            className={`test-btn ${btn1Active ? 'active-lightblue' : ''} ${isFrozen ? 'is-frozen' : ''}`}
            onClick={isFrozen ? undefined : onToggleBtn1}
            disabled={isFrozen}
            style={{
              backgroundColor: btn1Active ? '#38bdf8' : '#ffffff',
              color: '#0a0b0e',
              opacity: 1
            }}
          >
            <span>Button 1</span>
          </button>

          <button
            type="button"
            className={`test-btn ${btn2Active ? 'active-lightblue' : ''} ${isFrozen ? 'is-frozen' : ''}`}
            onClick={isFrozen ? undefined : onToggleBtn2}
            disabled={isFrozen}
            style={{
              backgroundColor: btn2Active ? '#38bdf8' : '#ffffff',
              color: '#0a0b0e',
              opacity: 1
            }}
          >
            <span>Button 2</span>
          </button>
        </div>

        {isFrozen && (
          <div style={{ textAlign: 'center', fontSize: 12, color: '#f87171', fontWeight: 600 }}>
            Heavy computation takes Priority
          </div>
        )}
      </div>
    </div>
  );
}
