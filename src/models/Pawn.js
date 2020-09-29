export default class Pawn {
  constructor(owner, row, col) {
    this.owner = owner;
    this.row = row;
    this.col = col;
  }

  printPawnInfo = () => {
    console.log(this.owner);
    console.log(this.location);
  };

  /**
   * Move pawn to (r,c)
   * @param {number} r Target row
   * @param {number} c Target col
   */
  move = (r, c) => {
    this.row = r;
    this.col = c;
  };
}
