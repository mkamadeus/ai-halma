import { useCallback, useEffect, useState } from "react";
import State from "../models/State";
import useBoard from "./useBoard";

const useHalma = (boardSize, depth) => {
  const { state, setState } = useBoard(boardSize);
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    const newState = state.copyState();
    newState.initialState();
    setState(newState);
  }, []);

  // If bot...
  useEffect(() => {
    const newState = state.copyState();

    if(turn === 2){
      setState(
        minimax(  
          1,
          newState,
          true,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          turn
        )[1]  
      );
      changeTurn();
    setTimeout(() => {  changeTurn(); }, 3000);
    }

    // if(turn === 1){
    //   setState(
    //     minimax(  
    //       1,
    //       newState,
    //       true,
    //       Number.NEGATIVE_INFINITY,
    //       Number.POSITIVE_INFINITY,
    //       turn
    //     )[1]  
    //   );
    // setTimeout(() => {  changeTurn(); }, 3000);
    // }

    // else{
    //   setState(minimax(  
    //     1,
    //     newState,
    //     true,
    //     Number.NEGATIVE_INFINITY,
    //     Number.POSITIVE_INFINITY,
    //     turn
    //   )[1]);
    // setTimeout(() => {  changeTurn(); }, 3000);
    // }

  }, [turn]);

  // Change turn
  const changeTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
  };

  const getPawnInPosition = (r, c) => {
    return state.getPawnInPosition(r, c);
  };

  const movePawn = (r1, c1, r2, c2) => {
    const newState = state.copyState();
    newState.movePawn(r1, c1, r2, c2);
    setState(newState);
  };

  const euclideanDistance = (r1, c1, r2, c2) => {
    // return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(c2 - c1, 2));
    return Math.sqrt(Math.pow(r2-r1,2)+Math.pow(c2-c1,2));
  };

  const heuristicFunction = (curS, owner) => {
    let goal = curS.board.generateGoal(owner);
    let goalOp = curS.board.generateGoal(3-owner);
    let myDistance = 0.0;
    let opDistance = 0.0;
    let pawn = null;
    let value = 0.0;
    for(let i = 0; i <curS.board.getBoardSize(); i++){
      for(let j = 0; j<curS.board.getBoardSize(); j++){
        pawn = curS.getPawnInPosition(i,j);
        if(pawn){
          if(pawn.owner == owner){
            let myDist = [];
            for(let k = 0; k < goal.length; k++){
              if(curS.getPawnInPosition(goal[k][0],goal[k][1])){
                if(curS.getPawnInPosition(goal[k][0],goal[k][1]).owner!=owner){
                  myDist.push(euclideanDistance(i,j,goal[k][0],goal[k][1]));
                }
              }
              else{
                myDist.push(euclideanDistance(i,j,goal[k][0],goal[k][1]));
              }
            }
            if(myDist.length == 0){
              myDistance += 50;
            }
            else{
              myDistance -= myDist.reduce(function(a, b) {
                return Math.max(a, b);
              });
            }
          }
          else{
            let opDist = [];
            for(let k = 0; k < goalOp.length; k++){
              if(curS.getPawnInPosition(goalOp[k][0],goalOp[k][1])){
                if(curS.getPawnInPosition(goalOp[k][0],goalOp[k][1]).owner!= (3-owner)){
                  opDist.push(euclideanDistance(i,j,goalOp[k][0],goalOp[k][1]));
                }
              }
              else{
                opDist.push(euclideanDistance(i,j,goalOp[k][0],goalOp[k][1]));
              }
            }
            if(opDist.length == 0){
              opDistance += 50;
            }
            else{
              opDistance -= opDist.reduce(function(a, b) {
                return Math.max(a, b);
              });
            }
          }
        }
      }
    }
    value = myDistance - opDistance;
    return value;
  }
  
  const generateAllMoveSet = (curS, ply) => {
    const m = [];
    const arrOfS = [];
    if (ply == 1) {
      for (let p = 0; p < curS.pawnList1.length; p++) {
        let m = curS.generateMoveset(
          curS.pawnList1[p].row,
          curS.pawnList1[p].col
        );
        for (let i = 0; i < m.length; i++) {
          let s = curS.copyState();
          s.movePawn(
            curS.pawnList1[p].row,
            curS.pawnList1[p].col,
            m[i][0],
            m[i][1]
          );
          arrOfS.push(s);
        }
      }
    }
    if (ply == 2) {
      for (let p = 0; p < curS.pawnList2.length; p++) {
        let m = curS.generateMoveset(
          curS.pawnList2[p].row,
          curS.pawnList2[p].col
        );
        for (let i = 0; i < m.length; i++) {
          let s = curS.copyState();
          s.movePawn(
            curS.pawnList2[p].row,
            curS.pawnList2[p].col,
            m[i][0],
            m[i][1]
          );
          arrOfS.push(s);
        }
      }
    }
    return arrOfS;
  };

  const minimax = (curD, curS, isMax, alpha, beta, turn) => {
    let result = [];

    if (curD === 3 || curS.isFinalState()) {
      let res = [heuristicFunction(curS, turn), curS];
      return res;
      
    }

    let moveCurPawn = [];
    let value = 0;
      if(turn==2){
        if (isMax) {
          value = Number.NEGATIVE_INFINITY;
          moveCurPawn = generateAllMoveSet(curS, 2);
        } else {
          value = Number.POSITIVE_INFINITY;
          moveCurPawn = generateAllMoveSet(curS, 1);
        }
      }
      else{
        if (isMax) {
          value = Number.NEGATIVE_INFINITY;
          moveCurPawn = generateAllMoveSet(curS, 1);
        } else {
          value = Number.POSITIVE_INFINITY;
          moveCurPawn = generateAllMoveSet(curS, 2);
        }
      }
    
    let bestMove = new State(boardSize);
    for (let i = 0; i < moveCurPawn.length; i++) {
      let resMinimax = minimax(curD + 1, moveCurPawn[i], !isMax, alpha, beta, turn);
      if (isMax && value < resMinimax[0]) {
        value = resMinimax[0];
        bestMove = moveCurPawn[i];
        alpha = Math.max(alpha, resMinimax[0]);
        if (beta <= alpha) {
          result = [alpha, bestMove];
          return result;
        }
      } else if (!isMax && value > resMinimax[0]) {
        value = resMinimax[0];
        bestMove = moveCurPawn[i];
        beta = Math.min(beta, resMinimax[0]);
        value = beta;
        if (beta <= alpha) {
          result = [beta, bestMove];
          return result;
        }
      }
    }

    result = [value, bestMove];
    return result;
  };

  const simulatedAnnealing = (curS, owner) => {
    // Generate all possible moves
    let moveCurPawn = generateAllMoveSet(curS, owner);
    let max = null;
    let s = null;

    // Scheduling functions
    let temperatureSchedule = (iteration, T) => T - iteration +(0.5*iteration);
    let randomWalkProbability = (delta, iteration) =>
      Math.exp(delta / temperatureSchedule(iteration));

    // Iterate for SA
    let iteration = 1;
    let T = 100;
    while (temperatureSchedule(iteration, T) > 0) {
      let temp = temperatureSchedule(iteration, T);
      // Select a random state
      let randomState =
        moveCurPawn[Math.floor(Math.random() * moveCurPawn.length)];

      // Calculate state value
      let h = heuristicFunction(randomState, 2);

      if (!max || h > max) {
        // If the random state is better, gotcha
        max = h;
        s = randomState;
      } else if (h <= max) {
        // Gacha for random walk
        let n = Math.random();
        if (n <= randomWalkProbability(h - max, iteration)) {
          max = h;
          s = randomState;
        }
      }
      iteration++;
      T = temp;
    }
    return [max, s];
  };

  const minimaxLocal = (curD, curS, isMax, alpha, beta) => {
    // Base Case:
    // If depth limit reach or current state is already final
    // Compute state heuristic function
    if (curD === depth || curS.isFinalState()) {
      return [heuristicFunction(curS, 2), curS];
    }

    // If current iteration is finding the MAX...
    // Set initial best move values
    let bestMoveValue = isMax
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;
    let bestMove = null;

    // Generate 5 random move
    let moveCurPawn = [];
    for (let i = 0; i < 10; i++) {
      moveCurPawn.push(simulatedAnnealing(curS, isMax ? 2 : 1)[1]);
    }

    for (let i = 0; i < moveCurPawn.length; i++) {
      // Recursively call function for next depth (DFS)
      let resMinimax = minimaxLocal(
        curD + 1,
        moveCurPawn[i],
        !isMax,
        alpha,
        beta
      );

      // If currently is finding MAX and the result is better than the current state...
      if (isMax && bestMoveValue < resMinimax[0]) {
        // Set current MAX
        bestMoveValue = resMinimax[0];
        bestMove = moveCurPawn[i];
        alpha = Math.max(alpha, resMinimax[0]);

        // Alpha-Beta Pruning if current best not feasible
        if (beta <= alpha) {
          return [alpha, bestMove];
        }
      }
      // If currently is finding MIN and the result is worse than the current state...
      else if (!isMax && bestMoveValue > resMinimax[0]) {
        // Set current MIN
        bestMoveValue = resMinimax[0];
        bestMove = moveCurPawn[i];
        beta = Math.min(beta, resMinimax[0]);

        // Alpha-Beta Pruning if current worst not feasible
        if (beta <= alpha) {
          return [beta, bestMove];
        }
      }
    }

    return [bestMoveValue, bestMove];
  };

  return { state, movePawn, turn, changeTurn, getPawnInPosition, minimax };
};

export default useHalma;
