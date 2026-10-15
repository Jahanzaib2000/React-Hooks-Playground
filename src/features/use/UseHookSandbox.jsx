import { UseHookView } from './UseHookView.jsx';
import { TIME_PHASES, USE_TIMING_MS } from '../../constants/use.js';
import { useState, useEffect } from 'react';
import { SandboxContainer } from '../../shared/components';

function UseHookInnerSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play interval
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, USE_TIMING_MS.playbackStep);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync telemetry whenever currentStep changes
  useEffect(() => {
    const phase = TIME_PHASES[currentStep];

    if (onRecordRender) {
      const renderCountTop = currentStep >= 4 ? 2 : (currentStep >= 1 ? 1 : 0);
      const renderCountBottom = currentStep >= 4 ? 1 : 0;
      onRecordRender({
        renderNumber: currentStep + 1,
        trigger: `Time ${phase.label}: ${phase.title}`,
        prevState: currentStep > 0 ? { phase: TIME_PHASES[currentStep - 1].title } : null,
        currentState: {
          step: currentStep,
          phase: phase.title,
          rendersWithoutUse: renderCountTop,
          rendersWithUse: renderCountBottom
        }
      });
    }

    if (onRecordMutation) {
      if (currentStep === 1) {
        onRecordMutation({
          type: 'DOM Commit (Top Lane)',
          target: '<ProfileWithoutUse />',
          summary: 'Render #1 committed: Shows empty or loading state (layout shift flash)'
        });
      } else if (currentStep === 2) {
        onRecordMutation({
          type: 'Suspense Pause (Bottom Lane)',
          target: '<ProfileWithUse />',
          summary: 'use pauses the render — Suspense boundary activated, 0 DOM layout shifts'
        });
      } else if (currentStep === 4) {
        onRecordMutation({
          type: 'DOM Resolution (Both)',
          target: 'Profile Component',
          summary: 'Top: Re-render #2 commits data | Bottom: Single pass finishes with data'
        });
      }
    }

    if (onRecordTrace) {
      onRecordTrace({
        trigger: { label: `Time ${phase.label}: ${phase.title}`, type: 'Timeline Step' },
        componentName: 'UseComparisonTimeline',
        renderNumber: currentStep + 1,
        hooks: [
          {
            slot: 0,
            name: 'Without use',
            status: `${phase.topBlock} (${currentStep >= 4 ? '2 Renders committed' : (currentStep >= 1 ? '1 Render committed' : 'Mounting')})`,
            actionRequired: currentStep === 1 || currentStep === 4
          },
          {
            slot: 1,
            name: 'With use',
            status: `${phase.bottomBlock} (${currentStep === 2 || currentStep === 3 ? 'Paused via Suspense' : (currentStep === 4 ? '1 Render direct' : 'Running')})`,
            actionRequired: currentStep === 1 || currentStep === 2 || currentStep === 4
          }
        ],
        commit: {
          diffSummary: `Step ${currentStep + 1}/5: ${phase.desc}`,
          mutationsCount: currentStep === 1 ? 1 : (currentStep === 4 ? 2 : 0)
        },
        effects: currentStep >= 2 ? { type: 'Effect / Suspense Sync', status: phase.topBlock } : null
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleStepForward = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep >= 4) {
        setCurrentStep(0);
      }
      setIsPlaying(true);
    }
  };

  const handleResetTimeline = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (onReset) onReset();
  };

  return (
    <UseHookView
      handleTogglePlay={handleTogglePlay}
      isPlaying={isPlaying}
      handleStepBack={handleStepBack}
      currentStep={currentStep}
      handleStepForward={handleStepForward}
      handleResetTimeline={handleResetTimeline}
      setIsPlaying={setIsPlaying}
      setCurrentStep={setCurrentStep}
    />
  );
}

// ==========================================
// useDebugValue: DevTools Custom Hook Labeling
// ==========================================

export function UseHookSandbox({
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  return (
    <SandboxContainer hookName="use" onReset={onReset} isFullArena={true}>
      <UseHookInnerSandbox
        onRecordRender={onRecordRender}
        onRecordTrace={onRecordTrace}
        onRecordMutation={onRecordMutation}
        onReset={onReset}
      />
    </SandboxContainer>
  );
}
