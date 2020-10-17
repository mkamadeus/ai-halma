export default class Pawn {
  constructor(color, owner, row, col) {
    this.color = color;
    this.owner = owner;
    this.row = row;
    this.col = col;
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
