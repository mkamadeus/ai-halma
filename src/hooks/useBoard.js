import { useState, useEffect, useCallback } from "react";
import State from "../models/State";

const useBoard = (boardSize) => {
  const [state, setState] = useState(new State(boardSize));

  return { state, setState };
};

export default useBoard;
