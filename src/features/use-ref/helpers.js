// Helper utilities for the useRef Playground

/**
 * Builds metadata for Timeline render cards for useRef actions
 */
export function buildRefClickInfo({
  action,
  targetBox = 2,
  isBox2On = false,
  isBox3On = false,
  strategy = 'use-ref'
}) {
  return {
    action,
    targetBox,
    isBox2On,
    isBox3On,
    box2Status: isBox2On ? 'Light ON' : 'Light OFF',
    box3Status: isBox3On ? 'Light ON' : 'Light OFF',
    strategy
  };
}

/**
 * Provides initial timeline metadata on lesson mount
 */
export function getInitialUseRefInfo(_lessonId = 'ur-component-ref', tokenId = '') {
  return {
    action: 'Initial Mount',
    targetBox: null,
    isBox2On: false,
    isBox3On: false,
    box2Status: 'Light OFF',
    box3Status: 'Light OFF',
    strategy: tokenId || 'use-ref'
  };
}
