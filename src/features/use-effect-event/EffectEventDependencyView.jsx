

export function EffectEventDependencyView({
  isConnected,
  handleToggleConnection,
  handleRunEffect,
  handleClickRoomNode,
  roomId,
  roomLight,
  handleClickServerNode,
  serverUrl,
  serverLight,
  handleClickThemeNode,
  theme,
  themeLight,
  handleFireEvent
}) {
  return (
    <div className="uee-sandbox-root">
      {/* Top Connection Toggle Bar */}
      <div className="uee-top-toggle-container">
        <div className="uee-top-toggle-header">
          <span className="uee-toggle-title">Architecture Mode:</span>
          <div className="uee-toggle-button-group">
            <button
              type="button"
              className={`uee-toggle-btn ${isConnected ? 'active' : ''}`}
              onClick={() => handleToggleConnection(true)}
            >
              Connected (useEffectEvent)
            </button>
            <button
              type="button"
              className={`uee-toggle-btn ${!isConnected ? 'active' : ''}`}
              onClick={() => handleToggleConnection(false)}
            >
              Disconnected
            </button>
          </div>
        </div>
        <div className="uee-toggle-status-banner">
          {isConnected
            ? 'Theme is extracted via useEffectEvent: clicking Id or url turns all 3 on, but clicking Theme turns only Theme on'
            : 'useEffectEvent is hidden: Theme is in dependency array, so clicking any of the 3 nodes turns all 3 on'}
        </div>
      </div>

      {/* Tree Arena */}
      <div className="uee-tree-arena">
        {/* Root Node: useEffect */}
        <div className="uee-root-container">
          <div
            className="uee-node-root"
            onClick={handleRunEffect}
            title="Click to run effect (triggers all dependencies)"
          >
            <div className="uee-root-label-row">
              <span className="uee-node-tag">Root Node</span>
              <span className="uee-click-hint">Click: Lights all nodes</span>
            </div>
            <div className="uee-root-code">
              useEffect(() =&gt; &#123; ... &#125;, [{isConnected ? 'roomId, serverUrl' : 'roomId, serverUrl, theme'}])
            </div>
          </div>
        </div>

        {/* SVG Connector Trunk & Branches */}
        <div className="uee-svg-canvas-wrapper">
          <svg className="uee-branch-svg" viewBox="0 0 600 50" preserveAspectRatio="none">
            <line x1="300" y1="0" x2="300" y2="20" className="uee-branch-line" />
            <line x1="100" y1="20" x2="500" y2="20" className="uee-branch-line" />
            <line x1="100" y1="20" x2="100" y2="50" className="uee-branch-line" />
            <line x1="300" y1="20" x2="300" y2="50" className="uee-branch-line" />
            <line x1="500" y1="20" x2="500" y2="50" className="uee-branch-line" />
            <circle cx="100" cy="50" r="3" className="uee-branch-dot" />
            <circle cx="300" cy="50" r="3" className="uee-branch-dot" />
            <circle cx="500" cy="50" r="3" className="uee-branch-dot" />
          </svg>
        </div>

        {/* Row of 3 Branching Dependencies (All Clickable) */}
        <div className="uee-deps-row">
          {/* Dependency 1: roomId (Clickable: Turns all 3 on) */}
          <div className="uee-dep-column">
            <div
              className="uee-dep-card clickable"
              onClick={handleClickRoomNode}
              title="Click roomId node (turns all 3 lights on)"
            >
              <div className="uee-dep-card-header">
                <span className="uee-dep-type">Reactive Dep</span>
              </div>
              <div className="uee-dep-name">roomId</div>
              <div className="uee-dep-val">"{roomId}"</div>
            </div>
            <div className={`uee-light-subnode ${roomLight ? 'active' : ''}`}>
              <div className="uee-light-bulb" />
              <span className="uee-light-label">{roomLight ? 'Active' : 'Dormant'}</span>
            </div>
          </div>

          {/* Dependency 2: serverUrl (Clickable: Turns all 3 on) */}
          <div className="uee-dep-column">
            <div
              className="uee-dep-card clickable"
              onClick={handleClickServerNode}
              title="Click serverUrl node (turns all 3 lights on)"
            >
              <div className="uee-dep-card-header">
                <span className="uee-dep-type">Reactive Dep</span>
              </div>
              <div className="uee-dep-name">serverUrl</div>
              <div className="uee-dep-val">"{serverUrl}"</div>
            </div>
            <div className={`uee-light-subnode ${serverLight ? 'active' : ''}`}>
              <div className="uee-light-bulb" />
              <span className="uee-light-label">{serverLight ? 'Active' : 'Dormant'}</span>
            </div>
          </div>

          {/* Dependency 3: Theme (Clickable: If useEffectEvent is ON -> ONLY Theme turns on! If OFF -> All 3 turn on) */}
          <div className="uee-dep-column">
            <div
              className={`uee-dep-card special-theme clickable ${isConnected ? 'isolated' : ''}`}
              onClick={handleClickThemeNode}
              title={isConnected ? "Click Theme node (useEffectEvent is ON: only Theme turns on)" : "Click Theme node (useEffectEvent is OFF: turns all 3 on)"}
            >
              <div className="uee-dep-card-header">
                <span className="uee-dep-type">{isConnected ? 'Non-Reactive' : 'Reactive Dep'}</span>
              </div>
              <div className="uee-dep-name">Theme</div>
              <div className="uee-dep-val">"{theme}"</div>
            </div>
            <div className={`uee-light-subnode ${themeLight ? 'active' : ''}`}>
              <div className="uee-light-bulb" />
              <span className="uee-light-label">{themeLight ? 'Active' : 'Dormant'}</span>
            </div>

            {/* When connected: Bridge line and useEffectEvent node (Hidden when disconnected) */}
            {isConnected && (
              <div className="uee-event-branch-container">
                <div className="uee-bridge-stem" />
                <div
                  className="uee-node-event"
                  onClick={handleFireEvent}
                  title="Click to fire useEffectEvent (Lights only Theme node)"
                >
                  <div className="uee-event-header">
                    <span className="uee-event-tag">useEffectEvent</span>
                    <span className="uee-event-hint">Click: Theme Only</span>
                  </div>
                  <div className="uee-event-name">onConnected()</div>
                  <button
                    type="button"
                    className="uee-event-fire-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFireEvent();
                    }}
                  >
                    Fire useEffectEvent
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Caption Banner */}
      <div className="uee-bottom-caption-banner">
        <h3 className="uee-caption-heading">“useEffectEvent extracts non-reactive values so dependencies stay lean”</h3>
        <p className="uee-caption-subtext">
          <code>useEffectEvent</code> reads current state without pulling it into <code>useEffect</code> dependencies, preventing unwanted effect re-runs.
        </p>
      </div>
    </div>
  );
}
