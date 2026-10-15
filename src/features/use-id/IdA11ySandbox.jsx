import React, { useId } from 'react';

export function AccessibleFieldInstance({
  label,
  hint,
  selectedTokenId,
  showError,
  onLabelClick,
  labelRef
}) {
  const id = useId();
  const inputRef = React.useRef(null);

  const hasIds = selectedTokenId !== 'no-id';
  const inputId = hasIds ? id + '-input' : undefined;
  const hintId = hasIds ? id + '-hint' : undefined;
  const errorId = hasIds ? id + '-error' : undefined;

  const handleLabelClick = () => {
    if (onLabelClick) onLabelClick();
    if (hasIds && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="uid-a11y-field-group">
      <div className="uid-a11y-id-namespace">
        <span style={{ fontSize: 11, color: 'var(--salt-dim)' }}>Namespace:</span>
        <span className="uid-id-badge">{id}</span>
      </div>

      <label
        ref={labelRef}
        htmlFor={inputId}
        className="uid-a11y-label"
        onClick={handleLabelClick}
        style={{ cursor: 'pointer' }}
      >
        {label}
        {hasIds && (
          <span className="uid-attr-tag">htmlFor={`"${inputId}"`}</span>
        )}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        aria-describedby={[hintId, showError ? errorId : null].filter(Boolean).join(' ') || undefined}
        type="text"
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="uid-a11y-input"
      />
      {hasIds && (
        <div className="uid-attr-readout">
          <span>id=</span><span className="uid-attr-value">"{inputId}"</span>
          <span style={{ marginLeft: 8 }}>aria-describedby=</span>
          <span className="uid-attr-value">"{[hintId, showError ? errorId : null].filter(Boolean).join(' ')}"</span>
        </div>
      )}

      <p id={hintId} className="uid-a11y-hint">
        💡 {hint}
        {hasIds && (
          <span className="uid-attr-tag">id={`"${hintId}"`}</span>
        )}
      </p>

      {showError && (
        <span id={errorId} className="uid-a11y-error" role="alert">
          ⚠ This field is required
          {hasIds && (
            <span className="uid-attr-tag">id={`"${errorId}"`}</span>
          )}
        </span>
      )}

      {!hasIds && (
        <div className="uid-warning-pill" style={{ marginTop: 8 }}>
          ⚠️ No IDs — label click won't focus input, screen readers can't associate elements
        </div>
      )}
    </div>
  );
}

export function UseIdA11ySandbox({
  selectedTokenId,
  showError,
  labelClicked,
  onToggleError,
  onLabelClick
}) {
  const labelRef = React.useRef(null);

  const handleClickLabel = () => {
    onLabelClick();
    // Actually click the label element to trigger native htmlFor focus
    if (labelRef.current) {
      labelRef.current.click();
    }
  };

  return (
    <>
      <div className="demo-display-box" style={{ maxWidth: '100%', width: '100%' }}>
        <div style={{ fontSize: 12, color: 'var(--salt-dim)', marginBottom: 8 }}>
          Accessible Field — Click the label to test htmlFor wiring:
        </div>
        <AccessibleFieldInstance
          label="Email Address"
          hint="We'll never share your email with anyone else."
          selectedTokenId={selectedTokenId}
          showError={showError}
          onLabelClick={onLabelClick}
          labelRef={labelRef}
        />
        {labelClicked && selectedTokenId !== 'no-id' && (
          <div className="uid-success-pill">✓ Label click focused the input via htmlFor!</div>
        )}
      </div>
      <div className="demo-btn-group">
        <button type="button" className="salt-btn" onClick={handleClickLabel}>
          Click the Label
        </button>
        <button type="button" className="pepper-btn" onClick={onToggleError}>
          {showError ? '✓ Hide Error' : '⚠ Toggle Error'}
        </button>
      </div>
    </>
  );
}
