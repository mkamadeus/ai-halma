import { generateBoard } from "../common/generateBoard";
import type { PlayerOwner, Position } from "../types";

/** Board cell: 0 = empty, 1 = player 1 pawn, 2 = player 2 pawn */
export type BoardCell = 0 | PlayerOwner;

export default class Board {
  boardSize: number;
  board: BoardCell[][];

  constructor(boardSize: number) {
    this.boardSize = boardSize;
    this.board = generateBoard<BoardCell>(boardSize, 0);
  }

  isPositionValid(r: number, c: number): boolean {
    return r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize;
  }

  hasPawn(r: number, c: number): boolean {
    if (!this.isPositionValid(r, c)) throw new Error("Invalid position");
    return this.board[r]![c] !== 0;
  }

  getBoard(r: number, c: number): BoardCell {
    if (!this.isPositionValid(r, c)) throw new Error("Invalid position");
    return this.board[r]![c]!;
  }

  setBoard(r: number, c: number, val: BoardCell): void {
    if (!this.isPositionValid(r, c)) throw new Error("Invalid position");
    this.board[r]![c] = val;
  }

  getBoardSize(): number {
    return this.boardSize;
  }

  isStartingTile(r: number, c: number, owner: PlayerOwner): boolean {
    if (owner === 1) {
      return r + c - Math.floor(this.boardSize / 2) + 1 <= 0;
    } else {
      return r + c - Math.floor((3 * this.boardSize) / 2) + 1 >= 0;
    }
  }

  generateGoal(owner: PlayerOwner): Position[] {
    const boardSize = this.getBoardSize() / 2;
    const goal: Position[] = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize - i; j++) {
        let pos: Position;
        if (owner === 2) {
          pos = [i, j];
        } else {
          pos = [this.getBoardSize() - i - 1, this.getBoardSize() - j - 1];
        }
        goal.push(pos);
      }
    }
    return goal;
  }
}
