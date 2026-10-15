import { SERVER_DELAY_MS, COLOR_WHITE, COLOR_CYAN, COLOR_PALETTE } from '../../constants/use-optimistic.js';

// Utilities and data helpers for useOptimistic hook visualizations

export function getColorById(id) {
  return COLOR_PALETTE.find((c) => c.id === id) || COLOR_WHITE;
}

export function getNextColor(currentHex) {
  if (!currentHex || currentHex.toLowerCase() === COLOR_WHITE.hex) {
    return COLOR_CYAN;
  }
  return COLOR_WHITE;
}

/**
 * Simulates a network request with a 3s duration and server online/offline state.
 */
export function simulateServerDelay(durationMs = SERVER_DELAY_MS, isServerOn = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isServerOn) {
        resolve({
          status: 200,
          ok: true,
          message: 'HTTP 200 OK — Saved to server.'
        });
      } else {
        reject({
          status: 500,
          ok: false,
          message: 'HTTP 500 Connection Refused — Server offline.'
        });
      }
    }, durationMs);
  });
}

/**
 * Builds the initial snapshot info for useOptimistic lessons.
 */
export function getInitialUseOptimisticInfo(lessonId, tokenId = '') {
  return {
    confirmedColor: COLOR_WHITE.hex,
    confirmedColorName: COLOR_WHITE.name,
    optimisticColor: COLOR_WHITE.hex,
    optimisticColorName: COLOR_WHITE.name,
    nextTargetColor: COLOR_CYAN.hex,
    nextTargetName: COLOR_CYAN.name,
    isPending: false,
    isServerOn: true,
    serverStatus: '200 OK',
    strategy: tokenId || 'optimistic-transition',
    actionSummary: 'Initial state: White (#ffffff)',
    diverged: false,
    perceivedLatencyMs: 0,
    networkDurationMs: SERVER_DELAY_MS
  };
}

/**
 * Builds snapshot trace info when the button is pressed.
 */
export function buildOptimisticClickInfo({
  confirmedColorHex,
  optimisticColorHex,
  nextColorHex,
  isServerOn,
  isPending,
  strategy
}) {
  const confirmed = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === confirmedColorHex.toLowerCase()) || { name: 'White', hex: confirmedColorHex };
  const optimistic = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === optimisticColorHex.toLowerCase()) || { name: 'Cyan', hex: optimisticColorHex };
  const nextTarget = COLOR_PALETTE.find((c) => c.hex.toLowerCase() === nextColorHex.toLowerCase()) || COLOR_CYAN;

  const isDiverged = confirmed.hex.toLowerCase() !== optimistic.hex.toLowerCase();

  let summaryBadge = 'Optimistic Active';
  if (!isPending && !isDiverged) {
    summaryBadge = 'Committed';
  } else if (!isPending && isDiverged) {
    summaryBadge = 'Reverted';
  }

  return {
    confirmedColor: confirmed.hex,
    confirmedColorName: confirmed.name,
    optimisticColor: optimistic.hex,
    optimisticColorName: optimistic.name,
    nextTargetColor: nextTarget.hex,
    nextTargetName: nextTarget.name,
    isPending,
    isServerOn,
    serverStatus: isServerOn ? 'ONLINE (200 OK)' : 'OFFLINE (500 Error)',
    strategy,
    summaryBadge,
    diverged: isDiverged,
    perceivedLatencyMs: strategy === 'traditional-sluggish' ? SERVER_DELAY_MS : 0,
    networkDurationMs: SERVER_DELAY_MS
  };
}
