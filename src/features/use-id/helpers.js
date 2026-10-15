import { INITIAL_INSTANCE_COUNT, FIELD_LABELS } from '../../constants/use-id.js';

// Utilities and data helpers for useId hook visualizations in Snapshot Timeline and Sandbox

export function getFieldLabel(index) {
  return FIELD_LABELS[index] || `Field ${index + 1}`;
}

export function computeFieldId(index, strategy) {
  if (strategy === 'hardcoded') {
    return 'my-input';
  }
  if (strategy === 'math-random') {
    return `input-${((index + 1) * 31415 % 10000).toString(36)}`;
  }
  return `:r${index}:`;
}

/**
 * Builds the useId snapshot information for the Initial Mount of a useId lesson.
 */
export function getInitialUseIdInfo(lessonId, tokenId) {
  if (lessonId === 'uid-basics') {
    const strategy = tokenId || 'useid-basic';
    const isHardcoded = strategy === 'hardcoded';
    const isRandom = strategy === 'math-random';
    const initialCount = INITIAL_INSTANCE_COUNT;

    const mappings = Array.from({ length: initialCount }, (_, i) => {
      const label = getFieldLabel(i);
      const id = computeFieldId(i, strategy);
      return {
        inputIndex: i + 1,
        inputLabel: label,
        id,
        isNew: true,
        isDuplicate: isHardcoded,
        isUnstable: isRandom,
        role: 'input'
      };
    });

    return {
      createdId: isHardcoded
        ? 'my-input'
        : isRandom
        ? 'input-3b, input-7k, input-9p'
        : ':r0:, :r1:, :r2:',
      targetInput: 'Inputs: Name, Email, Phone',
      actionType: 'created',
      summaryBadge: isHardcoded ? 'Duplicate Collision' : isRandom ? 'Unstable IDs' : '3 Unique IDs Created',
      isDuplicate: isHardcoded,
      isUnstable: isRandom,
      mappings
    };
  }

  if (lessonId === 'uid-a11y') {
    const isNoId = tokenId === 'no-id';

    if (isNoId) {
      return {
        createdId: 'None (No ID)',
        targetInput: 'Email Address input (Unlinked)',
        actionType: 'missing',
        summaryBadge: 'Inaccessible (No IDs)',
        isMissing: true,
        mappings: [
          { inputLabel: 'Email Input', id: '(none)', isMissing: true, role: 'input id' },
          { inputLabel: 'Email Label', id: '(none)', isMissing: true, role: 'label htmlFor' },
          { inputLabel: 'Hint', id: '(none)', isMissing: true, role: 'aria-describedby' }
        ]
      };
    }

    return {
      createdId: ':r0:-input',
      targetInput: 'Email Address input',
      actionType: 'created',
      summaryBadge: 'Accessible Suite Created',
      mappings: [
        { inputLabel: 'Email Input', id: ':r0:-input', isNew: true, role: 'input id' },
        { inputLabel: 'Email Label', id: ':r0:-input', isNew: true, role: 'label htmlFor' },
        { inputLabel: 'Hint', id: ':r0:-hint', isNew: true, role: 'aria-describedby' }
      ]
    };
  }

  return null;
}

/**
 * Builds useId snapshot info when "+ Add Instance" is clicked in uid-basics.
 */
export function buildAddInstanceUseIdInfo(prevCount, nextCount, strategy) {
  const isHardcoded = strategy === 'hardcoded';
  const isRandom = strategy === 'math-random';
  const newIndex = nextCount - 1;
  const newLabel = getFieldLabel(newIndex);
  const createdId = computeFieldId(newIndex, strategy);

  const mappings = Array.from({ length: nextCount }, (_, i) => {
    const label = getFieldLabel(i);
    const id = computeFieldId(i, strategy);
    return {
      inputIndex: i + 1,
      inputLabel: label,
      id,
      isNew: i === newIndex,
      isDuplicate: isHardcoded,
      isUnstable: isRandom,
      role: 'input'
    };
  });

  return {
    createdId,
    targetInput: `Input #${nextCount} (${newLabel})`,
    actionType: isRandom ? 'regenerated' : 'created',
    summaryBadge: isHardcoded ? 'Duplicate Collision' : isRandom ? 'Re-randomized' : 'Unique ID Created',
    isDuplicate: isHardcoded,
    isUnstable: isRandom,
    mappings
  };
}

