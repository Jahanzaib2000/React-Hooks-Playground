import { useState, useEffect, useRef, useCallback } from 'react';
import { SIMULATION_DURATION_SECONDS, SIMULATION_TICK_MS, SIMULATION_STEP_SECONDS } from '../../constants/simulation.js';

/**
 * Reusable hook for simulated network/computation delays, countdowns (e.g. 3.0s -> 0.0s), and pending states.
 *
 * @param {number} [defaultDuration=3.0] - Default duration in seconds (e.g. 3.0)
 * @param {number} [tickIntervalMs=100] - Tick step interval in milliseconds
 * @returns {Object} { isPending, setIsPending, countdown, setCountdown, startSimulation, reset }
 */
export function useSimulationTimer(defaultDuration = SIMULATION_DURATION_SECONDS, tickIntervalMs = SIMULATION_TICK_MS) {
  const [isPending, setIsPending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const onCompleteRef = useRef(null);

  const startSimulation = useCallback((duration = defaultDuration, onComplete = null) => {
    onCompleteRef.current = onComplete;
    setCountdown(duration);
    setIsPending(true);
  }, [defaultDuration]);

  const reset = useCallback(() => {
    setIsPending(false);
    setCountdown(0);
    onCompleteRef.current = null;
  }, []);

  useEffect(() => {
    let interval;
    if (isPending && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= SIMULATION_STEP_SECONDS) {
            clearInterval(interval);
            setIsPending(false);
            if (onCompleteRef.current) {
              const cb = onCompleteRef.current;
              onCompleteRef.current = null;
              cb();
            }
            return 0;
          }
          return +(prev - SIMULATION_STEP_SECONDS).toFixed(1);
        });
      }, tickIntervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPending, countdown, tickIntervalMs]);

  return {
    isPending,
    setIsPending,
    countdown,
    setCountdown,
    startSimulation,
    reset
  };
}
