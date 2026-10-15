import { INITIAL_TREE_BOX_THEMES, CONTEXT_TIMING_MS } from '../../constants/use-context.js';
import { useState, useEffect, useRef } from 'react';
import { TreeRootForkWire, TreeBranchForkWire, TreeBroadcastBanner } from './ContextTreeWires.jsx';
import { ContextTreeBox1Root, ContextTreeParentBox, ContextTreeLeafBox } from './ContextTreeBoxes.jsx';

export function UseContextTreeSandbox({
  onRecordRender,
  _onRecordTrace,
  onRecordMutation
}) {
  const [themes, setThemes] = useState(() => ({ ...INITIAL_TREE_BOX_THEMES }));
  const [activeTransfer, setActiveTransfer] = useState(null); // { from, to, theme }
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const isAnimating = activeTransfer !== null || isBroadcasting;

  const handleToggleRootTheme = () => {
    if (isAnimating) return;
    const next = themes.box1 === 'dark' ? 'light' : 'dark';
    setThemes((prev) => ({ ...prev, box1: next }));
    if (onRecordRender) onRecordRender('Box 1 (Local Theme Switch)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Box 1',
        description: `Box 1 theme switched to ${next} (Box 1 only)`
      });
    }
  };

  const handlePassTheme = (fromBox, toBox) => {
    if (isAnimating) return;
    const sourceTheme = themes[`box${fromBox}`];
    setActiveTransfer({ from: fromBox, to: toBox, theme: sourceTheme });

    if (onRecordRender) onRecordRender(`Box ${fromBox} -> Box ${toBox}`);
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: `Box ${toBox}`,
        description: `Passing theme (${sourceTheme}) manually from Box ${fromBox} to Box ${toBox}`
      });
    }

    const t = setTimeout(() => {
      setThemes((prev) => ({ ...prev, [`box${toBox}`]: sourceTheme }));
      setActiveTransfer(null);
    }, CONTEXT_TIMING_MS.treeTransfer);
    timersRef.current.push(t);
  };

  const handleSwitchAll = () => {
    if (isAnimating) return;
    const nextTarget = themes.box1 === 'dark' ? 'light' : 'dark';
    setIsBroadcasting(true);

    // Switch all 7 boxes across all 3 layers simultaneously (0s delay)
    setThemes({
      box1: nextTarget,
      box2: nextTarget,
      box3: nextTarget,
      box4: nextTarget,
      box5: nextTarget,
      box6: nextTarget,
      box7: nextTarget
    });

    if (onRecordRender) onRecordRender('All 7 Boxes (useContext Broadcast)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Boxes 1 through 7',
        description: `useContext broadcast: all 7 boxes switched to ${nextTarget} simultaneously with 0s delay`
      });
    }

    const t = setTimeout(() => {
      setIsBroadcasting(false);
    }, CONTEXT_TIMING_MS.broadcast);
    timersRef.current.push(t);
  };

  return (
    <div className="context-tree-playground-root" id="context-tree-playground">
      {/* Broadcast Banner Overlay */}
      <TreeBroadcastBanner isBroadcasting={isBroadcasting} />

      {/* Left / Main Tree Area */}
      <div className="context-tree-column" id="context-tree-hierarchy">
        {/* Layer 1: Start Context (Box 1) */}
        <div className="tree-root-container">
          <ContextTreeBox1Root
            theme={themes.box1}
            isAnimating={isAnimating}
            onToggleTheme={handleToggleRootTheme}
            onPassToBox2={() => handlePassTheme(1, 2)}
            onPassToBox3={() => handlePassTheme(1, 3)}
          />
        </div>

        {/* Fork wire from Box 1 to Left & Right Branches */}
        <TreeRootForkWire
          activeTransfer={activeTransfer?.from === 1 ? activeTransfer : null}
        />

        {/* Layer 2 + Layer 3 Branch Subtrees */}
        <div className="tree-branches-row">
          {/* Left Branch: Box 2 -> (Box 4, Box 5) */}
          <div className="tree-branch">
            <ContextTreeParentBox
              boxNumber={2}
              theme={themes.box2}
              childA={4}
              childB={5}
              isReceiving={activeTransfer?.to === 2}
              isAnimating={isAnimating}
              onPassToChildA={() => handlePassTheme(2, 4)}
              onPassToChildB={() => handlePassTheme(2, 5)}
            />
            <TreeBranchForkWire
              fromBox={2}
              leftChild={4}
              rightChild={5}
              activeTransfer={activeTransfer?.from === 2 ? activeTransfer : null}
            />
            <div className="tree-leaf-row">
              <ContextTreeLeafBox
                boxNumber={4}
                theme={themes.box4}
                isReceiving={activeTransfer?.to === 4}
              />
              <ContextTreeLeafBox
                boxNumber={5}
                theme={themes.box5}
                isReceiving={activeTransfer?.to === 5}
              />
            </div>
          </div>

          {/* Right Branch: Box 3 -> (Box 6, Box 7) */}
          <div className="tree-branch">
            <ContextTreeParentBox
              boxNumber={3}
              theme={themes.box3}
              childA={6}
              childB={7}
              isReceiving={activeTransfer?.to === 3}
              isAnimating={isAnimating}
              onPassToChildA={() => handlePassTheme(3, 6)}
              onPassToChildB={() => handlePassTheme(3, 7)}
            />
            <TreeBranchForkWire
              fromBox={3}
              leftChild={6}
              rightChild={7}
              activeTransfer={activeTransfer?.from === 3 ? activeTransfer : null}
            />
            <div className="tree-leaf-row">
              <ContextTreeLeafBox
                boxNumber={6}
                theme={themes.box6}
                isReceiving={activeTransfer?.to === 6}
              />
              <ContextTreeLeafBox
                boxNumber={7}
                theme={themes.box7}
                isReceiving={activeTransfer?.to === 7}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Side useContext Box */}
      <div className="context-side-column" id="context-tree-side-wrapper">
        <div
          className={`side-context-hub ${isBroadcasting ? 'hub-broadcasting' : ''}`}
          id="side-tree-usecontext-box"
        >
          <div className="hub-header">
            <div className="hub-badge-row">
              <span className="hub-icon">⚡</span>
              <span className="hub-chip">useContext</span>
            </div>
            <h3 className="hub-title">ThemeContext Hub</h3>
          </div>

          <div className="hub-body">
            <p className="hub-desc">
              Directly broadcasts context across all 3 layers. Switch all 7 boxes simultaneously!
            </p>

            <div className="hub-action-wrap">
              <button
                type="button"
                className="context-switch-btn"
                id="btn-tree-context-switch"
                disabled={isAnimating}
                onClick={handleSwitchAll}
              >
                Switch Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   USEIMPERATIVEHANDLE PLAYGROUND: 3 BOXES + REF BRIDGE TOGGLE + FIREWORKS
   ========================================================================= */
