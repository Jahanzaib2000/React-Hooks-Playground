

export function InsertionEffectView({
  handleTriggerInsertion,
  isModalOpen,
  handleResetSandbox,
  isApplied,
  handleCloseModal,
  activeStep
}) {
  return (
    <div className="insertion-playground-root" id="insertion-playground">
      {/* 2 Small Buttons at the top */}
      <div className="insertion-top-controls">
        <button
          type="button"
          className="insertion-small-btn insertion-btn-primary"
          id="btn-use-insertion-effect"
          onClick={handleTriggerInsertion}
          disabled={isModalOpen}
        >
          useInsertionEffect
        </button>
        <button
          type="button"
          className="insertion-small-btn insertion-btn-reset"
          id="btn-reset-insertion-sandbox"
          onClick={handleResetSandbox}
        >
          Reset Sandbox
        </button>
      </div>

      {/* Default 1-line explanation of what the hook does */}
      <div className="insertion-one-line-explanation">
        useInsertionEffect runs synchronously before any DOM mutations to inject dynamic styles before layout calculations.
      </div>

      {/* Live Sandbox Surface (transforms to white background & serif font when injected) */}
      <div className={`insertion-sandbox-surface ${isApplied ? 'insertion-theme-active' : ''}`} id="insertion-sandbox-surface">
        <div className="insertion-surface-header">
          <span className="theme-status-tag">
            {isApplied ? 'Theme: Injected via useInsertionEffect' : 'Theme: Default Dark Theme'}
          </span>
          <span className="theme-source-pill">
            {isApplied ? 'File: src/features/use-insertion-effect/insertionTheme.css' : 'Default Salt & Pepper Palette'}
          </span>
        </div>

        <div className="insertion-preview-inner">
          <h3 className="sandbox-display-heading">Dynamic Styled Sandbox Card</h3>
          <p className="sandbox-display-body">
            This container styling is dynamically managed. When useInsertionEffect executes, it injects dedicated CSS from a separate file directly into the document head before React performs any DOM mutations or layout calculations.
          </p>
          <div className="insertion-props-grid">
            <div className="prop-box">
              <span className="prop-label">Background Color</span>
              <span className="prop-value">{isApplied ? '#ffffff (Pure White)' : '#0f172a (Dark Surface)'}</span>
            </div>
            <div className="prop-box">
              <span className="prop-label">Font Family</span>
              <span className="prop-value">{isApplied ? 'Georgia, serif (Serif Typography)' : 'Inter, system-ui (Sans-Serif)'}</span>
            </div>
            <div className="prop-box">
              <span className="prop-label">Style Injection</span>
              <span className="prop-value">{isApplied ? '<head> <style id="insertion-theme-style-tag">' : 'Not injected'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up Modal when useInsertionEffect is pressed */}
      {isModalOpen && (
        <div className="insertion-modal-backdrop" onClick={handleCloseModal}>
          <div className="insertion-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="insertion-modal-header">
              <div>
                <h3 className="insertion-modal-title">useInsertionEffect Lifecycle Execution</h3>
                <p className="insertion-modal-subtitle">Synchronous Style Injection Before DOM Mutations</p>
              </div>
              <button
                type="button"
                className="insertion-modal-close-icon"
                onClick={handleCloseModal}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="insertion-event-chain">
              {/* Event 1: React Renders */}
              <div className={`insertion-event-step-row ${activeStep === 1 ? 'step-active' : activeStep > 1 ? 'step-completed' : ''}`}>
                <div className="insertion-step-badge">1</div>
                <div className="insertion-step-content">
                  <div className="insertion-step-name">React Renders</div>
                  <div className="insertion-step-desc">
                    Component executes function body and calculates the Virtual DOM diff.
                  </div>
                </div>
              </div>

              <div className="insertion-chain-connector">↓</div>

              {/* Event 2: useInsertionEffect */}
              <div className={`insertion-event-step-row ${activeStep === 2 ? 'step-active' : activeStep > 2 ? 'step-completed' : ''}`}>
                <div className="insertion-step-badge">2</div>
                <div className="insertion-step-content">
                  <div className="insertion-step-name">useInsertionEffect</div>
                  <div className="insertion-step-desc">
                    Runs synchronously before DOM mutations: injects CSS from insertionTheme.css into &lt;head&gt;.
                  </div>
                </div>
              </div>

              <div className="insertion-chain-connector">↓</div>

              {/* Event 3: React updates the DOM */}
              <div className={`insertion-event-step-row ${activeStep === 3 ? 'step-active' : activeStep > 3 ? 'step-completed' : ''}`}>
                <div className="insertion-step-badge">3</div>
                <div className="insertion-step-content">
                  <div className="insertion-step-name">React updates the DOM</div>
                  <div className="insertion-step-desc">
                    React applies DOM mutations. Nodes attach newly styled class with zero layout recalculation.
                  </div>
                </div>
              </div>

              <div className="insertion-chain-connector">↓</div>

              {/* Event 4: Browser Paints */}
              <div className={`insertion-event-step-row ${activeStep === 4 ? 'step-active' : activeStep > 4 ? 'step-completed' : ''}`}>
                <div className="insertion-step-badge">4</div>
                <div className="insertion-step-content">
                  <div className="insertion-step-name">Browser Paints</div>
                  <div className="insertion-step-desc">
                    Browser paints pixels to the screen with white background and serif font without visual flicker.
                  </div>
                </div>
              </div>
            </div>

            <div className="insertion-modal-footer">
              <div className="insertion-status-summary">
                {activeStep === 5
                  ? 'Animation finished. Closing in 3 seconds...'
                  : activeStep === 4
                  ? 'Browser Paints: Applying white background and serif font...'
                  : activeStep > 0
                  ? 'Executing lifecycle sequence...'
                  : 'Ready.'}
              </div>
              <button
                type="button"
                className="insertion-dismiss-btn"
                onClick={handleCloseModal}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
