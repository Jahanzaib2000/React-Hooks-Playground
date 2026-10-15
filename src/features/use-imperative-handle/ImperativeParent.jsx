import { FIREWORK_PARTICLE_COUNT } from '../../constants/use-imperative-handle.js';

export function FireworksDisplay({ color }) {
  // Generates 14 radial particles that fly outward and sparkle for 2s
  const particleCount = FIREWORK_PARTICLE_COUNT;
  return (
    <div className={`fireworks-overlay fireworks-${color}`}>
      <div className="fireworks-core" />
      {Array.from({ length: particleCount }).map((_, i) => (
        <span
          key={i}
          className={`firework-spark spark-${color}`}
          style={{
            '--spark-angle': `${(i * 360) / particleCount}deg`,
            '--spark-dist': `${44 + (i % 3) * 18}px`,
            '--spark-delay': `${(i % 4) * 0.04}s`
          }}
        />
      ))}
    </div>
  );
}

export function ImperativeForkWire({ isImperativeOn, onToggleImperative }) {
  return (
    <div className="imperative-wire-lane">
      {/* Central interactive bridge toggle button on the wire */}
      <div className="imperative-toggle-wrapper">
        <button
          type="button"
          className="imperative-toggle-btn"
          id="btn-toggle-imperative-bridge"
          onClick={onToggleImperative}
          title={isImperativeOn ? 'Click to toggle OFF' : 'Click to toggle ON'}
        >
          <span className="bridge-text">useImperativeHandle:</span>
          <span className={`bridge-badge ${isImperativeOn ? 'badge-on' : 'badge-off'}`}>
            {isImperativeOn ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      <svg className="imperative-fork-svg" viewBox="0 0 100 44" preserveAspectRatio="none">
        <path d="M 50,0 L 50,16 L 25,44" className="wire-base" />
        <path d="M 50,0 L 50,16 L 75,44" className="wire-base" />
      </svg>
    </div>
  );
}

export function ParentImperativeBox({
  isGlowing,
  isImperativeOn,
  fireworksActive,
  fireworksColor,
  onGlow,
  onTriggerRedFireworks,
  onTriggerBlueFireworks
}) {
  return (
    <div
      className={`context-box-item imperative-box box-1-parent ${isGlowing ? 'box-glowing' : ''}`}
      id="imperative-box-1"
    >
      {/* Fireworks Particle Burst Animation on Parent */}
      {fireworksActive && <FireworksDisplay color={fireworksColor} />}

      <div className="context-box-header">
        <h4 className="context-box-name">Box 1 (Parent)</h4>
        <span className="theme-pill-badge pill-parent">
          Parent Component
        </span>
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">
          Controls top-level UI and holds imperative refs to children.
        </p>

        <div className="box-control-row">
          <button
            type="button"
            className="imperative-glow-btn"
            id="btn-parent-glow"
            onClick={onGlow}
          >
            Glow
          </button>
        </div>

        {/* Conditional Fireworks Buttons: VISIBLE ONLY WHEN TOGGLE IS ON */}
        {isImperativeOn && (
          <div className="parent-fireworks-section">
            <div className="parent-fireworks-header">
              <span className="parent-fireworks-label">Imperative Child Controls:</span>
            </div>
            <div className="tree-btn-pair">
              <button
                type="button"
                className="firework-btn btn-firework-red"
                id="btn-parent-red-fireworks"
                onClick={onTriggerRedFireworks}
              >
                Red Fireworks
              </button>
              <button
                type="button"
                className="firework-btn btn-firework-blue"
                id="btn-parent-blue-fireworks"
                onClick={onTriggerBlueFireworks}
              >
                Blue Fireworks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
