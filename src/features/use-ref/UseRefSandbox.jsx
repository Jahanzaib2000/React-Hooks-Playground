import { forwardRef, useState, useRef } from 'react';
import { SandboxContainer } from '../../shared/components';
import { buildRefClickInfo } from './helpers.js';

const LightBox = forwardRef(function LightBox({ boxNumber, isOn }, ref) {
  return (
    <div className="ref-box-card ref-light-box" id={`box-${boxNumber}`}>
      <div className="ref-box-header">Box {boxNumber}</div>
      <div className="light-orb-container">
        <div
          ref={ref}
          className={`light-orb ${isOn ? 'is-on' : 'is-off'}`}
          aria-label={`Box ${boxNumber} Light: ${isOn ? 'ON' : 'OFF'}`}
        />
      </div>
    </div>
  );
});

function UseRefInnerSandbox({
  box2LightOn,
  box3LightOn,
  onPressBtn1,
  onPressBtn2,
  box2Ref,
  box3Ref
}) {
  return (
    <div className="ref-playground-root">
      {/* Box 1: Controller */}
      <div className="ref-box-card ref-controller-box" id="box-1">
        <div className="ref-box-header">Box 1</div>
        <div className="ref-buttons-row">
          <div className="ref-btn-column">
            <button
              type="button"
              className="ref-action-btn"
              onClick={onPressBtn1}
            >
              Button 1
            </button>
            <span className="ref-btn-subtext">this references component in box 2</span>
          </div>

          <div className="ref-btn-column">
            <button
              type="button"
              className="ref-action-btn"
              onClick={onPressBtn2}
            >
              Button 2
            </button>
            <span className="ref-btn-subtext">this references component in box 3</span>
          </div>
        </div>
      </div>

      {/* Box 2 & Box 3: Target Light Components */}
      <div className="ref-targets-row">
        <LightBox ref={box2Ref} boxNumber={2} isOn={box2LightOn} />
        <LightBox ref={box3Ref} boxNumber={3} isOn={box3LightOn} />
      </div>
    </div>
  );
}

// ==========================================
// useReducer Sandbox: Shopping Cart Arena
// Box 1: Store Catalog
// Box 2: Shopping Cart
// ==========================================

export function UseRefSandbox({
  _activeLessonId,
  selectedTokenId,
  onRecordRender,
  onRecordTrace,
  _onRecordMutation,
  onReset
}) {
  const [renderCount, setRenderCount] = useState(1);
  const [box2LightOn, setBox2LightOn] = useState(false);
  const [box3LightOn, setBox3LightOn] = useState(false);
  const box2ElementRef = useRef(null);
  const box3ElementRef = useRef(null);

    const handlePressRefBtn1 = () => {
    const nextVal = !box2LightOn;
    setBox2LightOn(nextVal);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    onRecordRender({
      renderNumber: nextRender,
      trigger: `Click: Button 1 (Box 1) ➔ Box 2 Light ${nextVal ? 'ON' : 'OFF'}`,
      prevState: { box2LightOn },
      currentState: { box2LightOn: nextVal, box3LightOn },
      refInfo: buildRefClickInfo({
        action: `Toggled Box 2 Light ${nextVal ? 'ON' : 'OFF'}`,
        targetBox: 2,
        isBox2On: nextVal,
        isBox3On: box3LightOn,
        strategy: selectedTokenId
      })
    });

    onRecordTrace({
      trigger: { label: 'Click: Button 1 (Box 1)', type: 'Ref Invocation' },
      componentName: 'RefController',
      renderNumber: nextRender,
      hooks: [
        { slot: 0, name: 'useRef', status: `box2Ref.current ➔ Box 2 Element (Light: ${nextVal ? 'ON' : 'OFF'})` },
        { slot: 1, name: 'useRef', status: 'box3Ref.current ➔ Box 3 Element' }
      ],
      commit: {
        diffSummary: `Box 1 Button 1 referenced Box 2: toggled light ${nextVal ? 'ON' : 'OFF'}`,
        mutationsCount: 1
      },
      effects: null,
      refInfo: buildRefClickInfo({
        action: `Toggled Box 2 Light ${nextVal ? 'ON' : 'OFF'}`,
        targetBox: 2,
        isBox2On: nextVal,
        isBox3On: box3LightOn,
        strategy: selectedTokenId
      })
    });
  };

  const handlePressRefBtn2 = () => {
    const nextVal = !box3LightOn;
    setBox3LightOn(nextVal);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    onRecordRender({
      renderNumber: nextRender,
      trigger: `Click: Button 2 (Box 1) ➔ Box 3 Light ${nextVal ? 'ON' : 'OFF'}`,
      prevState: { box3LightOn },
      currentState: { box2LightOn, box3LightOn: nextVal },
      refInfo: buildRefClickInfo({
        action: `Toggled Box 3 Light ${nextVal ? 'ON' : 'OFF'}`,
        targetBox: 3,
        isBox2On: box2LightOn,
        isBox3On: nextVal,
        strategy: selectedTokenId
      })
    });

    onRecordTrace({
      trigger: { label: 'Click: Button 2 (Box 1)', type: 'Ref Invocation' },
      componentName: 'RefController',
      renderNumber: nextRender,
      hooks: [
        { slot: 0, name: 'useRef', status: 'box2Ref.current ➔ Box 2 Element' },
        { slot: 1, name: 'useRef', status: `box3Ref.current ➔ Box 3 Element (Light: ${nextVal ? 'ON' : 'OFF'})` }
      ],
      commit: {
        diffSummary: `Box 1 Button 2 referenced Box 3: toggled light ${nextVal ? 'ON' : 'OFF'}`,
        mutationsCount: 1
      },
      effects: null,
      refInfo: buildRefClickInfo({
        action: `Toggled Box 3 Light ${nextVal ? 'ON' : 'OFF'}`,
        targetBox: 3,
        isBox2On: box2LightOn,
        isBox3On: nextVal,
        strategy: selectedTokenId
      })
    });
  };

  // ==========================================
  // useReducer Handlers

  const handleReset = () => {
    setBox2LightOn(false);
    setBox3LightOn(false);
    if (onReset) onReset();
  };

  return (
    <SandboxContainer hookName="useRef" onReset={handleReset} isFullArena={true}>
      <UseRefInnerSandbox
        box2LightOn={box2LightOn}
        box3LightOn={box3LightOn}
        onPressBtn1={handlePressRefBtn1}
        onPressBtn2={handlePressRefBtn2}
        box2Ref={box2ElementRef}
        box3Ref={box3ElementRef}
      />
    </SandboxContainer>
  );
}
