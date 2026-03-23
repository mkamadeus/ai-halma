import { useRef, useState, useCallback } from "react";

export const usePlayerStopwatch = (): [number, () => void, () => void] => {
  const [total, setTotal] = useState(0);
  const timerRef = useRef(Date.now());
  const totalRef = useRef(0);

  const start = useCallback(() => {
    timerRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    const elapsed = Date.now() - timerRef.current;
    totalRef.current += elapsed;
    setTotal(totalRef.current);
  }, []);

  return [total, start, pause];
};
