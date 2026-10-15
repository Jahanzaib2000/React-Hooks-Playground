import { INITIAL_DIRECT_BOX_THEMES, CONTEXT_TIMING_MS, INITIAL_ROOT_THEME, INITIAL_TARGET_THEME } from '../../constants/use-context.js';
import { useState, useEffect, useRef } from 'react';
import { ContextBox1Root, ContextBoxChild, SideContextBox } from './ContextBoxes.jsx';
import { VerticalWire, BroadcastBeamsSvg } from './ContextWires.jsx';

export function UseContextDirectSandbox({
  onRecordRender,
  _onRecordTrace,
  onRecordMutation
}) {
  const [rootTheme, setRootTheme] = useState(INITIAL_ROOT_THEME);
  const [boxThemes, setBoxThemes] = useState(() => ({ ...INITIAL_DIRECT_BOX_THEMES }));
  const [activeFlow, setActiveFlow] = useState('idle'); // 'idle' | 'drilling' | 'context'
  const [drillingStep, setDrillingStep] = useState(0); // 0, 1, 2, 3, 4
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [targetTheme, setTargetTheme] = useState(INITIAL_TARGET_THEME);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const isAnimating = activeFlow !== 'idle';

  const handleStartPropDrill = () => {
    if (isAnimating) return;
    const nextTarget = rootTheme === 'dark' ? 'light' : 'dark';
    setTargetTheme(nextTarget);
    setActiveFlow('drilling');
    setDrillingStep(1);

    // Box 1 updates immediately
    setRootTheme(nextTarget);
    setBoxThemes((prev) => ({ ...prev, box1: nextTarget }));

    if (onRecordRender) onRecordRender('AppRoot (Box 1)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Box 1',
        description: `Box 1 theme changed to ${nextTarget}`
      });
    }

    // Step 1: Wire 1 flows for 1000ms (1s delay) -> Box 2 updates
    const t1 = setTimeout(() => {
      setDrillingStep(2);
      setBoxThemes((prev) => ({ ...prev, box2: nextTarget }));
      if (onRecordRender) onRecordRender('PageLayout (Box 2)');

      // Step 2: Wire 2 flows for 1000ms (1s delay) -> Box 3 updates
      const t2 = setTimeout(() => {
        setDrillingStep(3);
        setBoxThemes((prev) => ({ ...prev, box3: nextTarget }));
        if (onRecordRender) onRecordRender('SectionCard (Box 3)');

        // Step 3: Wire 3 flows for 1000ms (1s delay) -> Box 4 updates
        const t3 = setTimeout(() => {
          setDrillingStep(4);
          setBoxThemes((prev) => ({ ...prev, box4: nextTarget }));
          if (onRecordRender) onRecordRender('DeepLeafWidget (Box 4)');

          // Finish
          const t4 = setTimeout(() => {
            setActiveFlow('idle');
            setDrillingStep(0);
          }, CONTEXT_TIMING_MS.drillFinish);
          timersRef.current.push(t4);
        }, CONTEXT_TIMING_MS.drillStep);
        timersRef.current.push(t3);
      }, CONTEXT_TIMING_MS.drillStep);
      timersRef.current.push(t2);
    }, CONTEXT_TIMING_MS.drillStep);
    timersRef.current.push(t1);
  };

  const handleStartContextSwitch = () => {
    if (isAnimating) return;
    const nextTarget = rootTheme === 'dark' ? 'light' : 'dark';
    setTargetTheme(nextTarget);
    setActiveFlow('context');
    setIsBroadcasting(true);

    // ALL 4 BOXES UPDATE SIMULTANEOUSLY WITH 0 DELAY!
    setRootTheme(nextTarget);
    setBoxThemes({
      box1: nextTarget,
      box2: nextTarget,
      box3: nextTarget,
      box4: nextTarget
    });

    if (onRecordRender) onRecordRender('All Boxes (Simultaneous Broadcast)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Boxes 1, 2, 3, 4',
        description: `useContext broadcast: all boxes switched to ${nextTarget} simultaneously with 0s delay`
      });
    }

    const t = setTimeout(() => {
      setIsBroadcasting(false);
      setActiveFlow('idle');
    }, CONTEXT_TIMING_MS.broadcast);
    timersRef.current.push(t);
  };

  return (
    <div className="context-playground-root" id="context-playground">
      {/* Direct Teleportation Beams SVG Overlay */}
      <BroadcastBeamsSvg isBroadcasting={isBroadcasting} />

      {/* Left Column: 4 Boxes Pipeline */}
      <div className="context-boxes-column" id="context-boxes-pipeline">
        {/* Box 1: App Root */}
        <ContextBox1Root
          theme={boxThemes.box1}
          isDrilling={drillingStep === 1}
          isAnimating={isAnimating}
          onStartPropDrill={handleStartPropDrill}
        />

        {/* Wire 1: Box 1 -> Box 2 */}
        <VerticalWire
          stepNumber={1}
          isActive={drillingStep === 1}
          targetTheme={targetTheme}
        />

        {/* Box 2 */}
        <ContextBoxChild
          boxNumber={2}
          textData="This component displays data rendered under the active theme."
          theme={boxThemes.box2}
          isReceiving={drillingStep === 2}
        />

        {/* Wire 2: Box 2 -> Box 3 */}
        <VerticalWire
          stepNumber={2}
          isActive={drillingStep === 2}
          targetTheme={targetTheme}
        />

        {/* Box 3 */}
        <ContextBoxChild
          boxNumber={3}
          textData="This component displays data rendered under the active theme."
          theme={boxThemes.box3}
          isReceiving={drillingStep === 3}
        />

        {/* Wire 3: Box 3 -> Box 4 */}
        <VerticalWire
          stepNumber={3}
          isActive={drillingStep === 3}
          targetTheme={targetTheme}
        />

        {/* Box 4 */}
        <ContextBoxChild
          boxNumber={4}
          textData="This component displays data rendered under the active theme."
          theme={boxThemes.box4}
          isReceiving={drillingStep === 4}
        />
      </div>

      {/* Right Column: Side useContext Box */}
      <div className="context-side-column" id="context-side-wrapper">
        <SideContextBox
          currentTheme={rootTheme}
          isAnimating={isAnimating}
          isBroadcasting={isBroadcasting}
          onStartContextSwitch={handleStartContextSwitch}
        />
      </div>
    </div>
  );
}
