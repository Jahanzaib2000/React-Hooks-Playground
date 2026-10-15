import { ChildFireworksBox } from './ImperativeChild.jsx';
import { INITIAL_FIREWORK_COLOR, IMPERATIVE_TIMING_MS } from '../../constants/use-imperative-handle.js';
import { useState, useRef, useEffect, useCallback } from 'react';
import { SandboxContainer } from '../../shared/components';
import { ImperativeForkWire, ParentImperativeBox } from './ImperativeParent.jsx';

function UseImperativeHandleInnerSandbox({
  onRecordRender,
  _onRecordTrace,
  onRecordMutation
}) {
  // Toggle is OFF by default as requested
  const [isImperativeOn, setIsImperativeOn] = useState(false);
  const [isParentGlowing, setIsParentGlowing] = useState(false);
  const [parentFireworksActive, setParentFireworksActive] = useState(false);
  const [parentFireworksColor, setParentFireworksColor] = useState(INITIAL_FIREWORK_COLOR);

  const parentGlowTimerRef = useRef(null);
  const parentFireworksTimerRef = useRef(null);

  const leftChildRef = useRef(null);
  const rightChildRef = useRef(null);

  const handleParentGlow = () => {
    setIsParentGlowing(true);
    if (onRecordRender) onRecordRender('Box 1 (Parent Glow)');
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Box 1',
        description: 'Box 1 (Parent) activated glowing aura'
      });
    }
    if (parentGlowTimerRef.current) clearTimeout(parentGlowTimerRef.current);
    parentGlowTimerRef.current = setTimeout(() => {
      setIsParentGlowing(false);
    }, IMPERATIVE_TIMING_MS.glowAndFireworks);
  };

  const handleToggleBridge = () => {
    const next = !isImperativeOn;
    setIsImperativeOn(next);
    if (onRecordRender) onRecordRender(`useImperativeHandle Bridge -> ${next ? 'ON' : 'OFF'}`);
    if (onRecordMutation) {
      onRecordMutation({
        type: 'attribute',
        target: 'Ref Bridge',
        description: `useImperativeHandle toggle switched to ${next ? 'ON (Handle exposed)' : 'OFF (Encapsulation active, parent buttons hidden)'}`
      });
    }
  };

  const handlePlayFireworksOnParent = useCallback((color) => {
    setParentFireworksColor(color);
    setParentFireworksActive(true);
    if (parentFireworksTimerRef.current) clearTimeout(parentFireworksTimerRef.current);
    parentFireworksTimerRef.current = setTimeout(() => {
      setParentFireworksActive(false);
    }, IMPERATIVE_TIMING_MS.glowAndFireworks);
  }, []);

  const handleTriggerRedFireworksFromParent = () => {
    if (!isImperativeOn) return;
    if (leftChildRef.current && leftChildRef.current.triggerFireworks) {
      if (onRecordRender) onRecordRender('Parent -> Left Child Handle -> Red Fireworks on Parent');
      if (onRecordMutation) {
        onRecordMutation({
          type: 'attribute',
          target: 'Box 1',
          description: 'Box 1 (Parent) invoked Left Child ref handle: played Red Fireworks on Parent'
        });
      }
      leftChildRef.current.triggerFireworks();
    }
  };

  const handleTriggerBlueFireworksFromParent = () => {
    if (!isImperativeOn) return;
    if (rightChildRef.current && rightChildRef.current.triggerFireworks) {
      if (onRecordRender) onRecordRender('Parent -> Right Child Handle -> Blue Fireworks on Parent');
      if (onRecordMutation) {
        onRecordMutation({
          type: 'attribute',
          target: 'Box 1',
          description: 'Box 1 (Parent) invoked Right Child ref handle: played Blue Fireworks on Parent'
        });
      }
      rightChildRef.current.triggerFireworks();
    }
  };

  useEffect(() => {
    return () => {
      if (parentGlowTimerRef.current) clearTimeout(parentGlowTimerRef.current);
      if (parentFireworksTimerRef.current) clearTimeout(parentFireworksTimerRef.current);
    };
  }, []);

  return (
    <div className="imperative-playground-root" id="imperative-playground">
      {/* Top: Box 1 (Parent) */}
      <div className="imperative-parent-wrapper">
        <ParentImperativeBox
          isGlowing={isParentGlowing}
          isImperativeOn={isImperativeOn}
          fireworksActive={parentFireworksActive}
          fireworksColor={parentFireworksColor}
          onGlow={handleParentGlow}
          onTriggerRedFireworks={handleTriggerRedFireworksFromParent}
          onTriggerBlueFireworks={handleTriggerBlueFireworksFromParent}
        />
      </div>

      {/* Center: Connecting Wire with useImperativeHandle Toggle */}
      <ImperativeForkWire
        isImperativeOn={isImperativeOn}
        onToggleImperative={handleToggleBridge}
      />

      {/* Bottom: Children Row (Box 2 & Box 3) */}
      <div className="imperative-children-row">
        <ChildFireworksBox
          ref={leftChildRef}
          boxNumber={2}
          childSide="left"
          fireworkColor="red"
          isImperativeOn={isImperativeOn}
          onPlayOnParent={handlePlayFireworksOnParent}
          onRecordRender={onRecordRender}
          onRecordMutation={onRecordMutation}
        />

        <ChildFireworksBox
          ref={rightChildRef}
          boxNumber={3}
          childSide="right"
          fireworkColor="blue"
          isImperativeOn={isImperativeOn}
          onPlayOnParent={handlePlayFireworksOnParent}
          onRecordRender={onRecordRender}
          onRecordMutation={onRecordMutation}
        />
      </div>
    </div>
  );
}

/* =========================================================================
   USEFORMSTATUS PLAYGROUND: FORM, CHILD SUBMIT BUTTON & SUBMISSIONS BOX
   ========================================================================= */

export function UseImperativeHandleSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useImperativeHandle" onReset={onReset} isFullArena={true}>
      <UseImperativeHandleInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
      />
    </SandboxContainer>
  );
}
