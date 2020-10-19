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

    if (turn === 2) {
      setState(
        minimax(
          1,
          newState,
          true,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY
        )[1]
      );

      changeTurn();
    }
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
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(c2 - c1, 2));
  };

  const heuristicFunction = (curS, owner) => {
    let computerDistance = 0.0;
    let goal = [];
    let index = -1;
    goal = curS.board.generateGoal(owner).slice();
    let pawn = null;
    if (owner === 2) {
      for (let i = 0; i < curS.pawnList2.length; i++) {
        let computerDist = [];
        pawn = curS.pawnList2[i];
        index = goal.indexOf([pawn.row, pawn.col]);
        if (index > -1) {
          console.log("ADA YANG DI GOAL");
        }
        for (let j = 0; j < goal.length; j++) {
          computerDist.push(
            euclideanDistance(pawn.row, pawn.col, goal[i][0], goal[i][1])
          );
        }
        if (computerDist.length) {
          computerDistance += computerDist.reduce(function (a, b) {
            return Math.min(a, b);
          });
        } else {
          computerDistance += 50;
        }
      }
      console.log("Heuristic function ", computerDistance);
    } else {
      for (let i = 0; i < curS.pawnList1.length; i++) {
        pawn = curS.pawnList1[i];
      }
    }
    return -1 * computerDistance;
  };

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

  const minimax = (curD, curS, isMax, alpha, beta) => {
    let result = [];

    if (curD === 3 || curS.isFinalState()) {
      let res = [heuristicFunction(curS, 2), curS];
      return res;
    }

    let moveCurPawn = [];
    let value = 0;
    if (isMax) {
      value = Number.NEGATIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, 2);
    } else {
      value = Number.POSITIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, 1);
    }

    let bestMove = new State(boardSize);

    for (let i = 0; i < moveCurPawn.length; i++) {
      let resMinimax = minimax(curD + 1, moveCurPawn[i], !isMax, alpha, beta);
      console.log("RESULT MINIMAX: ", resMinimax[0]);
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
