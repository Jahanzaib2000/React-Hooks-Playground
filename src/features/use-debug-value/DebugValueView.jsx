

export function DebugValueView({
  cartCount,
  theme,
  isOnline,
  handleToggleOnline,
  handleToggleTheme,
  handleCartChange,
  handleResetAll
}) {
  return (
    <div className="udv-sandbox-root">
      {/* Visual Arena: Normal App on Left | Connector | DevTools on Right */}
      <div className="udv-visual-arena">
        {/* Left Side: Normal-Looking App */}
        <div className="udv-app-column">
          <div className="udv-panel-header-bar">
            <span className="udv-panel-role-tag app-role">User Application</span>
            <span className="udv-panel-badge-sub">Rendered Browser DOM</span>
          </div>

          <div className="udv-app-window">
            {/* App Nav Header */}
            <div className="udv-app-navbar">
              <div className="udv-app-brand">
                <span className="udv-app-logo-dot" />
                <span className="udv-app-name">PulseApp</span>
              </div>
              <div className="udv-app-nav-items">
                <span className="udv-nav-item">Dashboard</span>
                <span className="udv-nav-item active">Team</span>
                <span className="udv-nav-cart-badge">🛒 {cartCount}</span>
              </div>
            </div>

            {/* Profile Card with DevTools Inspection Ring */}
            <div className="udv-profile-card-wrapper">
              <div className="udv-inspection-ring">
                <div className="udv-inspection-tab-badge">
                  <span className="udv-inspection-component-tag">&lt;ProfileCard /&gt;</span>
                  <span className="udv-inspection-selected-dot" />
                </div>

                <div className={`udv-profile-card theme-${theme.toLowerCase()}`}>
                  <div className="udv-card-avatar-row">
                    <div className="udv-avatar-circle">
                      <span>AM</span>
                      <span className={`udv-avatar-status-pip ${isOnline ? 'online' : 'offline'}`} />
                    </div>
                    <div className="udv-avatar-meta">
                      <h4 className="udv-user-name">Alex Morgan</h4>
                      <p className="udv-user-role">Principal Systems Architect</p>
                    </div>
                  </div>

                  <div className="udv-card-chips-row">
                    <span className={`udv-chip chip-status ${isOnline ? 'online' : 'offline'}`}>
                      <span className="udv-chip-dot" />
                      {isOnline ? 'Active' : 'Away'}
                    </span>
                    <span className="udv-chip chip-theme">
                      {theme} Theme
                    </span>
                    <span className="udv-chip chip-cart">
                      {cartCount} in Cart
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Sandbox Controls */}
            <div className="udv-interactive-actions-bar">
              <div className="udv-actions-title">Interactive App Controls:</div>
              <div className="udv-actions-btn-group">
                <button
                  type="button"
                  className="udv-action-btn"
                  onClick={handleToggleOnline}
                >
                  Toggle Status ({isOnline ? 'Online' : 'Offline'})
                </button>
                <button
                  type="button"
                  className="udv-action-btn"
                  onClick={handleToggleTheme}
                >
                  Toggle Theme ({theme})
                </button>
                <div className="udv-cart-stepper-btn-group">
                  <button
                    type="button"
                    className="udv-action-btn small"
                    onClick={() => handleCartChange(-1)}
                    disabled={cartCount <= 1}
                  >
                    -
                  </button>
                  <span className="udv-cart-stepper-val">{cartCount} items</span>
                  <button
                    type="button"
                    className="udv-action-btn small"
                    onClick={() => handleCartChange(1)}
                    disabled={cartCount >= 9}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="udv-action-btn reset"
                  onClick={handleResetAll}
                  title="Reset demo state"
                >
                  ↺
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: React DevTools Panel */}
        <div className="udv-devtools-column">
          <div className="udv-panel-header-bar">
            <span className="udv-panel-role-tag devtools-role">⚛ React DevTools</span>
            <span className="udv-panel-badge-sub">Internal Inspection View</span>
          </div>

          <div className="udv-devtools-window">
            {/* DevTools Tab Bar */}
            <div className="udv-devtools-tabbar">
              <div className="udv-devtools-tabs">
                <span className="udv-tab-btn active">
                  <span className="udv-react-icon">⚛</span> Components
                </span>
                <span className="udv-tab-btn dimmed">Profiler</span>
              </div>
              <div className="udv-devtools-search">
                <span className="udv-search-icon">🔍</span>
                <span className="udv-search-placeholder">ProfileCard</span>
              </div>
            </div>

            {/* DevTools Body Split: Component Tree (Left) & Inspector (Right) */}
            <div className="udv-devtools-split-body">
              {/* Left Column: Component Tree */}
              <div className="udv-devtools-tree-pane">
                <div className="udv-tree-row dimmed">&lt;App&gt;</div>
                <div className="udv-tree-row dimmed indent-1">&lt;AppNavbar /&gt;</div>
                <div className="udv-tree-row dimmed indent-1">▼ &lt;Dashboard&gt;</div>
                <div className="udv-tree-row active-selection indent-2">
                  <span className="udv-selection-pointer">▶</span>
                  <span className="udv-component-tag">&lt;ProfileCard&gt;</span>
                </div>
                <div className="udv-tree-row dimmed indent-3">&lt;Avatar /&gt;</div>
                <div className="udv-tree-row dimmed indent-3">&lt;StatusIndicator /&gt;</div>
                <div className="udv-tree-row dimmed indent-1">&lt;Footer /&gt;</div>
              </div>

              {/* Right Column: Hooks List Inspector */}
              <div className="udv-devtools-inspect-pane">
                <div className="udv-inspect-header dimmed">
                  <span>&lt;ProfileCard&gt;</span>
                  <span className="udv-file-info">ProfileCard.jsx:18</span>
                </div>

                <div className="udv-inspect-section-title dimmed">props</div>
                <div className="udv-inspect-props-code dimmed">
                  &#123; userId: "usr_992" &#125;
                </div>

                {/* Hooks List Section */}
                <div className="udv-inspect-section-title hooks-title">hooks</div>
                <div className="udv-devtools-hooks-list">
                  {/* Hook 1: OnlineStatus */}
                  <div className="udv-hook-item-row highlighted-target">
                    <span className="udv-hook-name dimmed">1. OnlineStatus:</span>
                    <span className="udv-hook-debug-label-pill">
                      "{isOnline ? 'Online' : 'Offline'}"
                    </span>

                    {/* Single Callout Arrow tagged "dev-only label" */}
                    <div className="udv-callout-arrow-widget">
                      <div className="udv-callout-arrow-pointer">◀</div>
                      <div className="udv-callout-card">
                        <span className="udv-callout-tag">dev-only label</span>
                        <p className="udv-callout-desc">
                          These labels come from the developer via <code>useDebugValue</code>, appear only inside DevTools, and never show up in the app the user sees.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hook 2: Theme */}
                  <div className="udv-hook-item-row">
                    <span className="udv-hook-name dimmed">2. Theme:</span>
                    <span className="udv-hook-debug-label-pill">
                      "{theme}"
                    </span>
                  </div>

                  {/* Hook 3: Cart */}
                  <div className="udv-hook-item-row">
                    <span className="udv-hook-name dimmed">3. Cart:</span>
                    <span className="udv-hook-debug-label-pill">
                      "{cartCount} items"
                    </span>
                  </div>
                </div>

                <div className="udv-inspect-footer-note dimmed">
                  rendered by &lt;Dashboard&gt;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption Underneath */}
      <div className="udv-bottom-caption-banner">
        <h3 className="udv-caption-heading">“Custom hooks, labeled for developers”</h3>
        <p className="udv-caption-subtext">
          <code>useDebugValue</code> formats diagnostic state labels inside React DevTools without adding attributes or nodes to the user's DOM.
        </p>
      </div>
    </div>
  );
}
