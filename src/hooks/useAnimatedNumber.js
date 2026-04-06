import { useState, useEffect, useRef } from 'react';

/**
 * Animates a numeric value from its previous state to the new target.
 * Returns the current display value (number).
 *
 * @param {number} target   - The final value to reach
 * @param {number} duration - Animation duration in ms (default 600)
 */
export function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prevRef    = useRef(target);
  const rafRef     = useRef(null);
  const startRef   = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to   = target;
    prevRef.current = target;

    if (from === to) return;

    // Cancel any in-progress animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    function step(timestamp) {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(to);
        startRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}
