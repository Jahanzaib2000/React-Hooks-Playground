import { InsertionEffectView } from './InsertionEffectView.jsx';
import { INSERTION_TIMING_MS } from '../../constants/use-insertion-effect.js';
import { useState, useEffect, useRef, useInsertionEffect } from 'react';
import { SandboxContainer } from '../../shared/components';
import insertionThemeCss from './insertionTheme.css?raw';

function UseInsertionEffectInnerSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [isApplied, setIsApplied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: idle, 1: React Renders, 2: useInsertionEffect, 3: React updates the DOM, 4: Browser Paints, 5: complete
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Synchronous pre-DOM mutation style injection
  useInsertionEffect(() => {
    if (!isApplied) {
      const existing = document.getElementById('insertion-theme-style-tag');
      if (existing) existing.remove();
      return;
    }

    let styleTag = document.getElementById('insertion-theme-style-tag');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'insertion-theme-style-tag';
      styleTag.textContent = insertionThemeCss;
      document.head.appendChild(styleTag);
    }

    return () => {
      const el = document.getElementById('insertion-theme-style-tag');
      if (el) el.remove();
    };
  }, [isApplied]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      const el = document.getElementById('insertion-theme-style-tag');
      if (el) el.remove();
    };
  }, []);

  const handleTriggerInsertion = () => {
    if (isModalOpen) return;
    clearAllTimeouts();
    setIsApplied(false); // Ensure default dark theme & sans-serif font initially
    setIsModalOpen(true);
    setActiveStep(1); // 0s - 1s: Step 1 (React Renders)

    if (onRecordRender) onRecordRender('useInsertionEffect Flow: Step 1 (React Renders)');
    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: 'React Renders', type: 'Virtual DOM Calculation' },
        componentName: 'InsertionSandbox',
        renderNumber: 2,
        hooks: [
          { slot: 0, name: 'useInsertionEffect', status: 'Pre-DOM Queue', actionRequired: false }
        ],
        commit: { diffSummary: 'Component rendered in memory', mutationsCount: 1 },
        effects: null
      });
    }

    // Step 2: useInsertionEffect (1.0s - 2.0s)
    const t1 = setTimeout(() => {
      setActiveStep(2);
      if (onRecordTrace) {
        onRecordTrace({
          trigger: { label: 'useInsertionEffect', type: 'Sync Style Insertion' },
          componentName: 'InsertionSandbox',
          renderNumber: 2,
          hooks: [
            { slot: 0, name: 'useInsertionEffect', status: 'Injected insertionTheme.css into <head>', actionRequired: false }
          ],
          commit: { diffSummary: 'Injected stylesheet <style id="insertion-theme-style-tag">', mutationsCount: 1 },
          effects: null
        });
      }
    }, INSERTION_TIMING_MS.insertionStep);

    // Step 3: React updates the DOM (2.0s - 3.0s)
    const t2 = setTimeout(() => {
      setActiveStep(3);
      if (onRecordMutation) {
        onRecordMutation({
          type: 'attributes',
          target: '.insertion-theme-active',
          description: 'React applied class to DOM elements'
        });
      }
    }, INSERTION_TIMING_MS.domStep);

    // Step 4: Browser Paints (3.0s - 4.0s) - Font and color change after pop-up goes to browser paints!
    const t3 = setTimeout(() => {
      setActiveStep(4);
      setIsApplied(true); // Font to serif and background to pure white change here!
      if (onRecordRender) onRecordRender('useInsertionEffect Flow: Step 4 (Browser Paints)');
    }, INSERTION_TIMING_MS.paintStep);

    // Animation finishes at 4.0s: mark complete
    const t4 = setTimeout(() => {
      setActiveStep(5);
    }, INSERTION_TIMING_MS.completeStep);

    // Keep pop-up visible for 3 seconds after the animation finishes (4.0s + 3.0s = 7.0s)
    const t5 = setTimeout(() => {
      setIsModalOpen(false);
      setActiveStep(0);
    }, INSERTION_TIMING_MS.closeModal);

    timeoutsRef.current = [t1, t2, t3, t4, t5];
  };

  const handleResetSandbox = () => {
    clearAllTimeouts();
    setIsApplied(false);
    setActiveStep(0);
    setIsModalOpen(false);
    const el = document.getElementById('insertion-theme-style-tag');
    if (el) el.remove();
    if (onReset) onReset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <InsertionEffectView
      handleTriggerInsertion={handleTriggerInsertion}
      isModalOpen={isModalOpen}
      handleResetSandbox={handleResetSandbox}
      isApplied={isApplied}
      handleCloseModal={handleCloseModal}
      activeStep={activeStep}
    />
  );
}

export function UseInsertionEffectSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="useInsertionEffect" onReset={onReset} isFullArena={true}>
      <UseInsertionEffectInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
        onReset={onReset}
      />
    </SandboxContainer>
  );
}
