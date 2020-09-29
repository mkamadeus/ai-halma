import Player from "./Player";

export default class Halma {
  constructor(boardSize) {
    this.player1 = new Player("#000", true, boardSize);
    this.player2 = new Player("#FFF", true, boardSize);
    this.turn = this.player1;
  }

  /**
   * Move a pawn from position (r1,c1) to (r2,c2)
   * @param {number} r1 Starting row
   * @param {number} c1 Starting column
   * @param {number} r2 Target row
   * @param {number} c2 Target column
   */
  movePawn = (r1, c1, r2, c2) => {
    // 1. Check ada pawn ato ngga di (r1, c1)
    // 2. Kalo ada, cek turn sekarang
    // 3. Kalo sesuai, bisa pindahin, cek dulu valid ato ngga si (r2,c2) untuk pion itu
  };

  /**
   * Change current player playing.
   */
  changeTurn = () => {
    this.turn = this.player1 === this.turn ? this.player2 : this.player1;
  };
}
