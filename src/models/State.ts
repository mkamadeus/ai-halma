import Board from "./Board";

import { generateBoard } from "../common/generateBoard";
import Pawn from "./Pawn";
import type { PlayerOwner, Position } from "../types";

export default class State {
  board: Board;
  pawnList1: Pawn[];
  pawnList2: Pawn[];
  prevPosition: Position | null;
  currentMove: Position | null;
  private pawnMap: Map<string, Pawn> = new Map();

  constructor(boardSize: number) {
    this.board = new Board(boardSize);
    this.pawnList1 = [];
    this.pawnList2 = [];
    this.prevPosition = null;
    this.currentMove = null;
  }

  private static posKey(r: number, c: number): string {
    return `${r},${c}`;
  }

  copyState(): State {
    const copiedState = new State(this.board.getBoardSize());
    for (let i = 0; i < this.pawnList1.length; i++) {
      const pawn1 = this.pawnList1[i]!;
      const cp1 = pawn1.copyPawn();
      copiedState.pawnList1.push(cp1);
      copiedState.board.setBoard(pawn1.row, pawn1.col, 1);
      copiedState.pawnMap.set(State.posKey(pawn1.row, pawn1.col), cp1);

      const pawn2 = this.pawnList2[i]!;
      const cp2 = pawn2.copyPawn();
      copiedState.pawnList2.push(cp2);
      copiedState.board.setBoard(pawn2.row, pawn2.col, 2);
      copiedState.pawnMap.set(State.posKey(pawn2.row, pawn2.col), cp2);
    }
    return copiedState;
  }

