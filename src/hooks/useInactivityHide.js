import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_MS = 5000; // 5 seconds

/**
 * useInactivityHide
 * -------------------------------------------------------
 * Returns `isHidden = true` after IDLE_MS of no mouse movement.
 * Resets to false on any mouse movement.
 *
 * @returns {{ isHidden: boolean, forceShow: () => void }}
 */
export function useInactivityHide() {
  const [isHidden, setIsHidden] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    setIsHidden(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsHidden(true);
    }, IDLE_MS);
  }, []);

  const forceShow = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsHidden(true);
    }, IDLE_MS);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [resetTimer]);

  return { isHidden, forceShow };
}
