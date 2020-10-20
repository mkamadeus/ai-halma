import Board from "./Board";
import { generateBoard } from "../common/generateBoard";
import Pawn from "./Pawn";

export default class State {
  constructor(boardSize) {
    this.board = new Board(boardSize);
    this.pawnList1 = [];
    this.pawnList2 = [];
    this.prevPosition = null;
    this.currentMove = null;
  }

  copyState() {
    const copiedState = new State(this.board.getBoardSize());
    for (let i = 0; i < this.pawnList1.length; i++) {
      const pawn1 = this.pawnList1[i];
      copiedState.pawnList1.push(pawn1.copyPawn());
      copiedState.board.setBoard(pawn1.row, pawn1.col, 1);

      const pawn2 = this.pawnList2[i];
      copiedState.pawnList2.push(pawn2.copyPawn());
      copiedState.board.setBoard(pawn2.row, pawn2.col, 2);
    }
    return copiedState;
  }

  initialState() {
    const n = Math.floor(this.board.getBoardSize() / 2);
    console.log("State n =", n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i; j++) {
        // Initiate player 1
        this.board.setBoard(i, j, 1);
        this.pawnList1.push(new Pawn("#00a2ff", 1, i, j));

        // Initiate player 2
        this.board.setBoard(
          this.board.getBoardSize() - i - 1,
          this.board.getBoardSize() - j - 1,
          2
        );
        this.pawnList2.push(
          new Pawn(
            "#ff9a00",
            2,
            this.board.getBoardSize() - i - 1,
            this.board.getBoardSize() - j - 1
          )
        );
      }
    }
  }

  isFinalState() {
    const boardSize = this.board.getBoardSize();
    let isFinal2 = true;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (this.board.getBoard(i, j) !== 2) {
          isFinal2 = false;
          break;
        }
      }
      if (!isFinal2) break;
    }

    let isFinal1 = true;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (this.board.getBoard(boardSize - i - 1, boardSize - j - 1) !== 1) {
          isFinal1 = false;
          break;
        }
      }
      if (!isFinal2) break;
    }

    return isFinal1 || isFinal2;
  }

  generateMoveset(r, c) {
    try {
      // 1. Check if (r,c) has a pawn
      if (!this.board.hasPawn(r, c)) {
        throw new Error(`No pawn in position (${r},${c})`);
      }
      // 2. Using BFS, generate valid moveset
      const moveset = [];
      const queue = [];
      const visited = generateBoard(this.board.getBoardSize(), false);
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
      const pawn = this.getPawnInPosition(r, c);
      // 8 tiles around pawn
      for (let i = 0; i < possibleMoves.length; i++) {
        const curMove = [r + possibleMoves[i][0], c + possibleMoves[i][1]];
        if (this.board.isFinalTile(pawn.row, pawn.col, 3 - pawn.owner)) {
          if (
            this.board.isPositionValid(curMove[0], curMove[1]) &&
            !visited[curMove[0]][curMove[1]] &&
            !this.board.getBoard(curMove[0], curMove[1]) &&
            this.board.isFinalTile(
              pawn.row + possibleMoves[i][0],
              pawn.col + possibleMoves[i][1],
              3 - pawn.owner
            )
          ) {
            moveset.push(curMove);
            visited[curMove[0]][curMove[1]] = true;
          }
        } else {
          if (
            this.board.isPositionValid(curMove[0], curMove[1]) &&
            !visited[curMove[0]][curMove[1]] &&
            !this.board.getBoard(curMove[0], curMove[1])
          ) {
            moveset.push(curMove);
            visited[curMove[0]][curMove[1]] = true;
          }
        }
      }

      // Find jumps
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
          if (this.board.isFinalTile(pawn.row, pawn.col, 3 - pawn.owner)) {
            if (
              this.board.isPositionValid(curMove[0], curMove[1]) &&
              this.board.getBoard(curMove[0], curMove[1]) &&
              this.board.isPositionValid(curJumpMove[0], curJumpMove[1]) &&
              !visited[curJumpMove[0]][curJumpMove[1]] &&
              !this.board.getBoard(curJumpMove[0], curJumpMove[1]) &&
              this.board.isFinalTile(
                pawn.row + 2 * possibleMoves[i][0],
                pawn.col + 2 * possibleMoves[i][1],
                3 - pawn.owner
              )
            ) {
              moveset.push(curJumpMove);
              queue.push(curJumpMove);
              visited[curJumpMove[0]][curJumpMove[1]] = true;
            }
          } else {
            if (
              this.board.isPositionValid(curMove[0], curMove[1]) &&
              this.board.getBoard(curMove[0], curMove[1]) &&
              this.board.isPositionValid(curJumpMove[0], curJumpMove[1]) &&
              !visited[curJumpMove[0]][curJumpMove[1]] &&
              !this.board.getBoard(curJumpMove[0], curJumpMove[1])
            ) {
              moveset.push(curJumpMove);
              queue.push(curJumpMove);
              visited[curJumpMove[0]][curJumpMove[1]] = true;
            }
          }
        }
      }

      // 3. Return array
      return moveset;
    } catch (err) {
      console.log(err.message);
    }
  }

  isMoveValid(r1, c1, r2, c2) {
    const moveset = this.generateMoveset(r1, c1);
    for (let i = 0; i < moveset.length; i++) {
      if (moveset[i][0] === r2 && moveset[i][1] === c2) {
        return this.board.hasPawn(r1, c1) && !this.board.hasPawn(r2, c2);
      }
    }
    return false;
  }

  getPawnInPosition(r, c) {
    let pawn = null;
    for (let i = 0; i < this.pawnList1.length; i++) {
      if (
        this.pawnList1[i].getRow() === r &&
        this.pawnList1[i].getCol() === c
      ) {
        pawn = this.pawnList1[i];
        break;
      }
      if (
        this.pawnList2[i].getRow() === r &&
        this.pawnList2[i].getCol() === c
      ) {
        pawn = this.pawnList2[i];
        break;
      }
    }
    return pawn;
  }

  movePawn(r1, c1, r2, c2) {
    if (!this.isMoveValid(r1, c1, r2, c2)) {
      throw new Error("Invalid move");
    }
    const pawn = this.getPawnInPosition(r1, c1);
    // console.log("ss");
    pawn.row = r2;
    pawn.col = c2;
    this.board.setBoard(r2, c2, pawn.owner);
    this.board.setBoard(r1, c1, 0);
    this.prevPosition = [r1, c1];
    this.currentMove = [r2, c2];
  }
}
