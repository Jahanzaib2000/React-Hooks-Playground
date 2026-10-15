

export function IdWiringView({
  triggerAllHubsPulse,
  focusProof,
  setFocusProof,
  instances,
  pulseState,
  triggerHubPulse,
  hoveredAttr,
  setHoveredAttr,
  handleProofClickLabel
}) {
  return (
    <section className="panel-card id-wiring-inspector-dock">
      <div className="id-wiring-header">
        <div className="id-wiring-title-row">
          <span className="id-wiring-title">
            <span>⚡ Unique ID Dependency &amp; Attribute Wiring</span>
            <span className="panel-badge">Live DOM Hub &amp; Wire Graph</span>
          </span>
          <div className="id-wiring-actions">
            <button
              type="button"
              className="salt-btn"
              style={{ fontSize: 11, padding: '3px 10px' }}
              onClick={triggerAllHubsPulse}
              title="Pulse all ID hubs to show isolated non-overlapping frequencies"
            >
              ⚡ Pulse All Hubs
            </button>
          </div>
        </div>

        <p className="id-wiring-subtitle">
          The <strong>id chip</strong> is the central hub. Colored wires link from the chip to every attribute that depends on it.
          Click any hub to pulse wires in browser execution order, or click a label to test real browser focus movement.
        </p>

        {/* Focus proof announcement banner */}
        {focusProof && (
          <div className={`id-wiring-proof-banner ${focusProof.isCollision ? 'collision' : focusProof.success ? 'success' : 'warning'}`}>
            <span>{focusProof.message}</span>
            <button type="button" className="banner-close" onClick={() => setFocusProof(null)}>✕</button>
          </div>
        )}
      </div>

      <div className="id-wiring-grid">
        {instances.length === 0 ? (
          <div className="id-wiring-empty">
            Loading live DOM attributes from sandbox...
          </div>
        ) : (
          instances.map((inst) => {
            const isPulsing = pulseState?.instanceIdx === inst.idx;
            const currentPulseStep = isPulsing ? pulseState.activeStep : null;
            const totalPlaces = inst.attributes.length;

            return (
              <div
                key={inst.idx}
                className={`id-wire-card ${inst.isFocused ? 'card-has-focus' : ''} ${inst.isCollision ? 'card-collision' : ''}`}
                style={{
                  '--inst-color': inst.theme.color,
                  '--inst-bg': inst.theme.bg,
                  '--inst-border': inst.theme.border
                }}
              >
                {/* Instance Header */}
                <div className="wire-card-header">
                  <div className="wire-card-identity">
                    <span className="wire-theme-badge">
                      <span className="wire-theme-shape">{inst.theme.shape}</span>
                      <span className="wire-theme-letter">{inst.theme.letter}</span>
                    </span>
                    <span className="wire-card-name">{inst.name}</span>
                  </div>

                  <div className="wire-card-badges">
                    {inst.isCollision && (
                      <span className="wire-alert-badge">⚠️ ID Collision</span>
                    )}
                    {inst.isFocused && (
                      <span className="wire-focus-badge">● Input Focused</span>
                    )}
                    <span className="wire-counter-badge">
                      used in {totalPlaces} {totalPlaces === 1 ? 'place' : 'places'}
                    </span>
                  </div>
                </div>

                {/* Central Hub Chip */}
                <div className="wire-hub-section">
                  <div
                    className={`wire-hub-chip ${isPulsing ? 'hub-pulsing' : ''}`}
                    onClick={() => triggerHubPulse(inst.idx)}
                    title="Click hub chip to pulse connected wires in browser execution order"
                  >
                    <span className="hub-pulse-indicator"></span>
                    <span className="hub-shape-icon">{inst.theme.shape}</span>
                    <span className="hub-id-text">{inst.hubId}</span>
                    <span className="hub-pulse-hint">▶ Click to Pulse</span>
                  </div>
                  <div className="wire-hub-caption">
                    Central ID Hub — all {totalPlaces} attributes depend on this identifier
                  </div>
                </div>

                {/* SVG Visual Wires Diagram */}
                <div className="wire-diagram-container">
                  <svg className="wire-svg-canvas" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-${inst.idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={inst.theme.color} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={inst.theme.color} stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    {inst.attributes.map((attr, aIdx) => {
                      const total = inst.attributes.length;
                      // Calculate target X position percentage (evenly distributed)
                      const targetX = total === 1 ? 50 : 12 + (aIdx * (76 / (total - 1)));
                      const isWireActive = isPulsing && currentPulseStep === attr.browserOrder;
                      const isWireHovered = hoveredAttr?.instanceIdx === inst.idx && hoveredAttr?.attrKey === attr.key;

                      return (
                        <g key={attr.key}>
                          {/* Smooth cubic bezier curve from hub (50, 0) to attribute slot (targetX, 40) */}
                          <path
                            d={`M 50 0 C 50 20, ${targetX} 20, ${targetX} 40`}
                            fill="none"
                            stroke={isWireActive ? '#ffffff' : inst.theme.color}
                            strokeWidth={isWireActive ? 3.5 : (isWireHovered ? 2.5 : 1.8)}
                            strokeDasharray={attr.isBroken ? '3, 3' : 'none'}
                            strokeOpacity={isWireActive ? 1 : (hoveredAttr && !isWireHovered ? 0.3 : 0.75)}
                            className={isWireActive ? 'active-pulse-wire' : ''}
                          />
                          {/* Pulsing signal bead when wire is activated */}
                          {isWireActive && (
                            <circle
                              cx={targetX}
                              cy="36"
                              r="3.5"
                              fill="#ffffff"
                              className="pulse-bead"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Target Attributes Row */}
                <div className="wire-attributes-grid">
                  {inst.attributes.map((attr) => {
                    const isStepPulsing = isPulsing && currentPulseStep === attr.browserOrder;
                    const isWireHovered = hoveredAttr?.instanceIdx === inst.idx && hoveredAttr?.attrKey === attr.key;

                    return (
                      <div
                        key={attr.key}
                        className={`wire-attr-slot ${isStepPulsing ? 'slot-pulsing' : ''} ${isWireHovered ? 'slot-hovered' : ''} ${attr.isBroken ? 'slot-broken' : ''}`}
                        onMouseEnter={() => setHoveredAttr({ instanceIdx: inst.idx, attrKey: attr.key })}
                        onMouseLeave={() => setHoveredAttr(null)}
                        title={`[Step ${attr.browserOrder}]: ${attr.role}`}
                      >
                        <div className="slot-header">
                          <span className="slot-order">#{attr.browserOrder}</span>
                          <span className="slot-tag">{attr.tag.split(' ')[0]}</span>
                          <span className="slot-status-dot" style={{ backgroundColor: attr.isBroken ? '#f87171' : inst.theme.color }}></span>
                        </div>
                        <div className="slot-code">
                          <span className="slot-attr-name">{attr.attrName}=</span>
                          <span className="slot-attr-val">"{attr.value || 'none'}"</span>
                        </div>
                        <div className="slot-desc">{attr.role}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Proof Step Action Button */}
                <div className="wire-card-footer">
                  <button
                    type="button"
                    className="proof-test-btn"
                    onClick={() => handleProofClickLabel(inst.idx)}
                    title="Click label element to prove native htmlFor -> input focus movement"
                  >
                    <span>🎯 Prove Focus Wiring</span>
                    <span className="proof-btn-sub">Click label ➔ input focuses via htmlFor</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
