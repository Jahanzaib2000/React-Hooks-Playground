import { LayoutEffectView } from './LayoutEffectView.jsx';
import { LAYOUT_TIMING_MS } from '../../constants/use-layout-effect.js';
import { useState, useEffect, useRef } from 'react';
import { SandboxContainer } from '../../shared/components';

function UseLayoutEffectInnerSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const handleTriggerRender = () => {
    if (isAnimating) return;
    clearAllTimeouts();
    setIsAnimating(true);
    setActiveStep(1); // 0.0s - 2.0s: Step 1 (Render)

    if (onRecordRender) onRecordRender('Render Initiated: Dual Tree Animation');
    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: 'Render Clicked', type: 'State Transition' },
        componentName: 'LayoutComparison',
        renderNumber: 2,
        hooks: [
          { slot: 0, name: 'useLayoutEffect', status: 'Pre-paint sync queue', actionRequired: false },
          { slot: 1, name: 'useEffect', status: 'Post-paint async queue', actionRequired: false }
        ],
        commit: { diffSummary: 'DOM mutations committed to DOM tree', mutationsCount: 1 },
        effects: null
      });
    }

    // 2.0s - 4.0s: Step 2 (DOM commit)
    const t1 = setTimeout(() => {
      setActiveStep(2);
      if (onRecordMutation) {
        onRecordMutation({
          type: 'childList',
          target: 'DOM',
          description: 'DOM commit: React applies mutations to memory DOM'
        });
      }
    }, LAYOUT_TIMING_MS.layoutStep);

    // 4.0s - 6.0s: Step 3 (useEffect: Browser paint | useLayoutEffect: useLayoutEffect -> Effect)
    const t2 = setTimeout(() => {
      setActiveStep(3);
    }, LAYOUT_TIMING_MS.effectStep);

    // 6.0s - 8.0s: Step 4 (useEffect: useEffect -> Effect | useLayoutEffect: Browser paint)
    const t3 = setTimeout(() => {
      setActiveStep(4);
    }, LAYOUT_TIMING_MS.paintStep);

    // 8.0s: Reset
    const t4 = setTimeout(() => {
      setActiveStep(0);
      setIsAnimating(false);
    }, LAYOUT_TIMING_MS.finish);

    timeoutsRef.current = [t1, t2, t3, t4];
  };

  return (
    <LayoutEffectView
      handleTriggerRender={handleTriggerRender}
      isAnimating={isAnimating}
      activeStep={activeStep}
    />
  );
}

export function UseLayoutEffectSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useLayoutEffect" onReset={onReset} isFullArena={true}>
      <UseLayoutEffectInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
      />
    </SandboxContainer>
  );
}
