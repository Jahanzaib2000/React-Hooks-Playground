
export function DomDiffInspector({ mutations }) {
  return (
    <div className="dom-inspector-container">
      <div className="dom-diff-summary" style={{ marginBottom: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--salt-dim)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Observed DOM Mutations ({mutations.length})</span>
          <span className="tree-tag">{mutations.length > 0 ? 'Live Observed' : 'Idle'}</span>
        </div>

        {mutations.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--salt-dim)', padding: '12px 0', textAlign: 'center' }}>
            No DOM mutations observed yet. Interact with the sandbox above to trigger changes.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {mutations.map((mut, idx) => (
              <div key={idx} className="dom-mutation-item">
                <span className="mutation-type-badge">{mut.type}</span>
                <span className="mutation-target">
                  <code>{mut.targetSelector}</code>
                </span>
                <div className="mutation-val-diff">
                  <span className="val-old">"{mut.oldValue}"</span>
                  <span className="val-arrow">➔</span>
                  <span className="val-new">"{mut.newValue}"</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
