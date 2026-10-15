import { useState, useRef, useEffect } from 'react';

// Re-triggering restarts the light's timeout; unmount cancels the active timeout.
export function useTransientLight(durationMs) {
  const [isLit, setIsLit] = useState(false);
  const timerRef = useRef(null);

  const flash = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLit(true);
    timerRef.current = setTimeout(() => setIsLit(false), durationMs);
  };

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return [isLit, flash];
}
