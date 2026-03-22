import { useState, useCallback, useRef } from "react";

const useSelection = () => {
  const [selected, setSelected] = useState(null);
  const selectedRef = useRef(null);

  const setSelectedTile = useCallback((r, c) => {
    const val = [r, c];
    selectedRef.current = val;
    setSelected(val);
  }, []);

  const setTargetTile = useCallback((r, c, callback) => {
    const sel = selectedRef.current;
    if (sel) {
      callback(sel[0], sel[1], r, c);
    }
    selectedRef.current = null;
    setSelected(null);
  }, []);

  return [selected, setSelectedTile, setTargetTile];
};

export default useSelection;
