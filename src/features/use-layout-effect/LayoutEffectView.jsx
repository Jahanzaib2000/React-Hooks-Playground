import { LifecycleTreeNode, TreeSideAnnotation } from './LifecycleTreeParts.jsx';

export function LayoutEffectView({ handleTriggerRender, isAnimating, activeStep }) {
  return (
    <div className="layout-effect-playground-root" id="layout-effect-playground">
      {/* Single button called Render */}
      <div className="layout-render-btn-container">
        <button
          type="button"
          className="salt-btn layout-render-btn"
          id="btn-layout-render"
          onClick={handleTriggerRender}
          disabled={isAnimating}
        >
          Render
        </button>
      </div>

      {/* 2 trees */}
      <div className="layout-tree-grid">
        {/* Left Tree: useEffect */}
        <div className="lifecycle-tree-card tree-card-use-effect">
          <div className="tree-header-badge">useEffect</div>
          <div className="lifecycle-tree-spine">
            {/* Step 1: Render */}
            <div className="tree-row-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="Render" variant="default" isActive={activeStep === 1} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Calculates virtual DOM" dotVariant="cyan" isVisible={activeStep === 1} />
              </div>
            </div>

            <div className="tree-arrow-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <div className="tree-arrow-down">↓</div>
                </div>
              </div>
            </div>

            {/* Step 2: DOM commit */}
            <div className="tree-row-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="DOM commit" variant="default" isActive={activeStep === 2} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Applies DOM mutations" dotVariant="cyan" isVisible={activeStep === 2} />
              </div>
            </div>

            <div className="tree-arrow-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <div className="tree-arrow-down">↓</div>
                </div>
              </div>
            </div>

            {/* Step 3: Browser paint */}
            <div className="tree-row-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="Browser paint" variant="paint-mint" isActive={activeStep === 3} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Paints pixels to screen" dotVariant="mint" isVisible={activeStep === 3} />
              </div>
            </div>

            <div className="tree-arrow-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <div className="tree-arrow-down">↓</div>
                </div>
              </div>
            </div>

            {/* Step 4: useEffect ──► (Effect) */}
            <div className={`tree-row-wrapper tree-branch-row ${activeStep === 4 ? 'row-active' : ''}`}>
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="useEffect" variant="hook-pill" isActive={activeStep === 4} />
                </div>
                <div className="tree-branch-cell">
                  <div className={`tree-branch-arrow ${activeStep === 4 ? 'arrow-active-green' : ''}`}>
                    <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                      <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" />
                      <polygon points="15,3 21,7 15,11" fill="currentColor" />
                    </svg>
                  </div>
                  <LifecycleTreeNode label="Effect" variant="effect-green" isActive={activeStep === 4} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Runs async post-paint" dotVariant="green" isVisible={activeStep === 4} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Tree: useLayoutEffect */}
        <div className="lifecycle-tree-card tree-card-layout-effect">
          <div className="tree-header-badge">useLayoutEffect</div>
          <div className="lifecycle-tree-spine">
            {/* Step 1: Render */}
            <div className="tree-row-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="Render" variant="default" isActive={activeStep === 1} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Calculates virtual DOM" dotVariant="cyan" isVisible={activeStep === 1} />
              </div>
            </div>

            <div className="tree-arrow-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <div className="tree-arrow-down">↓</div>
                </div>
              </div>
            </div>

            {/* Step 2: DOM commit */}
            <div className="tree-row-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="DOM commit" variant="default" isActive={activeStep === 2} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Applies DOM mutations" dotVariant="cyan" isVisible={activeStep === 2} />
              </div>
            </div>

            <div className="tree-arrow-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <div className="tree-arrow-down">↓</div>
                </div>
              </div>
            </div>

            {/* Step 3: useLayoutEffect ──► (Make visual adjustment) */}
            <div className={`tree-row-wrapper tree-branch-row ${activeStep === 3 ? 'row-active' : ''}`}>
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="useLayoutEffect" variant="hook-pill" isActive={activeStep === 3} />
                </div>
                <div className="tree-branch-cell">
                  <div className={`tree-branch-arrow ${activeStep === 3 ? 'arrow-active-peach' : ''}`}>
                    <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                      <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.5" />
                      <polygon points="15,3 21,7 15,11" fill="currentColor" />
                    </svg>
                  </div>
                  <LifecycleTreeNode label="Make visual adjustment" variant="layout-peach" isActive={activeStep === 3} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Runs sync, blocks paint" dotVariant="peach" isVisible={activeStep === 3} />
              </div>
            </div>

            <div className="tree-arrow-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <div className="tree-arrow-down">↓</div>
                </div>
              </div>
            </div>

            {/* Step 4: Browser paint */}
            <div className="tree-row-wrapper">
              <div className="tree-visual-cell">
                <div className="tree-trunk-cell">
                  <LifecycleTreeNode label="Browser paint" variant="paint-mint" isActive={activeStep === 4} />
                </div>
              </div>
              <div className="tree-annotation-cell">
                <TreeSideAnnotation text="Paints pixels to screen" dotVariant="mint" isVisible={activeStep === 4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