/**
 * Builds useId snapshot info when "− Remove Last" is clicked in uid-basics.
 */
export function buildRemoveInstanceUseIdInfo(prevCount, nextCount, strategy) {
  const isHardcoded = strategy === 'hardcoded';
  const isRandom = strategy === 'math-random';
  const removedIndex = prevCount - 1;
  const removedLabel = getFieldLabel(removedIndex);
  const removedId = computeFieldId(removedIndex, strategy);

  const mappings = Array.from({ length: nextCount }, (_, i) => {
    const label = getFieldLabel(i);
    const id = computeFieldId(i, strategy);
    return {
      inputIndex: i + 1,
      inputLabel: label,
      id,
      isNew: false,
      isDuplicate: isHardcoded,
      isUnstable: isRandom,
      role: 'input'
    };
  });

  return {
    createdId: `${removedId} (Discarded)`,
    targetInput: `Input #${prevCount} (${removedLabel})`,
    actionType: 'removed',
    summaryBadge: 'Unmounted Instance',
    isDuplicate: isHardcoded,
    isUnstable: isRandom,
    mappings
  };
}

/**
 * Builds useId snapshot info when "Toggle Error" is clicked in uid-a11y.
 */
export function buildA11yToggleErrorUseIdInfo(nextShowError, tokenId) {
  const isNoId = tokenId === 'no-id';
  if (isNoId) {
    return {
      createdId: 'None (No ID)',
      targetInput: 'Email Address input',
      actionType: 'missing',
      summaryBadge: 'Inaccessible',
      isMissing: true,
      mappings: [
        { inputLabel: 'Email Input', id: '(none)', isMissing: true, role: 'input id' },
        { inputLabel: 'Email Label', id: '(none)', isMissing: true, role: 'label htmlFor' }
      ]
    };
  }

  const mappings = [
    { inputLabel: 'Email Input', id: ':r0:-input', isNew: false, role: 'input id' },
    { inputLabel: 'Email Label', id: ':r0:-input', isNew: false, role: 'label htmlFor' },
    { inputLabel: 'Hint', id: ':r0:-hint', isNew: false, role: 'aria-describedby' }
  ];

  if (nextShowError) {
    mappings.push({
      inputLabel: 'Error',
      id: ':r0:-error',
      isNew: true,
      role: 'aria-describedby'
    });
  }

  return {
    createdId: nextShowError ? ':r0:-error' : ':r0:-input (Retained)',
    targetInput: nextShowError ? 'Email Address input (via aria-describedby)' : 'Email Address input',
    actionType: nextShowError ? 'created' : 'retained',
    summaryBadge: nextShowError ? 'Linked Error ID' : 'Stable useId Retained',
    mappings
  };
}

/**
 * Builds useId snapshot info when "Click the Label" is clicked in uid-a11y.
 */
export function buildA11yLabelClickUseIdInfo(showError, tokenId) {
  const isNoId = tokenId === 'no-id';
  if (isNoId) {
    return {
      createdId: 'No ID (Click failed)',
      targetInput: 'Email Address input (Cannot focus)',
      actionType: 'missing',
      summaryBadge: 'Click Failed',
      isMissing: true,
      mappings: [
        { inputLabel: 'Email Input', id: '(no id)', isMissing: true, role: 'unlinked' },
        { inputLabel: 'Email Label', id: '(no htmlFor)', isMissing: true, role: 'unlinked' }
      ]
    };
  }

  const mappings = [
    { inputLabel: 'Email Input', id: ':r0:-input', isNew: false, role: 'target input' },
    { inputLabel: 'Email Label', id: ':r0:-input', isNew: false, role: 'htmlFor trigger' },
    { inputLabel: 'Hint', id: ':r0:-hint', isNew: false, role: 'aria-describedby' }
  ];

  if (showError) {
    mappings.push({
      inputLabel: 'Error',
      id: ':r0:-error',
      isNew: false,
      role: 'aria-describedby'
    });
  }

  return {
    createdId: ':r0:-input',
    targetInput: 'Email Address input (Focused via htmlFor)',
    actionType: 'retained',
    summaryBadge: 'htmlFor Focused Input',
    mappings
  };
}
