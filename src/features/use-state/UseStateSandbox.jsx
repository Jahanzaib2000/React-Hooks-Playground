import { StateCounterView } from './StateCounterView.jsx';
import { INITIAL_TEXT, STATE_TIMING_MS } from '../../constants/use-state.js';
import { useState, useRef } from 'react';

export function UseStateSandbox({
  activeLessonId,
  _selectedTokenId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [count, setCount] = useState(0);
  const [textValue, setTextValue] = useState(INITIAL_TEXT);
  const [constPopupError, setConstPopupError] = useState(false);
  const constPopupTimerRef = useRef(null);
  const [isRenderFlashing, setIsRenderFlashing] = useState(false);
  const [renderCount, setRenderCount] = useState(1);

  const triggerFlash = () => {
    setIsRenderFlashing(false);
    requestAnimationFrame(() => {
      setIsRenderFlashing(true);
      setTimeout(() => setIsRenderFlashing(false), STATE_TIMING_MS.renderFlash);
    });
  };

  const handleSnapshotClick = () => {
    const nextCount = count + 1;
    const nextRender = renderCount + 1;
    const prevCount = count;
    setCount(nextCount);
    setRenderCount(nextRender);
    triggerFlash();

    onRecordRender?.({
      renderNumber: nextRender,
      trigger: 'Button Click (+1 Increment)',
      prevState: { count: prevCount },
      currentState: { count: nextCount }
    });

    onRecordTrace?.({
      trigger: { label: 'State Setter: setCount(count + 1)', type: 'User Interaction' },
      componentName: 'Counter',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useState',
          status: `count: ${nextCount}`,
          actionRequired: false,
          prevState: prevCount,
          nextState: nextCount
        }
      ],
      commit: {
        diffSummary: `Updated count from ${prevCount} to ${nextCount}`,
        mutationsCount: 1
      },
      effects: null
    });

    onRecordMutation?.({
      id: `mut-${Date.now()}`,
      target: '#count-value',
      type: 'TextContent',
      prevValue: `${prevCount}`,
      nextValue: `${nextCount}`,
      summary: `Count text updated to ${nextCount}`
    });
  };

  const handleConstIncrementClick = () => {
    setConstPopupError(true);
    if (constPopupTimerRef.current) clearTimeout(constPopupTimerRef.current);
    constPopupTimerRef.current = setTimeout(() => {
      setConstPopupError(false);
    }, STATE_TIMING_MS.constErrorPopup);

    onRecordRender?.({
      renderNumber: renderCount,
      trigger: 'Button Click (+1 Increment on const count = 0)',
      prevState: { count: 0, isConst: true },
      currentState: { count: 0, isConst: true }
    });

    onRecordTrace?.({
      trigger: { label: 'TypeError: Assignment to constant variable', type: 'JavaScript Error' },
      componentName: 'ConstCounter',
      renderNumber: renderCount,
      hooks: [
        {
          slot: 0,
          name: 'const variable',
          status: 'count: 0 (Immutable constant)',
          actionRequired: false,
          prevState: '0',
          nextState: '0'
        }
      ],
      commit: {
        diffSummary: 'No DOM mutations (Reassignment threw TypeError before render)',
        mutationsCount: 0
      },
      effects: null
    });
  };

  const handleTextStateChange = (e) => {
    const nextVal = e.target.value;
    const prevVal = textValue;
    const nextRender = renderCount + 1;
    setTextValue(nextVal);
    setRenderCount(nextRender);
    triggerFlash();

    onRecordRender?.({
      renderNumber: nextRender,
      trigger: `Input Change: "${nextVal}"`,
      prevState: { text: prevVal },
      currentState: { text: nextVal }
    });

    onRecordTrace?.({
      trigger: { label: `State Setter: setText("${nextVal}")`, type: 'Input Interaction' },
      componentName: 'TextInputDemo',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useState',
          status: `text: "${nextVal}"`,
          actionRequired: false,
          prevState: `"${prevVal}"`,
          nextState: `"${nextVal}"`
        }
      ],
      commit: {
        diffSummary: `Updated text state to "${nextVal}"`,
        mutationsCount: 1
      },
      effects: null
    });

    onRecordMutation?.({
      id: `mut-${Date.now()}`,
      target: '#text-state-display',
      type: 'TextContent',
      prevValue: prevVal,
      nextValue: nextVal,
      summary: `Text display updated to "${nextVal}"`
    });
  };

  const handleReset = () => {
    setCount(0);
    setTextValue(INITIAL_TEXT);
    setConstPopupError(false);
    if (constPopupTimerRef.current) clearTimeout(constPopupTimerRef.current);
    if (onReset) onReset();
  };

  return (
    <StateCounterView
      handleReset={handleReset}
      isRenderFlashing={isRenderFlashing}
      activeLessonId={activeLessonId}
      count={count}
      handleSnapshotClick={handleSnapshotClick}
      constPopupError={constPopupError}
      setConstPopupError={setConstPopupError}
      handleConstIncrementClick={handleConstIncrementClick}
      textValue={textValue}
      handleTextStateChange={handleTextStateChange}
    />
  );
}
