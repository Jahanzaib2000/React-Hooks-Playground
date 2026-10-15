import { HOOK_SHORT_DESCRIPTIONS, FULL_ARENA_HOOKS, DEFAULT_HOOK_DESCRIPTION } from '../../constants/app.js';

export function SandboxContainer({
  hookName,
  onReset,
  isRenderFlashing = false,
  isFullArena,
  sandboxRef,
  children
}) {
  const fullArena = isFullArena ?? FULL_ARENA_HOOKS.has(hookName);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <span className="panel-title">
          <span>Interactive Component Sandbox</span>
          <span className="panel-badge">{hookName} Demo</span>
        </span>
        <button
          type="button"
          className="theory-btn"
          style={{ padding: '2px 8px', fontSize: 11 }}
          onClick={onReset}
        >
          ↺ Reset Sandbox
        </button>
      </div>

      <div
        className={`sandbox-card ${isRenderFlashing ? 'render-flash' : ''} ${fullArena ? 'full-arena' : ''}`}
        ref={sandboxRef}
      >
        <div className={`demo-ui ${fullArena ? 'full-width-demo' : ''}`}>
          {children}
        </div>
      </div>

      <div className="telemetry-strip">
        <div className="sandbox-hook-description">
          <span className="sandbox-hook-description-name">{hookName}:</span>{' '}
          {HOOK_SHORT_DESCRIPTIONS[hookName] || DEFAULT_HOOK_DESCRIPTION}
        </div>
      </div>
    </div>
  );
}
