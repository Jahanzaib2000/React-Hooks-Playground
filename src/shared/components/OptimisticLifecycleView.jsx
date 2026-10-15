

export function OptimisticLifecycleView({
  handleToggleServerRemote,
  isServerOn,
  recentEvent,
  confirmedColorHex,
  confirmedObj,
  isDiverged,
  isPending,
  countdown,
  optimisticColorHex,
  optimisticObj,
  selectedTokenId,
  telemetry
}) {
  return (
    <section className="panel-card optimistic-inspector-dock">
      {/* Header Bar */}
      <div className="id-wiring-header">
        <div className="id-wiring-title-row">
          <span className="id-wiring-title">
            <span>⚡ Optimistic Lifecycle Radar</span>
            <span className="panel-badge">React 19 useOptimistic</span>
          </span>
          <div className="id-wiring-actions">
            <button
              type="button"
              className="salt-btn"
              style={{ fontSize: 11, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={handleToggleServerRemote}
            >
              <span>Server:</span>
              <span style={{ color: isServerOn ? '#34d399' : '#f87171', fontWeight: 700 }}>
                {isServerOn ? 'ONLINE (200)' : 'OFFLINE (500)'}
              </span>
            </button>
          </div>
        </div>

        {recentEvent && (
          <div
            className={`rollback-alert-ribbon ${recentEvent.type}`}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              marginTop: 8,
              fontSize: 12,
              fontWeight: 600,
              background: recentEvent.type === 'commit' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${recentEvent.type === 'commit' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: recentEvent.type === 'commit' ? '#6ee7b7' : '#fca5a5'
            }}
          >
            {recentEvent.message}
          </div>
        )}
      </div>

      {/* Main Dual-Radar Grid */}
      <div className="optimistic-radar-grid" style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
        {/* Confirmed State (useState) */}
        <div
          className="state-swatch-box"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--salt-dim)' }}>
              1. Ground Truth (useState)
            </span>
            <span className="panel-badge" style={{ fontSize: 10, padding: '1px 6px' }}>Base</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: confirmedColorHex,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `0 0 10px ${confirmedColorHex}44`
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--salt-pure)' }}>
                {confirmedObj.name}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--salt-dim)' }}>
                {confirmedColorHex}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Bridge & Countdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 180, textAlign: 'center' }}>
          <div
            className={`divergence-badge ${isDiverged ? 'diverged' : 'synced'}`}
            style={{
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              background: isDiverged ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${isDiverged ? 'rgba(6, 182, 212, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              color: isDiverged ? '#22d3ee' : '#34d399',
              marginBottom: 6
            }}
          >
            {isDiverged ? '⚡ In-Flight (Cyan Preview)' : '✓ Synced'}
          </div>

          {isPending ? (
            <div style={{ width: '100%', maxWidth: 160 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#22d3ee', marginBottom: 4 }}>
                {countdown.toFixed(1)}s remaining
              </div>
              <div style={{ width: '100%', height: 4, background: 'var(--bg-active)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#22d3ee',
                    width: `${Math.max(0, Math.min(100, ((3.0 - countdown) / 3.0) * 100))}%`,
                    transition: 'width 0.1s linear'
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--salt-dim)', fontFamily: 'var(--font-mono)' }}>
              Idle
            </div>
          )}
        </div>

        {/* Optimistic State (useOptimistic) */}
        <div
          className="state-swatch-box"
          style={{
            background: 'var(--bg-elevated)',
            border: `1px solid ${isDiverged ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-medium)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            boxShadow: isDiverged ? '0 0 14px rgba(6, 182, 212, 0.15)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#38bdf8' }}>
              2. Screen (useOptimistic)
            </span>
            <span
              className="panel-badge"
              style={{
                fontSize: 10,
                padding: '1px 6px',
                background: isDiverged ? 'rgba(6, 182, 212, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                color: isDiverged ? '#22d3ee' : '#38bdf8'
              }}
            >
              {isDiverged ? 'Optimistic' : 'Matching'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: optimisticColorHex,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: `0 0 10px ${optimisticColorHex}44`
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--salt-pure)' }}>
                {optimisticObj.name}
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--salt-dim)' }}>
                {optimisticColorHex}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Strip */}
      <div
        className="telemetry-strip"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <span className="metric-pill">
            <span>Latency:</span>
            <span className="metric-val" style={{ color: '#38bdf8' }}>
              {selectedTokenId === 'traditional-sluggish' ? '3000ms' : '0ms'}
            </span>
          </span>
          <span className="metric-pill">
            <span>Server Commits:</span>
            <span className="metric-val" style={{ color: '#34d399' }}>{telemetry.commits}</span>
          </span>
          <span className="metric-pill">
            <span>Auto-Rollbacks:</span>
            <span className="metric-val" style={{ color: '#f87171' }}>{telemetry.rollbacks}</span>
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--salt-dim)' }}>
          React 19 automatically discards the optimistic overlay when the transition ends.
        </div>
      </div>
    </section>
  );
}
