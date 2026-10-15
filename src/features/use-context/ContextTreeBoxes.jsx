import { ThemeToggle, ThemePill } from '../../shared/primitives';

export function ContextTreeBox1Root({
  theme,
  isAnimating,
  onToggleTheme,
  onPassToBox2,
  onPassToBox3
}) {
  return (
    <div
      className={`context-box-item tree-node-box box-1-root theme-${theme}`}
      id="tree-box-1"
    >
      <div className="context-box-header">
        <h4 className="context-box-name">Box 1</h4>
        <ThemePill theme={theme} mini id="tree-box-1-theme-pill" />
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">
          Holds context of Light and Dark theme in React state.
        </p>
        <div className="box-control-row">
          <ThemeToggle
            id="btn-switch-box-1"
            disabled={isAnimating}
            onToggle={onToggleTheme}
          />
        </div>
        <div className="tree-btn-pair">
          <button
            type="button"
            className="tree-pass-btn"
            id="btn-pass-1-2"
            disabled={isAnimating}
            onClick={onPassToBox2}
          >
            Pass to Box 2
          </button>
          <button
            type="button"
            className="tree-pass-btn"
            id="btn-pass-1-3"
            disabled={isAnimating}
            onClick={onPassToBox3}
          >
            Pass to Box 3
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContextTreeParentBox({
  boxNumber,
  theme,
  childA,
  childB,
  isReceiving,
  isAnimating,
  onPassToChildA,
  onPassToChildB
}) {
  return (
    <div
      className={`context-box-item tree-node-box theme-${theme} ${isReceiving ? 'box-pulse-receive' : ''}`}
      id={`tree-box-${boxNumber}`}
    >
      <div className="context-box-header">
        <h4 className="context-box-name">Box {boxNumber}</h4>
        <ThemePill theme={theme} mini id={`tree-box-${boxNumber}-theme-pill`} />
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">
          This component displays data rendered under the active theme.
        </p>
        <div className="tree-btn-pair">
          <button
            type="button"
            className="tree-pass-btn"
            id={`btn-pass-${boxNumber}-${childA}`}
            disabled={isAnimating}
            onClick={onPassToChildA}
          >
            Pass to Box {childA}
          </button>
          <button
            type="button"
            className="tree-pass-btn"
            id={`btn-pass-${boxNumber}-${childB}`}
            disabled={isAnimating}
            onClick={onPassToChildB}
          >
            Pass to Box {childB}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContextTreeLeafBox({ boxNumber, theme, isReceiving }) {
  return (
    <div
      className={`context-box-item tree-leaf-box theme-${theme} ${isReceiving ? 'box-pulse-receive' : ''}`}
      id={`tree-box-${boxNumber}`}
    >
      <div className="context-box-header">
        <h4 className="context-box-name">Box {boxNumber}</h4>
        <ThemePill theme={theme} mini showLabel={false} id={`tree-box-${boxNumber}-theme-pill`} />
      </div>

      <div className="context-box-body">
        <p className="context-box-desc">
          Rendered in {theme} theme.
        </p>
      </div>
    </div>
  );
}
