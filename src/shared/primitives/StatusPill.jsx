
/**
 * Reusable Status Pill Component
 * Standardized status indicators for warning, error, success, info, and online/offline states.
 *
 * @param {Object} props
 * @param {'success'|'warning'|'error'|'info'|'online'|'offline'} [props.variant='info'] - Pill semantic variant
 * @param {React.ReactNode} props.children - Pill text or content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.id] - Optional element ID
 * @param {Object} [props.style] - Optional inline style object
 */
export function StatusPill({
  variant = 'info',
  children,
  className = '',
  id,
  style,
  ...rest
}) {
  const variantClass = `status-pill-${variant}`;
  return (
    <span
      id={id}
      className={`status-pill ${variantClass} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
}
