import { useState } from "react";

const useSelection = () => {
  const [selected, setSelected] = useState(null);

  const setSelectedTile = (r, c) => {
    setSelected([r, c]);
  };

  const setTargetTile = (r, c, callback) => {
    callback(selected[0], selected[1], r, c);
    setSelected(null);
  };

  return [selected, setSelectedTile, setTargetTile];
};

export default useSelection;
