import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTimer } from "react-timer-hook";
import State from "../models/State";
import Pawn from "../models/Pawn";
import useBoard from "./useBoard";
import { usePlayerStopwatch } from "./usePlayerStopwatch";
import type { PlayerOwner, PlayerType } from "../types";

export interface WinnerInfo {
  player: PlayerOwner;
  timer1: string;
  timer2: string;
}

export interface UseHalmaReturn {
  state: State;
  movePawn: (r1: number, c1: number, r2: number, c2: number) => void;
  turn: PlayerOwner;
  changeTurn: () => void;
  getPawnInPosition: (r: number, c: number) => Pawn | null;
  seconds: number;
  score: number;
  winner: WinnerInfo | null;
  aiThinking: boolean;
}

const formatTime = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
};

const MIN_AI_DELAY = 500;

const euclideanDistance = (
  r1: number,
  c1: number,
  r2: number,
  c2: number,
): number => {
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(c2 - c1, 2));
};

const heuristicFunction = (curS: State, owner: PlayerOwner): number => {
  const goal = curS.board.generateGoal(owner);
  const opponentOwner = (3 - owner) as PlayerOwner;
  const goalOp = curS.board.generateGoal(opponentOwner);
  let myDistance = 0.0;
  let opDistance = 0.0;
  let value = 0.0;
  for (let i = 0; i < curS.board.getBoardSize(); i++) {
    for (let j = 0; j < curS.board.getBoardSize(); j++) {
      const pawn = curS.getPawnInPosition(i, j);
      if (pawn) {
        if (pawn.owner === owner) {
          const myDist: number[] = [];
          for (let k = 0; k < goal.length; k++) {
            const goalPos = goal[k]!;
            const goalPawn = curS.getPawnInPosition(goalPos[0], goalPos[1]);
            if (goalPawn) {
              if (goalPawn.owner !== owner) {
                myDist.push(euclideanDistance(i, j, goalPos[0], goalPos[1]));
              }
            } else {
              myDist.push(euclideanDistance(i, j, goalPos[0], goalPos[1]));
            }
          }
          if (myDist.length === 0) {
            myDistance += 50;
          } else {
            myDistance -= myDist.reduce(function (a, b) {
              return Math.max(a, b);
            });
          }
        } else {
          const opDist: number[] = [];
          for (let k = 0; k < goalOp.length; k++) {
            const goalOpPos = goalOp[k]!;
            const goalOpPawn = curS.getPawnInPosition(
              goalOpPos[0],
              goalOpPos[1],
            );
            if (goalOpPawn) {
              if (goalOpPawn.owner !== opponentOwner) {
                opDist.push(
                  euclideanDistance(i, j, goalOpPos[0], goalOpPos[1]),
                );
              }
            } else {
              opDist.push(euclideanDistance(i, j, goalOpPos[0], goalOpPos[1]));
            }
          }
          if (opDist.length === 0) {
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

const useHalma = (
  boardSize: number,
  depth: number,
  timer: number,
  player1: PlayerType,
  player2: PlayerType,
): UseHalmaReturn => {
  const { state, setState } = useBoard(boardSize);
  const [turn, setTurn] = useState<PlayerOwner>(1);
  const [winner, setWinner] = useState<WinnerInfo | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const aiDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiComputeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;
  const turnRef = useRef(turn);
  turnRef.current = turn;

  const newTimer = useCallback(() => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + timer);
    return time;
  }, [timer]);

  const changeTurnRef = useRef<(() => void) | null>(null);

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

  const generateAllMoveSet = (curS: State, ply: PlayerOwner): State[] => {
    const allMoveset: State[] = [];
    const selectedPawnList = ply === 1 ? curS.pawnList1 : curS.pawnList2;

    for (let p = 0; p < selectedPawnList.length; p++) {
      const pawn = selectedPawnList[p]!;
      const moveset = curS.generateMoveset(pawn.row, pawn.col);
      if (!moveset) continue;
      for (let i = 0; i < moveset.length; i++) {
        const move = moveset[i]!;
        const s = curS.copyState();
        s.movePawn(pawn.row, pawn.col, move[0], move[1]);
        allMoveset.push(s);
      }
    }

    return allMoveset;
  };

  const minimax = (
    curD: number,
    curS: State,
    isMax: boolean,
    alpha: number,
    beta: number,
    turn: PlayerOwner,
  ): [number, State] => {
    if (curD === depth || curS.isFinalState()) {
      return [heuristicFunction(curS, turn), curS];
    }

    let moveCurPawn: State[];
    let value: number;
    if (isMax) {
      value = Number.NEGATIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, turn);
    } else {
      value = Number.POSITIVE_INFINITY;
      moveCurPawn = generateAllMoveSet(curS, turn === 2 ? 1 : 2);
    }

    let bestMove: State = new State(boardSize);
    for (let i = 0; i < moveCurPawn.length; i++) {
      const resMinimax = minimax(
        curD + 1,
        moveCurPawn[i]!,
        !isMax,
        alpha,
        beta,
        turn,
      );
      if (isMax && value < resMinimax[0]) {
        value = resMinimax[0];
        bestMove = moveCurPawn[i]!;
        alpha = Math.max(alpha, resMinimax[0]);
        if (beta <= alpha) {
          return [alpha, bestMove];
        }
      } else if (!isMax && value > resMinimax[0]) {
        value = resMinimax[0];
        bestMove = moveCurPawn[i]!;
        beta = Math.min(beta, resMinimax[0]);
        value = beta;
        if (beta <= alpha) {
          return [beta, bestMove];
        }
      }
    }

    return [value, bestMove];
  };

  const simulatedAnnealing = (
    curS: State,
    owner: PlayerOwner,
  ): [number, State] => {
    const moveCurPawn = generateAllMoveSet(curS, owner);
    let max: number | null = null;
    let s: State | null = null;

    const temperatureSchedule = (iteration: number, T: number): number =>
      T - iteration + 0.5 * iteration;
    const randomWalkProbability = (delta: number, iteration: number): number =>
      Math.exp(delta / temperatureSchedule(iteration, 100));

    let iteration = 1;
    let T = 100;
    while (temperatureSchedule(iteration, T) > 0) {
      const temp = temperatureSchedule(iteration, T);
      const randomState =
        moveCurPawn[Math.floor(Math.random() * moveCurPawn.length)]!;

      const h = heuristicFunction(randomState, owner);

      if (max === null || h > max) {
        max = h;
        s = randomState;
      } else if (h <= max) {
        const n = Math.random();
        if (n <= randomWalkProbability(h - max, iteration)) {
          max = h;
          s = randomState;
        }
      }
      iteration++;
      T = temp;
    }
    return [max ?? 0, s ?? curS];
  };

  const minimaxLocal = (
    curD: number,
    curS: State,
    isMax: boolean,
    alpha: number,
    beta: number,
    turn: PlayerOwner,
  ): [number, State] => {
    if (curD === depth || curS.isFinalState()) {
      return [heuristicFunction(curS, turn), curS];
    }

    let bestMoveValue = isMax
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;
    let bestMove: State | null = null;

    const moveCurPawn: State[] = [];
    for (let i = 0; i < 10; i++) {
      moveCurPawn.push(
        simulatedAnnealing(curS, isMax ? turn : turn === 2 ? 1 : 2)[1],
      );
    }

    for (let i = 0; i < moveCurPawn.length; i++) {
      const resMinimax = minimaxLocal(
        curD + 1,
        moveCurPawn[i]!,
        !isMax,
        alpha,
        beta,
        turn,
      );

      if (isMax && bestMoveValue < resMinimax[0]) {
        bestMoveValue = resMinimax[0];
        bestMove = moveCurPawn[i]!;
        alpha = Math.max(alpha, resMinimax[0]);

        if (beta <= alpha) {
          return [alpha, bestMove];
        }
      } else if (!isMax && bestMoveValue > resMinimax[0]) {
        bestMoveValue = resMinimax[0];
        bestMove = moveCurPawn[i]!;
        beta = Math.min(beta, resMinimax[0]);

        if (beta <= alpha) {
          return [beta, bestMove];
        }
      }
    }

    return [bestMoveValue, bestMove ?? curS];
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
            currentPlayer === "minimaxLocal"
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

  const getPawnInPosition = useCallback((r: number, c: number): Pawn | null => {
    return stateRef.current.getPawnInPosition(r, c);
  }, []);

  const movePawn = useCallback(
    (r1: number, c1: number, r2: number, c2: number) => {
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
