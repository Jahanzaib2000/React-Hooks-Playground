import { MIN_INSTANCE_COUNT, INITIAL_INSTANCE_COUNT } from '../../constants/use-id.js';
import { useState } from 'react';
import { SandboxContainer } from '../../shared/components';
import { buildAddInstanceUseIdInfo, buildRemoveInstanceUseIdInfo, buildA11yToggleErrorUseIdInfo, buildA11yLabelClickUseIdInfo } from './helpers.js';
import { UseIdBasicsSandbox } from './IdBasicsSandbox.jsx';
import { UseIdA11ySandbox } from './IdA11ySandbox.jsx';

export function UseIdSandbox({
  activeLessonId,
  selectedTokenId,
  onRecordRender,
  onRecordTrace,
  onRecordMutation,
  onReset
}) {
  const [instanceCount, setInstanceCount] = useState(INITIAL_INSTANCE_COUNT);
  const [showError, setShowError] = useState(false);
  const [labelClicked, setLabelClicked] = useState(false);
  const [renderCount, setRenderCount] = useState(1);

    const handleAddInstance = () => {
    const nextCount = instanceCount + 1;
    setInstanceCount(nextCount);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const useIdInfo = buildAddInstanceUseIdInfo(instanceCount, nextCount, selectedTokenId);

    onRecordMutation({
      type: 'childList',
      targetSelector: 'div#instance-container',
      oldValue: `${instanceCount} instances`,
      newValue: `${nextCount} instances (${useIdInfo.targetInput}: ${useIdInfo.createdId})`,
      timestamp: Date.now()
    });

    onRecordTrace({
      trigger: { label: 'Click: "Add Instance"', type: 'User Click' },
      componentName: 'FormField',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useId',
          status: `Created ${useIdInfo.createdId} for ${useIdInfo.targetInput}`,
          prevState: `${instanceCount} instances`,
          actionLabel: `Mounted new <FormField /> with ID: ${useIdInfo.createdId}`,
          nextState: `${nextCount} instances`,
          bailedOut: false
        }
      ],
      vdom: { elements: [{ tag: 'div', content: `${useIdInfo.targetInput} mounted (${useIdInfo.createdId})`, isDirty: true }] },
      commit: { diffSummary: `Added ${useIdInfo.targetInput} with ID ${useIdInfo.createdId}`, mutationsCount: 1 },
      effects: { ran: false, cleanupRan: false, description: 'useId has no effects', closureValues: {} }
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Add Instance',
      prevState: { instances: instanceCount },
      currentState: { instances: nextCount },
      useIdInfo
    });
  };

  const handleRemoveInstance = () => {
    if (instanceCount <= MIN_INSTANCE_COUNT) return;
    const nextCount = instanceCount - 1;
    setInstanceCount(nextCount);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const useIdInfo = buildRemoveInstanceUseIdInfo(instanceCount, nextCount, selectedTokenId);

    onRecordMutation({
      type: 'childList',
      targetSelector: 'div#instance-container',
      oldValue: `${instanceCount} instances`,
      newValue: `${nextCount} instances`,
      timestamp: Date.now()
    });

    onRecordTrace({
      trigger: { label: 'Click: "Remove Last"', type: 'User Click' },
      componentName: 'FormField',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useId',
          status: `Unmounted ${useIdInfo.targetInput} (${useIdInfo.createdId})`,
          prevState: `${instanceCount} instances`,
          actionLabel: `Unmounted <FormField />`,
          nextState: `${nextCount} instances`,
          bailedOut: false
        }
      ],
      vdom: { elements: [{ tag: 'div', content: `${useIdInfo.targetInput} removed`, isDirty: true }] },
      commit: { diffSummary: `Removed ${useIdInfo.targetInput} (${useIdInfo.createdId})`, mutationsCount: 1 },
      effects: { ran: false, cleanupRan: false, description: 'Cleanup: useId discarded on unmount', closureValues: {} }
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Remove Instance',
      prevState: { instances: instanceCount },
      currentState: { instances: nextCount },
      useIdInfo
    });
  };

  // ==========================================
  // useId: Lesson 2 (Accessible Forms)
  // ==========================================
  const handleToggleError = () => {
    const nextShow = !showError;
    setShowError(nextShow);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const useIdInfo = buildA11yToggleErrorUseIdInfo(nextShow, selectedTokenId);

    onRecordMutation({
      type: 'attributes',
      targetSelector: 'span#field-error',
      oldValue: showError ? 'visible' : 'hidden',
      newValue: nextShow ? 'visible (:r0:-error linked)' : 'hidden',
      timestamp: Date.now()
    });

    onRecordTrace({
      trigger: { label: 'Click: "Toggle Error"', type: 'User Click' },
      componentName: 'AccessibleField',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useId',
          status: nextShow ? 'Created :r0:-error for Email aria-describedby' : 'Stable :r0: retained',
          prevState: 'id',
          actionLabel: nextShow ? 'Derived :r0:-error linked to input aria-describedby' : 'ID unchanged — useId is stable across renders',
          nextState: 'id',
          bailedOut: !nextShow
        }
      ],
      vdom: { elements: [{ tag: 'span', content: nextShow ? 'Error visible (:r0:-error)' : 'Error hidden', isDirty: true }] },
      commit: { diffSummary: nextShow ? 'Error message shown, :r0:-error linked to input aria-describedby' : 'Error message hidden, unlinked from input', mutationsCount: 1 },
      effects: { ran: false, cleanupRan: false, description: 'No effects', closureValues: {} }
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: nextShow ? 'Show Error' : 'Hide Error',
      prevState: { showError: showError },
      currentState: { showError: nextShow },
      useIdInfo
    });
  };

  const handleA11yLabelClick = () => {
    setLabelClicked(true);
    const nextRender = renderCount + 1;
    setRenderCount(nextRender);

    const useIdInfo = buildA11yLabelClickUseIdInfo(showError, selectedTokenId);

    onRecordMutation({
      type: 'attributes',
      targetSelector: 'input.uid-a11y-input',
      oldValue: 'unfocused',
      newValue: 'focused (via htmlFor)',
      timestamp: Date.now()
    });

    onRecordTrace({
      trigger: { label: 'Click: "Label Element"', type: 'User Click' },
      componentName: 'AccessibleField',
      renderNumber: nextRender,
      hooks: [
        {
          slot: 0,
          name: 'useId',
          status: selectedTokenId === 'no-id' ? 'No IDs provided (Unlinked)' : 'Stable :r0: verified',
          prevState: ':r0:',
          actionLabel: selectedTokenId === 'no-id' ? 'No htmlFor wiring — click cannot focus input' : 'htmlFor=":r0:-input" focused Email Address input',
          nextState: ':r0:',
          bailedOut: true
        }
      ],
      vdom: { elements: [{ tag: 'input', content: selectedTokenId === 'no-id' ? 'Unlinked (No focus)' : 'Focused via htmlFor=":r0:-input"', isDirty: false }] },
      commit: { diffSummary: selectedTokenId === 'no-id' ? 'No focus occurred (missing IDs)' : 'Label clicked ➔ focused Email Address input via htmlFor=":r0:-input"', mutationsCount: 1 },
      effects: { ran: false, cleanupRan: false, description: 'No effects', closureValues: {} }
    });

    onRecordRender({
      renderNumber: nextRender,
      trigger: 'Click: Label (htmlFor)',
      prevState: { labelClicked: false },
      currentState: { labelClicked: true },
      useIdInfo
    });
  };

  // ==========================================
  // useOptimistic Handlers

  const handleReset = () => {
    setInstanceCount(INITIAL_INSTANCE_COUNT);
    setShowError(false);
    setLabelClicked(false);
    if (onReset) onReset();
  };

  return (
    <SandboxContainer hookName="useId" onReset={handleReset}>
      {activeLessonId === 'uid-basics' && (
        <UseIdBasicsSandbox
          instanceCount={instanceCount}
          selectedTokenId={selectedTokenId}
          onAddInstance={handleAddInstance}
          onRemoveInstance={handleRemoveInstance}
        />
      )}

      {activeLessonId === 'uid-a11y' && (
        <UseIdA11ySandbox
          selectedTokenId={selectedTokenId}
          showError={showError}
          labelClicked={labelClicked}
          onToggleError={handleToggleError}
          onLabelClick={handleA11yLabelClick}
        />
      )}
    </SandboxContainer>
  );
}
