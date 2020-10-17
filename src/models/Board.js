import { generateBoard } from "../common/generateBoard";

export default class Board {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = generateBoard(boardSize, 0);
  }

  isPositionValid(r, c) {
    return r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize;
  }

  hasPawn(r, c) {
    if (!this.isPositionValid(r, c)) throw new Error("Invalid position");
    return this.board[r][c] !== 0;
  }

  getBoard(r, c) {
    if (!this.isPositionValid(r, c)) throw new Error("Invalid position");

    return this.board[r][c];
  }

  setBoard(r, c, val) {
    if (!this.isPositionValid(r, c)) throw new Error("Invalid position");

    this.board[r][c] = val;
  }

  getBoardSize() {
    return this.boardSize;
  }
}
