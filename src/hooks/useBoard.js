import { useState, useEffect, useCallback } from "react";
import State from "../models/State";

const useBoard = (boardSize) => {
  const [state, setState] = useState(new State(boardSize));

  const movePawn = (r1, c1, r2, c2) => {
    try {
      const newState = state.copyState().movePawn(r1, c1, r2, c2);
      setState(newState);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { state, setState, movePawn };
};

export default useBoard;
