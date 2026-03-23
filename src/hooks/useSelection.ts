import { useState, useCallback, useRef } from "react";
import type { Position } from "../types";

type MovePawnCallback = (
  r1: number,
  c1: number,
  r2: number,
  c2: number,
) => void;

const useSelection = (): [
  Position | null,
  (r: number, c: number) => void,
  (r: number, c: number, callback: MovePawnCallback) => void,
] => {
  const [selected, setSelected] = useState<Position | null>(null);
  const selectedRef = useRef<Position | null>(null);

  const setSelectedTile = useCallback((r: number, c: number) => {
    const val: Position = [r, c];
    selectedRef.current = val;
    setSelected(val);
  }, []);

  const setTargetTile = useCallback(
    (r: number, c: number, callback: MovePawnCallback) => {
      const sel = selectedRef.current;
      if (sel) {
        callback(sel[0], sel[1], r, c);
      }
      selectedRef.current = null;
      setSelected(null);
    },
    [],
  );

  return [selected, setSelectedTile, setTargetTile];
};

export default useSelection;
