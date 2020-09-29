import Pawn from "./Pawn";

export default class Player {
  constructor(color, isPlayer, boardSize) {
    this.color = color;
    this.pawns = [];
    if (!isPlayer) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4 - i; j++) {
          this.pawns.append(new Pawn(this, i, j));
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4 - i; j++) {
          this.pawns.append(
            new Pawn(this, boardSize - i - 1, boardSize - j - 1)
          );
        }
      }
    }
  }
}
