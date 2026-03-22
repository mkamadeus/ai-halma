# Halma AI

> Tugas Besar I IF3170 Inteligensi Buatan — Minimax Algorithm and Alpha-Beta Pruning in Halma

A web-based [Halma](https://en.wikipedia.org/wiki/Halma) board game featuring AI opponents powered by adversarial search. Two players (blue/orange) race to move their pawns from one corner of the board to the opposite corner. Each player can be human-controlled or AI-controlled.

## Features

- Configurable board size: 6×6, 8×8, 10×10, or 16×16
- Per-turn time limit with countdown timer
- Per-player elapsed time tracking
- Move indicators (valid moves highlighted with pulsing dots)
- Last move visualization (highlighted in yellow)
- Win detection with final time summary

## AI Algorithms

Two AI strategies are available for each player:

### Minimax with Alpha-Beta Pruning

Exhaustive adversarial search to a fixed depth (3). Evaluates all possible moves at each level and prunes branches that cannot improve the outcome.

### Minimax + Local Search (Simulated Annealing)

Instead of exhaustively evaluating all moves, uses simulated annealing to sample 10 candidate moves per depth level. These candidates are then evaluated using minimax with alpha-beta pruning. Trades completeness for speed on larger boards.

### Heuristic Function

The evaluation function computes the maximum Euclidean distance from each pawn to unoccupied goal tiles in the opponent's starting zone, subtracting the opponent's equivalent distance. Pawns already in the goal zone receive a bonus score.

## Game Rules

- Turn-based, two-player game
- Two legal move types:
  - Step to an adjacent empty cell (8 directions)
  - Jump over an adjacent pawn to land on the empty cell beyond it (can chain multiple jumps via BFS)
- Once a pawn enters the opponent's home zone, it cannot leave
- Once a pawn leaves its own home zone, it cannot return

## Tech Stack

React 18 · Vite · Tailwind CSS v4 · react-router v7 · sweetalert2 · react-timer-hook

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `bun run dev`     | Start Vite dev server              |
| `bun run build`   | Production build (outputs `dist/`) |
| `bun run preview` | Preview production build locally   |

## Project Structure

```
src/
├── index.jsx                  # Entry point — createRoot, BrowserRouter, Routes
├── App.jsx                    # Game page — reads route state, renders HalmaBoard
├── Setting.jsx                # Settings page — player type, board size, time limit
├── components/
│   ├── HalmaBoard.jsx         # Board renderer + click handling + move indicators
│   └── Pawn.jsx               # Circular pawn component (color, selection bounce)
├── hooks/
│   ├── useHalma.js            # Core game logic — AI algorithms, heuristic, turn management
│   ├── useBoard.js            # Board state holder (State wrapper)
│   ├── useSelection.js        # Tile selection state for human moves
│   └── usePlayerStopwatch.js  # Elapsed time tracker per player
├── models/
│   ├── State.js               # Game state — board + pawn lists, moveset generation (BFS)
│   ├── Board.js               # NxN grid — position validation, starting tiles, goals
│   └── Pawn.js                # Pawn data — color, owner, row, col
├── common/
│   └── generateBoard.js       # NxN array factory
└── css/
    └── styles.css             # Tailwind v4 entry point
```
