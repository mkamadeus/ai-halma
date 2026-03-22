import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTimer } from "react-timer-hook";
import State from "../models/State";
import useBoard from "./useBoard";
import { usePlayerStopwatch } from "./usePlayerStopwatch";

const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
};

const MIN_AI_DELAY = 500;

const euclideanDistance = (r1, c1, r2, c2) => {
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(c2 - c1, 2));
};

const heuristicFunction = (curS, owner) => {
  let goal = curS.board.generateGoal(owner);
  let goalOp = curS.board.generateGoal(3 - owner);
  let myDistance = 0.0;
  let opDistance = 0.0;
  let pawn = null;
  let value = 0.0;
  for (let i = 0; i < curS.board.getBoardSize(); i++) {
    for (let j = 0; j < curS.board.getBoardSize(); j++) {
      pawn = curS.getPawnInPosition(i, j);
      if (pawn) {
        if (pawn.owner == owner) {
          let myDist = [];
          for (let k = 0; k < goal.length; k++) {
            if (curS.getPawnInPosition(goal[k][0], goal[k][1])) {
              if (
                curS.getPawnInPosition(goal[k][0], goal[k][1]).owner != owner
              ) {
                myDist.push(euclideanDistance(i, j, goal[k][0], goal[k][1]));
              }
            } else {
              myDist.push(euclideanDistance(i, j, goal[k][0], goal[k][1]));
            }
          }
          if (myDist.length == 0) {
            myDistance += 50;
          } else {
            myDistance -= myDist.reduce(function (a, b) {
              return Math.max(a, b);
            });
          }
        } else {
          let opDist = [];
          for (let k = 0; k < goalOp.length; k++) {
            if (curS.getPawnInPosition(goalOp[k][0], goalOp[k][1])) {
              if (
                curS.getPawnInPosition(goalOp[k][0], goalOp[k][1]).owner !=
                3 - owner
              ) {
                opDist.push(
                  euclideanDistance(i, j, goalOp[k][0], goalOp[k][1]),
                );
              }
            } else {
              opDist.push(euclideanDistance(i, j, goalOp[k][0], goalOp[k][1]));
            }
          }
          if (opDist.length == 0) {
            opDistance += 50;
          } else {
            opDistance -= opDist.reduce(function (a, b) {
              return Math.max(a, b);
            });
          }
        }
      }
    }
  }
  value = myDistance - opDistance;
  return value;
};