  initialState(): void {
    const n = Math.floor(this.board.getBoardSize() / 2);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i; j++) {
        this.board.setBoard(i, j, 1);
        const p1 = new Pawn("#00a2ff", 1, i, j);
        this.pawnList1.push(p1);
        this.pawnMap.set(State.posKey(i, j), p1);

        const r2 = this.board.getBoardSize() - i - 1;
        const c2 = this.board.getBoardSize() - j - 1;
        this.board.setBoard(r2, c2, 2);
        const p2 = new Pawn("#ff9a00", 2, r2, c2);
        this.pawnList2.push(p2);
        this.pawnMap.set(State.posKey(r2, c2), p2);
      }
    }
  }

  isFinalState(): boolean {
    const boardSize = this.board.getBoardSize();
    let isFinal2 = true;
    for (let i = 0; i < boardSize / 2; i++) {
      for (let j = 0; j < boardSize / 2 - i; j++) {
        if (this.board.getBoard(i, j) !== 2) {
          isFinal2 = false;
          break;
        }
      }
      if (!isFinal2) break;
    }

    let isFinal1 = true;
    for (let i = 0; i < boardSize / 2; i++) {
      for (let j = 0; j < boardSize / 2 - i; j++) {
        if (this.board.getBoard(boardSize - i - 1, boardSize - j - 1) !== 1) {
          isFinal1 = false;
          break;
        }
      }
      if (!isFinal1) break;
    }

    return isFinal1 || isFinal2;
  }

  generateMoveset(r: number, c: number): Position[] | undefined {
    try {
      if (!this.board.hasPawn(r, c)) {
        throw new Error(`No pawn in position (${r},${c})`);
      }

      const moveset: Position[] = [];
      const queue: Position[] = [];
      const visited = generateBoard(this.board.getBoardSize(), false);
      const possibleMoves: Position[] = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      const pawn = this.getPawnInPosition(r, c)!;
      const opponentOwner = (3 - pawn.owner) as PlayerOwner;
      const inOpponentZone = this.board.isStartingTile(
        pawn.row,
        pawn.col,
        opponentOwner,
      );

      for (let i = 0; i < possibleMoves.length; i++) {
        const move = possibleMoves[i]!;
        const curMove: Position = [r + move[0], c + move[1]];
        if (inOpponentZone) {
          if (
            this.board.isPositionValid(curMove[0], curMove[1]) &&
            !visited[curMove[0]]![curMove[1]] &&
            !this.board.getBoard(curMove[0], curMove[1]) &&
            this.board.isStartingTile(
              pawn.row + move[0],
              pawn.col + move[1],
              opponentOwner,
            )
          ) {
            moveset.push(curMove);
            visited[curMove[0]]![curMove[1]] = true;
          }
        } else {
          if (
            this.board.isPositionValid(curMove[0], curMove[1]) &&
            !visited[curMove[0]]![curMove[1]] &&
            !this.board.getBoard(curMove[0], curMove[1])
          ) {
            moveset.push(curMove);
            visited[curMove[0]]![curMove[1]] = true;
          }
        }
      }

      queue.push([r, c]);
      visited[r]![c] = true;
      while (queue.length !== 0) {
        const curPos = queue.pop()!;
        for (let i = 0; i < possibleMoves.length; i++) {
          const move = possibleMoves[i]!;
          const curMove: Position = [curPos[0] + move[0], curPos[1] + move[1]];
          const curJumpMove: Position = [
            curPos[0] + 2 * move[0],
            curPos[1] + 2 * move[1],
          ];
          if (inOpponentZone) {
            if (
              this.board.isPositionValid(curMove[0], curMove[1]) &&
              this.board.getBoard(curMove[0], curMove[1]) &&
              this.board.isPositionValid(curJumpMove[0], curJumpMove[1]) &&
              !visited[curJumpMove[0]]![curJumpMove[1]] &&
              !this.board.getBoard(curJumpMove[0], curJumpMove[1]) &&
              this.board.isStartingTile(
                pawn.row + 2 * move[0],
                pawn.col + 2 * move[1],
                opponentOwner,
              )
            ) {
              moveset.push(curJumpMove);
              queue.push(curJumpMove);
              visited[curJumpMove[0]]![curJumpMove[1]] = true;
            }
          } else {
            if (
              this.board.isPositionValid(curMove[0], curMove[1]) &&
              this.board.getBoard(curMove[0], curMove[1]) &&
              this.board.isPositionValid(curJumpMove[0], curJumpMove[1]) &&
              !visited[curJumpMove[0]]![curJumpMove[1]] &&
              !this.board.getBoard(curJumpMove[0], curJumpMove[1])
            ) {
              moveset.push(curJumpMove);
              queue.push(curJumpMove);
              visited[curJumpMove[0]]![curJumpMove[1]] = true;
            }
          }
        }
      }

      return moveset;
    } catch (err) {
      console.log((err as Error).message);
    }
  }

  isMoveValid(r1: number, c1: number, r2: number, c2: number): boolean {
    const moveset = this.generateMoveset(r1, c1);
    if (!moveset) return false;
    for (let i = 0; i < moveset.length; i++) {
      if (moveset[i]![0] === r2 && moveset[i]![1] === c2) {
        return this.board.hasPawn(r1, c1) && !this.board.hasPawn(r2, c2);
      }
    }
    return false;
  }

  getPawnInPosition(r: number, c: number): Pawn | null {
    return this.pawnMap.get(State.posKey(r, c)) ?? null;
  }

  movePawn(r1: number, c1: number, r2: number, c2: number): void {
    if (!this.isMoveValid(r1, c1, r2, c2)) {
      throw new Error("Invalid move");
    }
    this.unsafeMovePawn(r1, c1, r2, c2);
  }

  unsafeMovePawn(r1: number, c1: number, r2: number, c2: number): void {
    const key1 = State.posKey(r1, c1);
    const pawn = this.pawnMap.get(key1)!;
    this.pawnMap.delete(key1);
    pawn.row = r2;
    pawn.col = c2;
    this.pawnMap.set(State.posKey(r2, c2), pawn);
    this.board.setBoard(r2, c2, pawn.owner);
    this.board.setBoard(r1, c1, 0);
    this.prevPosition = [r1, c1];
    this.currentMove = [r2, c2];
  }
}
