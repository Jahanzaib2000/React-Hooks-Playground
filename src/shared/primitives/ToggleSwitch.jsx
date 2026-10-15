
/**
 * Unified Toggle Switch Component
 * Replaces duplicate switch sliders across the playground (Server toggle, useTransition, useImperativeHandle).
 *
 * @param {Object} props
 * @param {string} [props.id] - HTML ID for the input element
 * @param {boolean} props.checked - Checked state of the switch
 * @param {Function} props.onChange - Change handler function
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.label] - Optional leading label text/element
 * @param {string} [props.className=''] - Additional CSS class name
 * @param {string} [props.statusLabel] - Optional trailing status text (e.g. "ONLINE" or "ON (Concurrent)")
 * @param {string} [props.title] - Optional tooltip text
 * @param {string} [props.ariaLabel] - Accessible label
 */
export function ToggleSwitch({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
  statusLabel,
  title,
  ariaLabel
}) {
  const switchElement = (
    <div className={`custom-switch ${className}`.trim()}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
        title={title}
      />
      <span className="switch-slider" />
    </div>
  );

  if (label || statusLabel) {
    return (
      <label className="switch-label" htmlFor={id} style={{ margin: 0 }}>
        {label && <span className="switch-text">{label}</span>}
        {switchElement}
        {statusLabel && (
          <span className={`server-status-pill ${checked ? 'online' : 'offline'}`}>
            {statusLabel}
          </span>
        )}
      </label>
    );
  }

  return switchElement;
}
