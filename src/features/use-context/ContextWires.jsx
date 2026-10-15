

export function VerticalWire({ stepNumber, isActive, targetTheme }) {
  return (
    <div className={`context-wire-lane ${isActive ? 'wire-active' : ''}`} id={`wire-step-${stepNumber}`}>
      <svg className="context-wire-svg" viewBox="0 0 24 36" preserveAspectRatio="none">
        <line x1="12" y1="0" x2="12" y2="36" className="context-wire-base" />
        <line x1="12" y1="0" x2="12" y2="36" className={`context-wire-flow ${isActive ? 'flow-pulsing' : ''}`} />
      </svg>
      {isActive && (
        <div className={`wire-packet-drop packet-${targetTheme}`}>
          <span className="packet-glyph">{targetTheme === 'light' ? '☀️' : '🌙'}</span>
          <span className="packet-text">props.theme</span>
        </div>
      )}
    </div>
  );
}

export function BroadcastBeamsSvg({ isBroadcasting }) {
  return (
    <svg className={`broadcast-beams-svg ${isBroadcasting ? 'beams-active' : ''}`} viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M 62,12 C 48,12 36,12 28,12" className="broadcast-beam-path beam-1" />
      <path d="M 62,37 C 48,37 36,37 28,37" className="broadcast-beam-path beam-2" />
      <path d="M 62,63 C 48,63 36,63 28,63" className="broadcast-beam-path beam-3" />
      <path d="M 62,88 C 48,88 36,88 28,88" className="broadcast-beam-path beam-4" />
    </svg>
  );
}
