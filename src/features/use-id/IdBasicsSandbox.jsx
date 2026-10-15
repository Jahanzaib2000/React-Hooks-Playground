import { MIN_INSTANCE_COUNT, FIELD_LABELS } from '../../constants/use-id.js';
import { useId } from 'react';

export function FormFieldInstance({ label, index, strategy }) {
  const realId = useId();

  let displayId;
  let inputId;
  let isDuplicate = false;
  let isUnstable = false;

  if (strategy === 'hardcoded') {
    displayId = 'my-input';
    inputId = 'my-input';
    isDuplicate = true;
  } else if (strategy === 'math-random') {
    // eslint-disable-next-line react-hooks/purity
    displayId = 'input-' + Math.random().toString(36).slice(2, 6);
    inputId = displayId;
    isUnstable = true;
  } else {
    displayId = realId;
    inputId = realId;
  }

  return (
    <div className="uid-instance-card" id={`instance-${index}`}>
      <div className="uid-instance-header">
        <span className="uid-instance-label">{label}</span>
        <span className={`uid-id-badge ${isDuplicate ? 'duplicate' : ''} ${isUnstable ? 'unstable' : ''}`}>
          {displayId}
        </span>
      </div>
      <div className="uid-field-row">
        <label htmlFor={inputId} className="uid-form-label">{label}</label>
        <input
          id={inputId}
          type="text"
          placeholder={`Enter ${label.toLowerCase()}...`}
          className="uid-form-input"
        />
      </div>
      {isDuplicate && (
        <div className="uid-warning-pill">⚠️ Duplicate ID in DOM!</div>
      )}
      {isUnstable && (
        <div className="uid-warning-pill unstable">⚠️ Changes every render!</div>
      )}
    </div>
  );
}

export function UseIdBasicsSandbox({
  instanceCount,
  selectedTokenId,
  onAddInstance,
  onRemoveInstance
}) {
  const labels = FIELD_LABELS;

  return (
    <>
      <div className="demo-display-box" style={{ maxWidth: '100%', width: '100%' }}>
        <div style={{ fontSize: 12, color: 'var(--salt-dim)', marginBottom: 8 }}>
          Component Instances — Each calls useId():
        </div>
        <div className="uid-instances-grid" id="instance-container">
          {Array.from({ length: instanceCount }, (_, i) => (
            <FormFieldInstance
              key={`${selectedTokenId}-${i}`}
              label={labels[i] || `Field ${i + 1}`}
              index={i}
              strategy={selectedTokenId}
            />
          ))}
        </div>
        <div className="uid-summary-strip">
          <span className="metric-pill">
            <span>Instances:</span>
            <span className="metric-val">{instanceCount}</span>
          </span>
          <span className="metric-pill">
            <span>Unique IDs:</span>
            <span className="metric-val" style={{
              color: selectedTokenId === 'hardcoded' ? '#fca5a5' : 'var(--salt-pure)'
            }}>
              {selectedTokenId === 'hardcoded' ? '1 ⚠️' : instanceCount}
            </span>
          </span>
        </div>
      </div>
      <div className="demo-btn-group">
        <button type="button" className="salt-btn" onClick={onAddInstance}>
          + Add Instance
        </button>
        <button
          type="button"
          className="pepper-btn"
          onClick={onRemoveInstance}
          disabled={instanceCount <= MIN_INSTANCE_COUNT}
          style={{ '--button-disabled-opacity': 0.4 }}
        >
          − Remove Last
        </button>
      </div>
    </>
  );
}
