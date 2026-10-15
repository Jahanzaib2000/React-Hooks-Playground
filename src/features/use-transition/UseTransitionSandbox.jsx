import { TransitionCalculationView } from './TransitionCalculationView.jsx';
import { TRANSITION_TIMING_MS } from '../../constants/use-transition.js';
import { useState, useRef, useTransition } from 'react';
import { SandboxContainer } from '../../shared/components';
import {
  buildTransitionClickInfo
} from './helpers.js';

function UseTransitionInnerSandbox({
  isTransitionOn,
  onToggleTransition,
  isHeavyRunning,
  onHeavyCompute,
  btn1Active,
  onToggleBtn1,
  btn2Active,
  onToggleBtn2
}) {
  const isFrozen = isHeavyRunning && !isTransitionOn;

  return (
    <TransitionCalculationView
      isTransitionOn={isTransitionOn}
      onToggleTransition={onToggleTransition}
      isHeavyRunning={isHeavyRunning}
      onHeavyCompute={onHeavyCompute}
      btn1Active={btn1Active}
      isFrozen={isFrozen}
      onToggleBtn1={onToggleBtn1}
      btn2Active={btn2Active}
      onToggleBtn2={onToggleBtn2}
    />
  );
}

export function UseTransitionSandbox({
  _activeLessonId,
  selectedTokenId,
  onSelectToken,
  onRecordRender,
  onRecordTrace,
  _onRecordMutation,
  onReset
}) {
  const [renderCount, setRenderCount] = useState(1);
  const [, startTransitionHook] = useTransition();
  const [isTransitionOn, setIsTransitionOn] = useState(() => selectedTokenId === 'use-transition');
  const [isHeavyRunning, setIsHeavyRunning] = useState(false);
  const [btn1Active, setBtn1Active] = useState(false);
  const [btn2Active, setBtn2Active] = useState(false);
  const heavyTimerRef = useRef(null);
  const btn1TimerRef = useRef(null);
  const btn2TimerRef = useRef(null);

    const handleTransitionToggle = () => {
    const nextVal = !isTransitionOn;
    setIsTransitionOn(nextVal);
    if (onSelectToken) {
      onSelectToken(nextVal ? 'use-transition' : 'blocking-sync');
    }
  };

  const handleHeavyCompute = () => {
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    if (heavyTimerRef.current) clearTimeout(heavyTimerRef.current);

    if (isTransitionOn) {
      // Concurrent startTransition: wraps the state change
      startTransitionHook(() => {
        setIsHeavyRunning(true);
      });

      heavyTimerRef.current = setTimeout(() => {
        startTransitionHook(() => {
          setIsHeavyRunning(false);
        });
      }, TRANSITION_TIMING_MS.heavyComputation);
    } else {
      // Blocking mode: freezes Buttons 1 & 2 for 10s
      setIsHeavyRunning(true);
      heavyTimerRef.current = setTimeout(() => {
        setIsHeavyRunning(false);
      }, TRANSITION_TIMING_MS.heavyComputation);
    }

    onRecordTrace({
      trigger: { label: 'Click: Heavy Computation', type: isTransitionOn ? 'Transition Action' : 'Blocking Action' },
      componentName: 'ConcurrencyDemo',
      renderNumber: nextRender,
      hooks: [
        { slot: 0, name: 'useTransition', status: isTransitionOn ? 'startTransition (Concurrent)' : 'Bypassed (Blocking)' },
        { slot: 1, name: 'useState', status: 'isHeavyRunning: true (Cyan for 10s)' }
      ],
      commit: {
        diffSummary: isTransitionOn
          ? 'Heavy Computation running in transition lane (Buttons 1 & 2 remain responsive)'
          : 'Heavy Computation running in blocking mode (Buttons 1 & 2 are FROZEN for 10s)',
        mutationsCount: 1
      },
      effects: null,
      transitionInfo: buildTransitionClickInfo({
        action: 'Heavy Computation Clicked',
        isTransitionOn,
        isHeavyRunning: true,
        btn1Active,
        btn2Active,
        strategy: selectedTokenId
      })
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Click: Heavy Computation',
      prevState: { isHeavyRunning: false },
      currentState: { isHeavyRunning: true, isTransitionOn },
      transitionInfo: buildTransitionClickInfo({
        action: 'Heavy Computation Clicked',
        isTransitionOn,
        isHeavyRunning: true,
        btn1Active,
        btn2Active,
        strategy: selectedTokenId
      })
    });
  };

  const handleToggleBtn1 = () => {
    if (!isTransitionOn && isHeavyRunning) return; // Frozen!
    if (btn1TimerRef.current) clearTimeout(btn1TimerRef.current);

    setBtn1Active(true);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Click: Button 1 ➔ LightBlue',
      prevState: { btn1Active },
      currentState: { btn1Active: true },
      transitionInfo: buildTransitionClickInfo({
        action: 'Button 1 Clicked',
        isTransitionOn,
        isHeavyRunning,
        btn1Active: true,
        btn2Active,
        strategy: selectedTokenId
      })
    });

    btn1TimerRef.current = setTimeout(() => {
      setBtn1Active(false);
    }, TRANSITION_TIMING_MS.buttonActive);
  };

  const handleToggleBtn2 = () => {
    if (!isTransitionOn && isHeavyRunning) return; // Frozen!
    if (btn2TimerRef.current) clearTimeout(btn2TimerRef.current);

    setBtn2Active(true);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Click: Button 2 ➔ LightBlue',
      prevState: { btn2Active },
      currentState: { btn2Active: true },
      transitionInfo: buildTransitionClickInfo({
        action: 'Button 2 Clicked',
        isTransitionOn,
        isHeavyRunning,
        btn1Active,
        btn2Active: true,
        strategy: selectedTokenId
      })
    });

    btn2TimerRef.current = setTimeout(() => {
      setBtn2Active(false);
    }, TRANSITION_TIMING_MS.buttonActive);
  };

  // ==========================================
  // useRef Handlers

  const handleReset = () => {
    setIsTransitionOn(selectedTokenId === 'use-transition');
    setIsHeavyRunning(false);
    setBtn1Active(false);
    setBtn2Active(false);
    if (heavyTimerRef.current) clearTimeout(heavyTimerRef.current);
    if (btn1TimerRef.current) clearTimeout(btn1TimerRef.current);
    if (btn2TimerRef.current) clearTimeout(btn2TimerRef.current);
    if (onReset) onReset();
  };

  return (
    <SandboxContainer hookName="useTransition" onReset={handleReset}>
      <UseTransitionInnerSandbox
        isTransitionOn={isTransitionOn}
        onToggleTransition={handleTransitionToggle}
        isHeavyRunning={isHeavyRunning}
        onHeavyCompute={handleHeavyCompute}
        btn1Active={btn1Active}
        onToggleBtn1={handleToggleBtn1}
        btn2Active={btn2Active}
        onToggleBtn2={handleToggleBtn2}
      />
    </SandboxContainer>
  );
}
