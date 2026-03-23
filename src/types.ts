export type PlayerOwner = 1 | 2;

export type PlayerType = "human" | "minimax" | "minimaxLocal";

export type DifficultyLevel = "easy" | "medium" | "hard" | "hardPlus";

export interface DifficultyConfig {
  depth: number;
  algorithm: "minimax" | "minimaxLocal";
  saCandidates: number;
  noiseTopK: number;
}

export const DIFFICULTY_PRESETS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    depth: 2,
    algorithm: "minimaxLocal",
    saCandidates: 5,
    noiseTopK: 5,
  },
  medium: { depth: 2, algorithm: "minimax", saCandidates: 10, noiseTopK: 3 },
  hard: { depth: 3, algorithm: "minimax", saCandidates: 10, noiseTopK: 1 },
  hardPlus: {
    depth: 4,
    algorithm: "minimax",
    saCandidates: 10,
    noiseTopK: 1,
  },
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  hardPlus: "Hard+",
};

export type Position = [number, number];

export type PlayerConfig =
  | { type: "human" }
  | { type: "ai"; difficulty: DifficultyLevel };

export interface GameConfig {
  boardSize: number;
  timeLimit: number;
  player1Type: PlayerType;
  player2Type: PlayerType;
}
