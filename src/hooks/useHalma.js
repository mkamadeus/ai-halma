import { useState, useEffect, useCallback } from "react";

const generateBoard = (size, initialValue) => {
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      if (!initialValue) {
        row.push(null);
      } else {
        row.push(initialValue);
      }
    }
    board.push(row);
  }

  return board;
};

const useHalma = (boardSize) => {
  const [board, setBoard] = useState(generateBoard(boardSize));
  const [turn, setTurn] = useState(1);
  const [moves, setMoves] = useState([]);
  const [goal, setGoal] = useState([]);

  const possibleMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

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

  const isPositionValid = (r, c) => {
    return r >= 0 && r < boardSize && c >= 0 && c < boardSize;
  };

  const generateMoveset = (r, c) => {
    try {
      // 1. Check if (r,c) has a pawn
      if (!board[r][c]) {
        throw new Error(`No pawn in position (${r},${c})`);
      }
      // 2. Using BFS, generate valid moveset
      const moveset = [];
      const queue = [];
      const visited = generateBoard(boardSize, false);

      for (let i = 0; i < possibleMoves.length; i++) {
        const curMove = [r + possibleMoves[i][0], c + possibleMoves[i][1]];

        if (
          isPositionValid(curMove[0], curMove[1]) &&
          !visited[curMove[0]][curMove[1]] &&
          !board[curMove[0]][curMove[1]]
        ) {
          moveset.push(curMove);
          visited[curMove[0]][curMove[1]] = true;
        }
      }
      queue.push([r, c]);
      visited[r][c] = true;
      while (queue.length !== 0) {
        const curPos = queue.pop();
        for (let i = 0; i < possibleMoves.length; i++) {
          const curMove = [
            curPos[0] + possibleMoves[i][0],
            curPos[1] + possibleMoves[i][1],
          ];
          const curJumpMove = [
            curPos[0] + 2 * possibleMoves[i][0],
            curPos[1] + 2 * possibleMoves[i][1],
          ];
          if (
            isPositionValid(curMove[0], curMove[1]) &&
            board[curMove[0]][curMove[1]] &&
            isPositionValid(curJumpMove[0], curJumpMove[1]) &&
            !visited[curJumpMove[0]][curJumpMove[1]] &&
            !board[curJumpMove[0]][curJumpMove[1]]
          ) {
            moveset.push(curJumpMove);
            queue.push(curJumpMove);
            visited[curJumpMove[0]][curJumpMove[1]] = true;
          }
        }
      }
      console.log(moveset);
      setMoves(moveset);
      // 3. Return array
    } catch (err) {
      console.log(err.message);
    }
  };

  const emptyMoves = () => {
    setMoves([]);
  };

  const isMoveValid = (r, c) => {
    for (let i = 0; i < moves.length; i++) {
      if (moves[i][0] === r && moves[i][1] === c) {
        return true;
      }
    }
    return false;
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

  const generateGoal = (owner) => {
    // Check if (r,c) is final tile

    if(owner == 1) {
      var num = 5
      for(let i = 0; i < boardSize/2; i++) {
        num -= 1
        for(let j = 0; j < num; j++) {
          let pos = [i,j]
          goal.push(pos)
        }
      }
    }
    
    else {
      var num = 1
      for(let i = boardSize/2; i < boardSize; i++) {
        num += 1
        for(let j = boardSize-1; j > boardSize-num; j--) {
          let pos = [i,j]
          goal.push(pos)
        }
      }
    }
    console.log(goal)
    setGoal(goal)
  };

  const minimax = (heuristicFunction) => {
    // 1. For each pawn, generate valid moveset, compute heuristic value
    // 2. Generate using DFS & alpha-beta pruning
    // 3. Execute most optimal move
  };

  const localSearch = () => {
    // ??
  };

  return [
    board,
    turn,
    changeTurn,
    movePawn,
    generateMoveset,
    moves,
    isMoveValid,
    emptyMoves,
    minimax,
    localSearch,
  ];
};

export default useHalma;
