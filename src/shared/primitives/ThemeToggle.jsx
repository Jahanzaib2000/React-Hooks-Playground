
/**
 * Reusable Theme Status Pill Badge
 * Displays ☀️ Light or 🌙 Dark pill badge with consistent styling.
 */
export function ThemePill({
  theme = 'light',
  mini = false,
  showLabel = true,
  id,
  className = ''
}) {
  const isLight = theme === 'light';
  const label = isLight
    ? mini && !showLabel ? '☀️' : '☀️ Light'
    : mini && !showLabel ? '🌙' : '🌙 Dark';

  return (
    <span
      className={`theme-pill-badge ${mini ? 'pill-mini' : ''} pill-${theme} ${className}`.trim()}
      id={id}
    >
      {label}
    </span>
  );
}

/**
 * Reusable Theme Toggle Button and optional Status Pill
 *
 * @param {Object} props
 * @param {string} [props.theme='light'] - Active theme ('light' | 'dark')
 * @param {Function} props.onToggle - Click handler to toggle theme
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.id] - HTML ID for button
 * @param {string} [props.className='tree-switch-theme-btn'] - Button class name
 * @param {React.ReactNode} [props.children='Switch Theme'] - Button label content
 * @param {boolean} [props.showPill=false] - Whether to render an attached ThemePill
 * @param {boolean} [props.miniPill=false] - Whether attached pill is mini
 * @param {string} [props.pillId] - ID for the attached ThemePill
 */
export function ThemeToggle({
  theme = 'light',
  onToggle,
  disabled = false,
  id,
  className = 'tree-switch-theme-btn',
  children = 'Switch Theme',
  showPill = false,
  miniPill = false,
  pillId
}) {
  return (
    <>
      <button
        type="button"
        id={id}
        className={className}
        disabled={disabled}
        onClick={onToggle}
      >
        {children}
      </button>
      {showPill && (
        <ThemePill
          theme={theme}
          mini={miniPill}
          id={pillId}
        />
      )}
    </>
  );
}
