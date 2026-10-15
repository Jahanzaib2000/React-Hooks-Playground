

export function LifecycleTreeNode({ label, variant = 'default', isActive }) {
  return (
    <div className={`lifecycle-tree-node node-variant-${variant} ${isActive ? 'node-active' : ''}`}>
      {label}
    </div>
  );
}

export function TreeSideAnnotation({ text, dotVariant, isVisible }) {
  return (
    <div className={`tree-annotation-slot ${isVisible ? 'slot-active' : ''}`}>
      {isVisible && (
        <div className={`tree-side-annotation annotation-${dotVariant}`}>
          <span className={`annotation-dot dot-${dotVariant}`} />
          <span className="annotation-text">{text}</span>
        </div>
      )}
    </div>
  );
}
