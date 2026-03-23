import type { PlayerOwner } from "../types";

export default class Pawn {
  color: string;
  owner: PlayerOwner;
  row: number;
  col: number;

  constructor(color: string, owner: PlayerOwner, row: number, col: number) {
    this.color = color;
    this.owner = owner;
    this.row = row;
    this.col = col;
  }

  copyPawn(): Pawn {
    return new Pawn(this.color, this.owner, this.row, this.col);
  }

  getColor(): string {
    return this.color;
  }

  getOwner(): PlayerOwner {
    return this.owner;
  }

  getRow(): number {
    return this.row;
  }

  getCol(): number {
    return this.col;
  }
}
