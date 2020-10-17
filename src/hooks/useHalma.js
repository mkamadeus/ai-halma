import { useCallback, useEffect, useState } from "react";
import useBoard from "./useBoard";

const useHalma = (boardSize) => {
  const { state, setState, movePawn } = useBoard(boardSize);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    const newState = state.copyState();
    newState.initialState();
    setState(newState);
  }, []);

  const changeTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
  };

  const getPawnInPosition = (r, c) => {
    return state.getPawnInPosition(r, c);
  };

  return { state, movePawn, changeTurn, getPawnInPosition };
};

export default useHalma;
