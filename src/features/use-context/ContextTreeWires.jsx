

export function TreeRootForkWire({ activeTransfer }) {
  const isLeft = activeTransfer && activeTransfer.from === 1 && activeTransfer.to === 2;
  const isRight = activeTransfer && activeTransfer.from === 1 && activeTransfer.to === 3;

  return (
    <div className="tree-root-fork-lane">
      <svg className="tree-fork-svg" viewBox="0 0 100 36" preserveAspectRatio="none">
        <path d="M 50,0 L 50,14 L 25,36" className="tree-wire-base" />
        <path d="M 50,0 L 50,14 L 75,36" className="tree-wire-base" />
        <path d="M 50,0 L 50,14 L 25,36" className={`tree-wire-flow ${isLeft ? 'flow-pulsing' : ''}`} />
        <path d="M 50,0 L 50,14 L 75,36" className={`tree-wire-flow ${isRight ? 'flow-pulsing' : ''}`} />
      </svg>
      {isLeft && (
        <div className={`tree-fork-packet packet-left packet-${activeTransfer.theme}`}>
          <span className="packet-glyph">{activeTransfer.theme === 'light' ? '☀️' : '🌙'}</span>
          <span className="packet-text">props</span>
        </div>
      )}
      {isRight && (
        <div className={`tree-fork-packet packet-right packet-${activeTransfer.theme}`}>
          <span className="packet-glyph">{activeTransfer.theme === 'light' ? '☀️' : '🌙'}</span>
          <span className="packet-text">props</span>
        </div>
      )}
    </div>
  );
}

export function TreeBranchForkWire({ fromBox, leftChild, rightChild, activeTransfer }) {
  const isLeft = activeTransfer && activeTransfer.from === fromBox && activeTransfer.to === leftChild;
  const isRight = activeTransfer && activeTransfer.from === fromBox && activeTransfer.to === rightChild;

  return (
    <div className="tree-branch-fork-lane">
      <svg className="tree-fork-svg" viewBox="0 0 100 34" preserveAspectRatio="none">
        <path d="M 50,0 L 50,12 L 25,34" className="tree-wire-base" />
        <path d="M 50,0 L 50,12 L 75,34" className="tree-wire-base" />
        <path d="M 50,0 L 50,12 L 25,34" className={`tree-wire-flow ${isLeft ? 'flow-pulsing' : ''}`} />
        <path d="M 50,0 L 50,12 L 75,34" className={`tree-wire-flow ${isRight ? 'flow-pulsing' : ''}`} />
      </svg>
      {isLeft && (
        <div className={`tree-fork-packet packet-left packet-${activeTransfer.theme}`}>
          <span className="packet-glyph">{activeTransfer.theme === 'light' ? '☀️' : '🌙'}</span>
          <span className="packet-text">props</span>
        </div>
      )}
      {isRight && (
        <div className={`tree-fork-packet packet-right packet-${activeTransfer.theme}`}>
          <span className="packet-glyph">{activeTransfer.theme === 'light' ? '☀️' : '🌙'}</span>
          <span className="packet-text">props</span>
        </div>
      )}
    </div>
  );
}

export function TreeBroadcastBanner({ isBroadcasting }) {
  if (!isBroadcasting) return null;
  return (
    <div className="tree-broadcast-flash-banner">
      <span className="flash-icon">⚡</span>
      <span>useContext Teleportation Broadcast: All 7 Components Updated (0s Delay)</span>
    </div>
  );
}
