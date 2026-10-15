import { TIME_PHASES } from '../../constants/use.js';
import { PinIcon } from './PinIcon.jsx';

export function UseHookView({
  handleTogglePlay,
  isPlaying,
  handleStepBack,
  currentStep,
  handleStepForward,
  handleResetTimeline,
  setIsPlaying,
  setCurrentStep
}) {
  return (
    <div className="use-sandbox-root">
      {/* Top Controls Toolbar */}
      <div className="use-timeline-controls-bar">
        <div className="use-playback-btn-group">
          <button
            type="button"
            className="use-control-btn play-btn"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause auto-play' : 'Play timeline animation'}
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            className="use-control-btn"
            onClick={handleStepBack}
            disabled={currentStep === 0 || isPlaying}
            title="Step backward"
          >
            ⏮ Prev
          </button>
          <button
            type="button"
            className="use-control-btn"
            onClick={handleStepForward}
            disabled={currentStep === 4 || isPlaying}
            title="Step forward"
          >
            ⏭ Step
          </button>
          <button
            type="button"
            className="use-control-btn reset-btn"
            onClick={handleResetTimeline}
            title="Reset to t0"
          >
            ↺ Reset
          </button>
        </div>

        <div className="use-timeline-scrubber-wrapper">
          <span className="use-scrubber-label">Timeline:</span>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            className="use-timeline-slider"
          />
          <span className="use-phase-pill">
            {TIME_PHASES[currentStep].label}: {TIME_PHASES[currentStep].title}
          </span>
        </div>
      </div>

      {/* Main Timeline Arena */}
      <div className="use-timeline-arena">
        {/* Continuous Time Axis Row */}
        <div className="use-axis-row">
          <div className="use-axis-corner-label">Time Axis</div>
          <div className="use-axis-grid">
            {TIME_PHASES.map((p, idx) => (
              <div
                key={p.id}
                className={`use-axis-tick ${currentStep === idx ? 'active-tick' : ''} ${currentStep > idx ? 'completed-tick' : ''}`}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(idx);
                }}
              >
                <div className="use-tick-marker" />
                <div className="use-tick-title">{p.label}</div>
                <div className="use-tick-desc">{p.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP LANE: Without use (Five blocks) */}
        <div className="use-lane-row lane-without-use">
          <div className="use-lane-label-col">
            <span className="use-lane-main-label">Without use</span>
            <span className="use-lane-sub-tag">5 Blocks • 2 Renders</span>
          </div>

          <div className="use-lane-blocks-grid">
            {/* Top Block 1: Render */}
            <div
              className={`use-lane-block top-b1 ${currentStep === 0 ? 'block-active' : ''} ${currentStep > 0 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
            >
              <div className="use-block-step-indicator">1</div>
              <div className="use-block-title">Render</div>
              <div className="use-block-desc">Component function starts execution</div>
            </div>

            {/* Top Block 2: Shows empty or loading state */}
            <div
              className={`use-lane-block top-b2 ${currentStep === 1 ? 'block-active' : ''} ${currentStep > 1 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(1); }}
            >
              <div className="use-block-step-indicator">2</div>
              <div className="use-block-title">Shows empty or loading state</div>
              <div className="use-block-desc">Commits null/spinner to DOM (Render #1)</div>
              <div className="use-block-tag tag-warning">Flicker / Layout Shift</div>
            </div>

            {/* Top Block 3: Effect fires */}
            <div
              className={`use-lane-block top-b3 ${currentStep === 2 ? 'block-active' : ''} ${currentStep > 2 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(2); }}
            >
              <div className="use-block-step-indicator">3</div>
              <div className="use-block-title">Effect fires</div>
              <div className="use-block-desc">useEffect runs post-browser-paint</div>
            </div>

            {/* Top Block 4: Fetch runs */}
            <div
              className={`use-lane-block top-b4 ${currentStep === 3 ? 'block-active' : ''} ${currentStep > 3 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(3); }}
            >
              <div className="use-block-step-indicator">4</div>
              <div className="use-block-title">Fetch runs</div>
              <div className="use-block-desc">Async network request in flight</div>
            </div>

            {/* Top Block 5: Re-render with data */}
            <div
              className={`use-lane-block top-b5 ${currentStep === 4 ? 'block-active' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(4); }}
            >
              <div className="use-block-step-indicator">5</div>
              <div className="use-block-title">Re-render with data</div>
              <div className="use-block-desc">setState triggers 2nd render pass</div>
              <div className="use-block-tag tag-rerender">2 Renders Total</div>
            </div>
          </div>
        </div>

        {/* BOTTOM LANE: With use (Four blocks) */}
        <div className="use-lane-row lane-with-use">
          <div className="use-lane-label-col">
            <span className="use-lane-main-label">With use</span>
            <span className="use-lane-sub-tag">4 Blocks • 1 Render</span>
          </div>

          <div className="use-lane-blocks-grid">
            {/* Bottom Block 1: Render starts */}
            <div
              className={`use-lane-block bottom-b1 ${currentStep === 0 ? 'block-active' : ''} ${currentStep > 0 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(0); }}
            >
              <div className="use-block-step-indicator">1</div>
              <div className="use-block-title">Render starts</div>
              <div className="use-block-desc">Component function begins standard execution pass</div>
            </div>

            {/* Bottom Block 2: Reaches the data request */}
            <div
              className={`use-lane-block bottom-b2 ${currentStep === 1 ? 'block-active' : ''} ${currentStep > 1 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(1); }}
            >
              <div className="use-block-step-indicator">2</div>
              <div className="use-block-title">Reaches the data request</div>

              {/* Colored pin or badge reading "use" with small tag below: "asks for the data" */}
              <div className="use-pinned-badge-group">
                <div className="use-pinned-badge">
                  <PinIcon />
                  <span className="use-badge-pill">use</span>
                </div>
                <div className="use-pinned-subtag">asks for the data</div>
              </div>
            </div>

            {/* Bottom Block 3: Paused (hatched bar, pause icon) */}
            <div
              className={`use-lane-block bottom-b3 use-hatched-paused-block ${currentStep === 2 || currentStep === 3 ? 'block-active' : ''} ${currentStep > 3 ? 'block-passed' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(2); }}
            >
              <div className="use-block-step-indicator">3</div>

              {/* Pin the same badge to the start of this block with an arrow pointing into it, labeled "use pauses the render" */}
              <div className="use-paused-header-row">
                <div className="use-badge-arrow-container">
                  <div className="use-pinned-badge">
                    <PinIcon />
                    <span className="use-badge-pill">use</span>
                  </div>
                  <span className="use-arrow-glyph">➔</span>
                  <span className="use-arrow-text">use pauses the render</span>
                </div>

                <div className="use-pause-icon-badge" title="Render paused via Suspense">
                  <span className="use-pause-icon">⏸</span>
                  <span className="use-pause-label">Paused</span>
                </div>
              </div>

              {/* Step where use does its distinctive work */}
              <div className="use-distinctive-callout">
                This is the step where use does its distinctive work.
              </div>
            </div>

            {/* Bottom Block 4: Render finishes with data */}
            <div
              className={`use-lane-block bottom-b4 ${currentStep === 4 ? 'block-active' : ''}`}
              onClick={() => { setIsPlaying(false); setCurrentStep(4); }}
            >
              <div className="use-block-step-indicator">4</div>
              <div className="use-block-title">Render finishes with data</div>

              {/* Pin the same badge again, labeled "use hands back the data" */}
              <div className="use-pinned-badge-group">
                <div className="use-pinned-badge">
                  <PinIcon />
                  <span className="use-badge-pill">use</span>
                </div>
                <div className="use-pinned-subtag">use hands back the data</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