const useHalma = (boardSize, depth, timer, player1, player2) => {
  const { state, setState } = useBoard(boardSize);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const aiDelayRef = useRef(null);
  const aiComputeRef = useRef(null);

  const stateRef = useRef(state);
  stateRef.current = state;
  const turnRef = useRef(turn);
  turnRef.current = turn;

  const newTimer = useCallback(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + timer);
    return time;
  }, [timer]);

  const changeTurnRef = useRef(null);

  const { seconds, pause, restart } = useTimer({
    expiryTimestamp: newTimer(),
    onExpire: () => {
      if (changeTurnRef.current) changeTurnRef.current();
    },
  });

  const [timer1, start1, pause1] = usePlayerStopwatch();
  const [timer2, start2, pause2] = usePlayerStopwatch();

  const changeTurn = useCallback(() => {
    restart(newTimer());
    const t = turnRef.current;
    if (t === 1) {
      pause1();
      start2();
      setTurn(2);
    } else {
      pause2();
      start1();
      setTurn(1);
    }
  }, [restart, newTimer, pause1, start2, pause2, start1]);

  changeTurnRef.current = changeTurn;

  const generateAllMoveSet = (curS, ply) => {
    const allMoveset = [];
    const selectedPawnList = ply === 1 ? curS.pawnList1 : curS.pawnList2;

    for (let p = 0; p < selectedPawnList.length; p++) {
      let moveset = curS.generateMoveset(
        selectedPawnList[p].row,
        selectedPawnList[p].col,
      );
      for (let i = 0; i < moveset.length; i++) {
        let s = curS.copyState();
        s.movePawn(
          selectedPawnList[p].row,
          selectedPawnList[p].col,
          moveset[i][0],
          moveset[i][1],
        );
        allMoveset.push(s);
      }
    }

    return allMoveset;
  };

  const minimax = (curD, curS, isMax, alpha, beta, turn) => {
    let result = [];
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
        turn,
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
    let moveCurPawn = generateAllMoveSet(curS, owner);
    let max = null;
    let s = null;

    let temperatureSchedule = (iteration, T) => T - iteration + 0.5 * iteration;
    let randomWalkProbability = (delta, iteration) =>
      Math.exp(delta / temperatureSchedule(iteration));

    let iteration = 1;
    let T = 100;
    while (temperatureSchedule(iteration, T) > 0) {
      let temp = temperatureSchedule(iteration, T);
      let randomState =
        moveCurPawn[Math.floor(Math.random() * moveCurPawn.length)];

      let h = heuristicFunction(randomState, owner);

      if (!max || h > max) {
        max = h;
        s = randomState;
      } else if (h <= max) {
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
    if (curD === depth || curS.isFinalState()) {
      return [heuristicFunction(curS, turn), curS];
    }

    let bestMoveValue = isMax
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;
    let bestMove = null;

    let moveCurPawn = [];
    for (let i = 0; i < 10; i++) {
      moveCurPawn.push(
        simulatedAnnealing(curS, isMax ? turn : turn === 2 ? 1 : 2)[1],
      );
    }

    for (let i = 0; i < moveCurPawn.length; i++) {
      let resMinimax = minimaxLocal(
        curD + 1,
        moveCurPawn[i],
        !isMax,
        alpha,
        beta,
        turn,
      );

      if (isMax && bestMoveValue < resMinimax[0]) {
        bestMoveValue = resMinimax[0];
        bestMove = moveCurPawn[i];
        alpha = Math.max(alpha, resMinimax[0]);

        if (beta <= alpha) {
          return [alpha, bestMove];
        }
      } else if (!isMax && bestMoveValue > resMinimax[0]) {
        bestMoveValue = resMinimax[0];
        bestMove = moveCurPawn[i];
        beta = Math.min(beta, resMinimax[0]);

        if (beta <= alpha) {
          return [beta, bestMove];
        }
      }
    }

    return [bestMoveValue, bestMove];
  };

  useEffect(() => {
    const newState = state.copyState();

    if (newState.isFinalState()) {
      pause();
      pause1();
      pause2();
      setWinner({
        player: turn === 1 ? 2 : 1,
        timer1: formatTime(timer1),
        timer2: formatTime(timer2),
      });
    } else {
      if (newState.pawnList1.length === 0) {
        start1();
        newState.initialState();
        setState(newState);
      }

      if (
        (turn === 1 && player1 !== "human") ||
        (turn === 2 && player2 !== "human")
      ) {
        setAiThinking(true);

        aiComputeRef.current = setTimeout(() => {
          const currentPlayer = turn === 1 ? player1 : player2;
          const startMs = performance.now();
          const result =
            currentPlayer === "minimaxlocal"
              ? minimaxLocal(
                  1,
                  newState,
                  true,
                  Number.NEGATIVE_INFINITY,
                  Number.POSITIVE_INFINITY,
                  turn,
                )[1]
              : minimax(
                  1,
                  newState,
                  true,
                  Number.NEGATIVE_INFINITY,
                  Number.POSITIVE_INFINITY,
                  turn,
                )[1];
          const computeMs = performance.now() - startMs;

          if (turn === 1) pause1();
          else pause2();

          const applyMove = () => {
            setAiThinking(false);
            setState(result);
            changeTurn();
          };

          const remaining = MIN_AI_DELAY - computeMs;
          if (remaining > 0) {
            aiDelayRef.current = setTimeout(applyMove, remaining);
          } else {
            applyMove();
          }
        }, 0);
      }
    }

    return () => {
      if (aiComputeRef.current) clearTimeout(aiComputeRef.current);
      if (aiDelayRef.current) clearTimeout(aiDelayRef.current);
    };
  }, [turn]);

  const getPawnInPosition = useCallback((r, c) => {
    return stateRef.current.getPawnInPosition(r, c);
  }, []);

  const movePawn = useCallback(
    (r1, c1, r2, c2) => {
      const newState = stateRef.current.copyState();
      newState.movePawn(r1, c1, r2, c2);
      setState(newState);
    },
    [setState],
  );

  const score = useMemo(() => heuristicFunction(state, turn), [state, turn]);

  return {
    state,
    movePawn,
    turn,
    changeTurn,
    getPawnInPosition,
    seconds,
    score,
    winner,
    aiThinking,
  };
};

export default useHalma;
