export default class Pawn {
  constructor(color, owner, row, col) {
    this.color = color;
    this.owner = owner;
    this.row = row;
    this.col = col;
  }

  copyPawn() {
    return new Pawn(this.color, this.owner, this.row, this.col);
  }

  getColor() {
    return this.color;
  }

  getOwner() {
    return this.owner;
  }

  getRow() {
    return this.row;
  }

  getCol() {
    return this.col;
  }
}
