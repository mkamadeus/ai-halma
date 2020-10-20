import { useCallback, useEffect, useState } from "react";
import { useStopwatch, useTimer } from "react-timer-hook";
import State from "../models/State";
import useBoard from "./useBoard";
import Swal from "sweetalert2";
import { usePlayerStopwatch } from "./usePlayerStopwatch";

const useHalma = (boardSize, depth, timer) => {
  const { state, setState } = useBoard(boardSize);
  const [turn, setTurn] = useState(1);
  const newTimer = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + timer);
    return time;
  };

  const { seconds, pause, restart } = useTimer({
    expiryTimestamp: newTimer(),
    onExpire: () => {
      changeTurn();
    },
  });

  const [timer1, start1, pause1] = usePlayerStopwatch();
  const [timer2, start2, pause2] = usePlayerStopwatch();

  useEffect(() => {
    const newState = state.copyState();

    if (newState.isFinalState()) {
      pause();
      pause1();
      pause2();
      Swal.fire(
        `Player ${turn === 1 ? 2 : 1} wins!`,
        `Player 1 Time : ${timer1}s | Player 2 Time : ${timer2}s`
        // `Player 2 Time : ${timer2}s`
      );
    } else {
      if (newState.pawnList1.length === 0) {
        newState.initialState();
        setState(newState);
        start1();
      }

      if (turn === 1) {
        setState(
          minimaxLocal(
            1,
            newState,
            true,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            turn
          )[1]
        );
        changeTurn();
      } else if (turn === 2) {
        setState(
          minimaxLocal(
            1,
            newState,
            true,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            turn
          )[1]
        );

        changeTurn();
      }
    }
  }, [turn]);

  // Change turn
  const changeTurn = () => {
    restart(newTimer());
    if (turn === 1) {
      pause1();
      start2();
      setTurn(2);
    } else if (turn === 2) {
      pause2();
      start1();
      setTurn(1);
    }
    // setTurn(turn === 1 ? 2 : 1);
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
    let myDistance = 0.0;
    let goal = curS.board.generateGoal(owner).slice();
    let pawn = null;
    let notInGoal = 0;

    if (owner === 2) {
      for (let i = 0; i < curS.pawnList2.length; i++) {
        let count = true;
        pawn = curS.pawnList2[i];
        for (let j = 0; j < goal.length; j++) {
          if (pawn.row == goal[j][0] && pawn.col == goal[j][1]) {
            count = false;
          }
        }
        if (count) {
          notInGoal += 1;
          for (let j = 0; j < goal.length; j++) {
            myDistance += euclideanDistance(
              pawn.row,
              pawn.col,
              goal[j][0],
              goal[j][1]
            );
          }
        } else {
          myDistance -= 50;
        }
      }
      if (notInGoal == 0) {
        return 500;
      }
    } else {
      for (let i = 0; i < curS.pawnList1.length; i++) {
        let count = true;
        pawn = curS.pawnList1[i];
        for (let j = 0; j < goal.length; j++) {
          if (pawn.row == goal[j][0] && pawn.col == goal[j][1]) {
            count = false;
          }
        }
        if (count) {
          notInGoal += 1;
          for (let j = 0; j < goal.length; j++) {
            myDistance += euclideanDistance(
              pawn.row,
              pawn.col,
              goal[j][0],
              goal[j][1]
            );
          }
        } else {
          myDistance -= 50;
        }
      }
      if (notInGoal == 0) {
        return 500;
      }
    }
    return -1 * myDistance;
  };

  const generateAllMoveSet = (curS, ply) => {
    const allMoveset = [];
    const selectedPawnList = ply === 1 ? curS.pawnList1 : curS.pawnList2;

    for (let p = 0; p < selectedPawnList.length; p++) {
      let moveset = curS.generateMoveset(
        selectedPawnList[p].row,
        selectedPawnList[p].col
      );
      for (let i = 0; i < moveset.length; i++) {
        let s = curS.copyState();
        s.movePawn(
          selectedPawnList[p].row,
          selectedPawnList[p].col,
          moveset[i][0],
          moveset[i][1]
        );
        allMoveset.push(s);
      }
    }

    return allMoveset;
  };

  const minimax = (curD, curS, isMax, alpha, beta, turn) => {
    let result = [];
    // Base Case:
    // If depth limit reached or final state reached...
    // Calculate heuristic value
    if (curD === depth || curS.isFinalState()) {
      let res = [heuristicFunction(curS, turn), curS];
      return res;
    }

    let moveCurPawn = [];
    let value = 0;
    if (isMax) {
      value = Number.NEGATIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, turn);
    } else {
      value = Number.POSITIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, turn === 2 ? 1 : 2);
    }

    let bestMove = new State(boardSize);

    for (let i = 0; i < moveCurPawn.length; i++) {
      let resMinimax = minimax(
        curD + 1,
        moveCurPawn[i],
        !isMax,
        alpha,
        beta,
        turn
      );
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
    let temperatureSchedule = (iteration, T) => T - iteration + 0.5 * iteration;
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
      let h = heuristicFunction(randomState, owner);

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

  const minimaxLocal = (curD, curS, isMax, alpha, beta, turn) => {
    console.log(curD, curS);
    // Base Case:
    // If depth limit reach or current state is already final
    // Compute state heuristic function
    if (curD === depth || curS.isFinalState()) {
      return [heuristicFunction(curS, turn), curS];
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
      moveCurPawn.push(
        simulatedAnnealing(curS, isMax ? turn : turn === 2 ? 1 : 2)[1]
      );
    }

    for (let i = 0; i < moveCurPawn.length; i++) {
      // Recursively call function for next depth (DFS)
      let resMinimax = minimaxLocal(
        curD + 1,
        moveCurPawn[i],
        !isMax,
        alpha,
        beta,
        turn
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

  return {
    state,
    movePawn,
    turn,
    changeTurn,
    getPawnInPosition,
    minimax,
    seconds,
    heuristicFunction,
  };
};

export default useHalma;
