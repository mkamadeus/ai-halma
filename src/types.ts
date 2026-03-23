export type PlayerOwner = 1 | 2;

export type PlayerType = "human" | "minimax" | "minimaxLocal";

export type Position = [number, number];

export interface GameConfig {
  boardSize: number;
  timeLimit: number;
  player1Type: PlayerType;
  player2Type: PlayerType;
}
