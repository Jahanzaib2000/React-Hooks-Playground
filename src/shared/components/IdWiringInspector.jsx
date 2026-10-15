import { inspectIdWiring } from './inspectIdWiring.js';
import { IdWiringView } from './IdWiringView.jsx';
import { ID_TIMING_MS } from '../../constants/use-id.js';
import { useState, useEffect, useRef, useCallback } from 'react';

// Color & Shape themes for instances — ensures accessibility without color vision

export function IdWiringInspector({ activeLessonId, selectedTokenId }) {
  const [instances, setInstances] = useState([]);
  const [pulseState, setPulseState] = useState(null); // { instanceIdx, activeStep }
  const [focusProof, setFocusProof] = useState(null); // { instanceIdx, success, message, isCollision }
  const [hoveredAttr, setHoveredAttr] = useState(null); // { instanceIdx, attrKey }
  const pulseTimerRef = useRef(null);

  // Read REAL live DOM elements from the sandbox
  const inspectLiveDom = useCallback(() => inspectIdWiring(activeLessonId, setInstances), [activeLessonId]);

  // Set up Live DOM observer & focus listeners
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      inspectLiveDom();
    });

    // Listen to focus changes across the window
    const handleFocusChange = () => {
      inspectLiveDom();
    };

    window.addEventListener('focusin', handleFocusChange);
    window.addEventListener('focusout', handleFocusChange);

    // Observe DOM mutations in sandbox
    const observer = new MutationObserver(() => {
      inspectLiveDom();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('focusin', handleFocusChange);
      window.removeEventListener('focusout', handleFocusChange);
      observer.disconnect();
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, [inspectLiveDom, selectedTokenId]);

  // Sequential pulse along wires in browser execution order
  const triggerHubPulse = (instanceIdx) => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);

    const inst = instances[instanceIdx];
    if (!inst) return;

    const totalSteps = inst.attributes.length;
    let currentStep = 1;

    setPulseState({ instanceIdx, activeStep: 1 });

    const advanceStep = () => {
      currentStep += 1;
      if (currentStep <= totalSteps) {
        setPulseState({ instanceIdx, activeStep: currentStep });
        pulseTimerRef.current = setTimeout(advanceStep, ID_TIMING_MS.pulseStep);
      } else {
        pulseTimerRef.current = setTimeout(() => {
          setPulseState(null);
        }, ID_TIMING_MS.pulseFinish);
      }
    };

    pulseTimerRef.current = setTimeout(advanceStep, ID_TIMING_MS.pulseStep);
  };

  // Pulse all hubs simultaneously to demonstrate separate frequencies
  const triggerAllHubsPulse = () => {
    instances.forEach((_, idx) => {
      setTimeout(() => triggerHubPulse(idx), idx * ID_TIMING_MS.hubStagger);
    });
  };

  // The Proof Step: clicking real label element to test real browser focus movement
  const handleProofClickLabel = (instanceIdx) => {
    const inst = instances[instanceIdx];
    if (!inst) return;

    if (inst.labelEl) {
      // Actually click the DOM label
      inst.labelEl.click();

      // Check where browser moved focus
      setTimeout(() => {
        const activeEl = document.activeElement;
        const isTargetFocused = activeEl === inst.inputEl;

        // Check if collision occurred (e.g. hardcoded ID focused the first input)
        const allInputs = Array.from(document.querySelectorAll('.uid-form-input, .uid-a11y-input'));
        const firstInput = allInputs[0];
        const isCollision = activeEl === firstInput && inst.inputEl !== firstInput;

        if (isTargetFocused) {
          setFocusProof({
            instanceIdx,
            success: true,
            isCollision: false,
            message: `✓ REAL BROWSER PROOF: Clicking "${inst.name}" label activated htmlFor="${inst.attributes[0].value}" and focused its real <input>! Notice other cards did not react.`
          });
        } else if (isCollision) {
          setFocusProof({
            instanceIdx,
            success: false,
            isCollision: true,
            message: `⚠️ COLLISION DETECTED! Clicking "${inst.name}" label focused the FIRST input in DOM because both share id="${inst.hubId}"! This proves why unique IDs are mandatory.`
          });
        } else if (selectedTokenId === 'no-id') {
          setFocusProof({
            instanceIdx,
            success: false,
            isCollision: false,
            message: `⚠️ INACCESSIBLE: Label has no htmlFor attribute, so clicking the label cannot move focus to the input.`
          });
        } else {
          setFocusProof({
            instanceIdx,
            success: isTargetFocused,
            isCollision: false,
            message: `Label clicked. Browser focus status: ${activeEl?.tagName || 'None'}`
          });
        }

        // Auto-clear message after 5 seconds
        setTimeout(() => setFocusProof(null), ID_TIMING_MS.proofNotice);
      }, ID_TIMING_MS.focusCheck);
    }
  };

  return (
    <IdWiringView
      triggerAllHubsPulse={triggerAllHubsPulse}
      focusProof={focusProof}
      setFocusProof={setFocusProof}
      instances={instances}
      pulseState={pulseState}
      triggerHubPulse={triggerHubPulse}
      hoveredAttr={hoveredAttr}
      setHoveredAttr={setHoveredAttr}
      handleProofClickLabel={handleProofClickLabel}
    />
  );
}
