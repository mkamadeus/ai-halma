import { useState } from "react";
import State from "../models/State";

interface UseBoardReturn {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const useBoard = (boardSize: number): UseBoardReturn => {
  const [state, setState] = useState(() => new State(boardSize));

  return { state, setState };
};

export default useBoard;
