import { useCallback, useEffect, useState } from "react";
import State from "../models/State";
import useBoard from "./useBoard";

const useHalma = (boardSize) => {
  const { state, setState } = useBoard(boardSize);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    const newState = state.copyState();
    newState.initialState();
    setState(newState);
  }, []);

  useEffect(() => {
    const newState = state.copyState();
    let a = Number.NEGATIVE_INFINITY;
    let b = Number.POSITIVE_INFINITY;
    if(turn == 2) { 
      setState(minimax(1, newState, true, a, b)[1]);
      changeTurn();
    }
 }, [turn])

  const changeTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
  };

  const getPawnInPosition = (r, c) => {
    return state.getPawnInPosition(r, c);
  };

  const movePawn = (r1, c1, r2, c2) => {
    console.log("useHalma", state);
    const newState = state.copyState();
    console.log("useHalma newState", newState);
    newState.movePawn(r1, c1, r2, c2);
    setState(newState);
  };

  const heuristicFunction = (curS, turn) => {
    return Math.random();
  };

  const generateAllMoveSet = (curS, ply) => {
    const m = [];
    const arrOfS = [];
    if(ply == 1) {
      for(let p = 0; p < curS.pawnList1.length; p++) {
        let m = curS.generateMoveset(curS.pawnList1[p].row, curS.pawnList1[p].col);
        for(let i = 0; i < m.length; i++){
          let s = curS.copyState();
          s.movePawn(curS.pawnList1[p].row, curS.pawnList1[p].col, m[i][0], m[i][1]);
          arrOfS.push(s);
        }
      }
    }
    if(ply == 2) {
      for(let p = 0; p < curS.pawnList2.length; p++) {
        let m = curS.generateMoveset(curS.pawnList2[p].row, curS.pawnList2[p].col);
        for(let i = 0; i < m.length; i++){
          let s = curS.copyState();
          s.movePawn(curS.pawnList2[p].row, curS.pawnList2[p].col, m[i][0], m[i][1]);
          arrOfS.push(s);
        }
      }
    }
    return arrOfS;
  }

  const minimax = (curD, curS, isMax, alpha, beta) => {
    console.log("curS", curD, curS);
    console.log("state", curD, state);
    console.log("iterasi", curD);
    let result = [];

    if(curD == 4 || curS.isFinalState()) {
      let res = [heuristicFunction(curS, turn), curS];
      return res;
    }

    let moveCurPawn = [];
    let value = 0;
    if(isMax) {
      value = Number.NEGATIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, 2);
    }
    else {
      value = Number.POSITIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, 1);
    }

    let bestMove = new State(boardSize);
    
    for(let i = 0; i < moveCurPawn.length; i++) {
      let resMinimax = minimax(curD+1, moveCurPawn[i], !isMax, alpha, beta);

      if(isMax && value < resMinimax[0]) {
        value = resMinimax[0];
        bestMove = moveCurPawn[i];
        alpha = Math.max(alpha, resMinimax[0]);
        if(beta <= alpha) {
          result = [alpha, bestMove];
          return result;
        }
      }
        
      else if(!isMax && value > resMinimax[0]) {
        value = resMinimax[0];
        bestMove = moveCurPawn[i];
        beta = Math.min(beta, resMinimax[0]);
        value = beta;
        if(beta <= alpha) {
          result = [beta, bestMove];
          return result;
        }
      }
    }
    
    result = [value, bestMove];
    return result;
  };

  return { state, movePawn, turn, changeTurn, getPawnInPosition, minimax };
};

export default useHalma;
