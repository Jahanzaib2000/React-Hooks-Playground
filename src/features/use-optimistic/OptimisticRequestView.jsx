import { ToggleSwitch } from '../../shared/primitives';

export function OptimisticRequestView({
  isServerOn,
  onToggleServer,
  isPending,
  displayColor,
  isWhite,
  onChameleonClick,
  confirmedColor,
  statusBanner
}) {
  return (
<>
      <div className="demo-display-box" style={{ maxWidth: '100%', width: '100%' }}>
        {/* Server Toggle Switch */}
        <div className="server-toggle-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
          <label className="switch-label" style={{ margin: 0 }}>
            <span className="switch-text">Server:</span>
            <ToggleSwitch
              id="server-toggle-input"
              checked={isServerOn}
              onChange={onToggleServer}
            />
            <span className={`server-status-pill ${isServerOn ? 'online' : 'offline'}`}>
              {isServerOn ? 'ONLINE' : 'OFFLINE'}
            </span>
          </label>

          <span style={{ fontSize: 11, color: 'var(--salt-dim)', fontFamily: 'var(--font-mono)' }}>
            {isServerOn ? '3s success ➔ commits Cyan' : '3s failure ➔ reverts to White'}
          </span>
        </div>

        {/* The Button (White ➔ Cyan) */}
        <div className="chameleon-arena" style={{ padding: '20px 0' }}>
          <button
            type="button"
            className={`chameleon-btn ${isPending ? 'pending' : ''}`}
            style={{
              backgroundColor: displayColor,
              color: '#0a0b0e',
              boxShadow: isWhite
                ? '0 4px 16px rgba(255, 255, 255, 0.25)'
                : '0 4px 20px rgba(6, 182, 212, 0.45)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              padding: '18px 32px',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '-0.2px'
            }}
            data-optimistic-color={displayColor}
            onClick={onChameleonClick}
          >
            <div className="chameleon-btn-inner">
              <span style={{ fontSize: 16, fontWeight: 700 }}>Button</span>
            </div>
            {isPending && <span className="chameleon-ring-pulse" />}
          </button>
        </div>

        {/* Hidden marker for live DOM inspector */}
        <span
          className="confirmed-color-indicator"
          data-confirmed-color={confirmedColor}
          style={{ display: 'none' }}
        />

        {/* Status Notification */}
        {statusBanner && (
          <div className={`status-notification-pill ${statusBanner.type}`} style={{ justifyContent: 'center' }}>
            {statusBanner.message}
          </div>
        )}
      </div>
    </>
  );
}
