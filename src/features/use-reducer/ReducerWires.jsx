

export function TrashZone({ animPhase, trashBoxRef, isExiting }) {
  const isIncinerating = animPhase === 'in-trash';
  return (
    <div className={`trash-drop-zone ${isExiting ? 'trash-drop-zone-exit' : ''}`} id="trash-zone">
      <div className="trash-wire-vertical">
        <svg className="trash-wire-svg" viewBox="0 0 24 28" preserveAspectRatio="none">
          <line x1="12" y1="0" x2="12" y2="20" className="trash-wire-base" />
          <line x1="12" y1="0" x2="12" y2="20" className="trash-wire-flow" />
          <polygon points="7,18 12,26 17,18" className="trash-arrowhead" />
        </svg>
      </div>
      <div
        className={`trash-box-card ${isIncinerating ? 'trash-incinerating' : ''}`}
        id="trash-box-target"
        ref={trashBoxRef}
      >
        <div className="trash-socket-top" />
        <div className="trash-header">
          <span className="trash-icon">🗑️</span>
          <span className="trash-title">Trash Bin</span>
        </div>
        <div className="trash-status-badge">
          {isIncinerating ? '💥 Vaporized' : 'REMOVE_ITEM'}
        </div>
      </div>
    </div>
  );
}

export function WireLane({ laneNumber, isActive, isRemoving }) {
  return (
    <div
      className={`cart-wire-lane wire-lane-${laneNumber} ${isActive ? 'wire-active' : ''} ${
        isRemoving ? 'wire-removing' : ''
      }`}
      id={`wire-${laneNumber}`}
    >
      <svg className="wire-svg" viewBox="0 0 50 24" preserveAspectRatio="none">
        <line x1="0" y1="12" x2="42" y2="12" className="wire-line-base" />
        <line x1="0" y1="12" x2="42" y2="12" className="wire-line-flow" />
        <polygon points="40,7 50,12 40,17" className="wire-arrowhead" />
      </svg>
    </div>
  );
}
