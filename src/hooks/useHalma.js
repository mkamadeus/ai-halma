import { useCallback, useEffect, useState } from "react";
import useBoard from "./useBoard";

const useHalma = (boardSize) => {
  const { state, setState } = useBoard(boardSize);
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

  const movePawn = (r1, c1, r2, c2) => {
    try {
      console.log("useHalma", state);
      const newState = state.copyState();
      console.log("useHalma newState", newState);
      newState.movePawn(r1, c1, r2, c2);
      setState(newState);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { state, movePawn, turn, changeTurn, getPawnInPosition };
};

export default useHalma;
