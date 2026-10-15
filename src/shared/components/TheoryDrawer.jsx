
export function TheoryDrawer({ isOpen, onClose, lesson, activeHook }) {
  if (!isOpen) return null;

  const { theory } = lesson;

  return (
    <div className="theory-drawer-backdrop" onClick={onClose}>
      <aside className="theory-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">{activeHook} Mental Model</div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="theory-section">
          <div className="theory-label">Function Signature</div>
          <div className="theory-code-box">{theory.signature}</div>
        </div>

        <div className="theory-section">
          <div className="theory-label">Core Mental Model</div>
          <p className="theory-desc" style={{ color: 'var(--salt-pure)' }}>
            {theory.mentalModel}
          </p>
        </div>

        <div className="theory-section">
          <div className="theory-label">When to Use</div>
          <p className="theory-desc">{theory.useWhen}</p>
        </div>

        <div className="theory-section">
          <div className="theory-label">When NOT to Use</div>
          <p className="theory-desc">{theory.dontUseWhen}</p>
        </div>

        <div className="theory-section">
          <div className="theory-label">Classic Pitfall</div>
          <div className="theory-code-box" style={{ borderColor: 'rgba(255, 100, 100, 0.3)', color: '#fca5a5' }}>
            ⚠️ {theory.classicPitfall}
          </div>
        </div>
      </aside>
    </div>
  );
}
