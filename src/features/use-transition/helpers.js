import { TRANSITION_TIMING_MS, TRANSITION_COLORS } from '../../constants/use-transition.js';
// Helper utilities for the useTransition Playground

/**
 * Simulates a heavy 10-second computation
 */
export function simulateHeavyTask(durationMs = TRANSITION_TIMING_MS.heavyComputation) {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

/**
 * Builds metadata for Timeline render cards
 */
export function buildTransitionClickInfo({
  action,
  isTransitionOn = false,
  isHeavyRunning = false,
  btn1Active = false,
  btn2Active = false,
  strategy = 'use-transition'
}) {
  return {
    action,
    isTransitionOn,
    isHeavyRunning,
    btn1Active,
    btn2Active,
    heavyColor: isHeavyRunning ? TRANSITION_COLORS.heavy : TRANSITION_COLORS.idle,
    btn1Color: btn1Active ? TRANSITION_COLORS.button : 'default',
    btn2Color: btn2Active ? TRANSITION_COLORS.button : 'default',
    strategy
  };
}

/**
 * Provides initial timeline metadata on lesson mount
 */
export function getInitialUseTransitionInfo(_lessonId = 'ut-freeze-demo', tokenId = '') {
  const strategy = tokenId || 'use-transition';
  return {
    action: 'Initial Mount',
    isTransitionOn: strategy === 'use-transition',
    isHeavyRunning: false,
    btn1Active: false,
    btn2Active: false,
    heavyColor: TRANSITION_COLORS.idle,
    btn1Color: 'default',
    btn2Color: 'default',
    strategy
  };
}
