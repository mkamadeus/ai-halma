import { useState, useEffect, useCallback } from "react";

const generateBoard = (size) => {
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(null);
    }
    board.push(row);
  }

  return board;
};

const useHalma = (boardSize) => {
  const [board, setBoard] = useState(generateBoard(boardSize));
  const [turn, setTurn] = useState(1);

  const initiateBoard = useCallback(() => {
    const newBoard = generateBoard(boardSize);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4 - i; j++) {
        newBoard[i][j] = {
          color: "#000",
          owner: 1,
        };
        newBoard[boardSize - i - 1][boardSize - j - 1] = {
          color: "#FFF",
          owner: 2,
        };
      }
    }
    setBoard(newBoard);
  }, [setBoard, boardSize]);

  useEffect(() => {
    initiateBoard();
  }, [initiateBoard]);

  const changeTurn = () => {
    setTurn(turn === 1 ? 2 : 1);
  };

  const generateMoveset = (r, c) => {
    // 1. Check if (r,c) has a pawn
    // 2. Using DFS, generate valid moveset
    // 3. Return array
  };

  const movePawn = (r1, c1, r2, c2) => {
    const newBoard = [...board];
    // 1. Check if (r1,c1) contains a pawn
    // 2. Check turn
    // 3. Check (r2,c2) validity, then move
    newBoard[r2][c2] = newBoard[r1][c1];
    newBoard[r1][c1] = null;
    // 4. Change turn
    changeTurn();
    setBoard(newBoard);
  };

  const isFinalTile = (r, c) => {
    // Check if (r,c) is final tile
  };

  const minimax = (heuristicFunction) => {
    // 1. For each pawn, generate valid moveset, compute heuristic value
    // 2. Generate using DFS & alpha-beta pruning
    // 3. Execute most optimal move
  };

  const localSearch = () => {
    // ??
  };

  return [board, changeTurn, movePawn, minimax, localSearch];
};

export default useHalma;
