# AGENTS.md — ai-halma

> This file is the authoritative project context for AI agents. Update it after any structural change (new directories, renamed modules, dependency changes, architecture shifts).

## Project Overview

Halma board game with AI opponents, built as a single-page React app. Two players (blue/orange) can be human or AI (minimax with alpha-beta pruning, or minimax + simulated annealing local search). Configurable board size (6/8/10/16) and per-turn time limit.

No deployment infrastructure currently configured (previously Firebase Hosting; stripped for future Cloudflare Pages migration).

## Tech Stack

| Layer           | Technology       | Version | Notes                                                                     |
| --------------- | ---------------- | ------- | ------------------------------------------------------------------------- |
| Framework       | React            | 18.3.1  | Class-free, hooks only                                                    |
| Build           | Vite             | 6.3.2   | `@vitejs/plugin-react` for JSX/fast refresh                               |
| Routing         | react-router-dom | 7.5.0   | v7 API (`useNavigate`, `useLocation`, `<Routes>`/`<Route element={}>`)    |
| Styling         | Tailwind CSS     | 4.1.3   | v4 CSS-first config via `@tailwindcss/vite` plugin. No config file needed |
| Alerts          | sweetalert2      | 11.17.2 | Win dialog                                                                |
| Timer           | react-timer-hook | 4.0.5   | Per-turn countdown + player stopwatches                                   |
| Package manager | bun              | —       | `bun.lock` present                                                        |

## Language & Type System

Plain JavaScript throughout. No TypeScript, no JSDoc types, no PropTypes. Models use ES6 classes; components and hooks use functional style. JSX files use `.jsx` extension; pure JS files use `.js`.

## Directory Structure

```
ai-halma/
├── src/
│   ├── index.jsx             # Entry point — createRoot, BrowserRouter, Routes (/ → Setting, /play → App)
│   ├── App.jsx               # Game page — reads route state, renders HalmaBoard
│   ├── Setting.jsx           # Settings page — player type, board size, time limit
│   ├── components/
│   │   ├── HalmaBoard.jsx    # Board renderer + click handling + move indicators
│   │   └── Pawn.jsx          # Circular pawn component (color, selection bounce)
│   ├── hooks/
│   │   ├── useHalma.js       # Core game logic — turn management, AI algorithms (minimax, SA), heuristic
│   │   ├── useBoard.js       # Board state holder (State wrapper)
│   │   ├── useSelection.js   # Tile selection state for human moves
│   │   └── usePlayerStopwatch.js  # Elapsed time tracker per player
│   ├── models/
│   │   ├── State.js          # Game state — board + pawn lists, moveset generation (BFS), move validation, win check
│   │   ├── Board.js          # NxN grid — position validation, starting tiles, goal generation
│   │   └── Pawn.js           # Pawn data — color, owner, row, col
│   ├── common/
│   │   └── generateBoard.js  # NxN array factory
│   └── css/
│       └── styles.css         # Tailwind v4 entry point (`@import "tailwindcss"`)
├── public/                    # Static assets (favicon, logos, manifest, robots.txt)
├── index.html                 # Vite entry HTML (root-level, references /src/index.jsx as module)
├── vite.config.js             # Vite config — react() + tailwindcss() plugins
├── package.json               # Scripts: dev, build, preview
└── bun.lock                   # Bun lockfile
```

## Key Architecture Decisions

- All game logic lives in `useHalma` hook — AI algorithms (minimax, minimaxLocal with SA), heuristic function, turn management, timer control
- State is immutable-by-convention: `copyState()` before mutation, then `setState(newState)`
- Moveset generation uses BFS for jump chains (hop over adjacent pawns)
- AI runs synchronously on the main thread (blocks UI during computation)
- No web workers, no async AI computation
- Depth is hardcoded to `3` in `HalmaBoard.jsx` when calling `useHalma`

## AI Algorithms

1. **Minimax with Alpha-Beta Pruning** (`minimax`) — exhaustive search to configured depth
2. **Minimax + Local Search** (`minimaxLocal`) — uses simulated annealing to sample 10 candidate moves per depth level instead of exhaustive search, then applies minimax with alpha-beta on those candidates
3. **Heuristic** (`heuristicFunction`) — Euclidean distance of own pawns to opponent's starting zone minus opponent's distance to own starting zone

## Scripts

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `bun run dev`     | Start Vite dev server              |
| `bun run build`   | Production build (outputs `dist/`) |
| `bun run preview` | Preview production build locally   |

## Codebase State Assessment

**Classification: Legacy (modernized infra)**

- No TypeScript, no type checking
- No tests
- No linter config (CRA eslint config was removed with CRA)
- No formatter config (no Prettier)
- `==` used instead of `===` in places (e.g., `useHalma.js` heuristic)
- No error boundaries
- AI blocks main thread
- Build tooling is modern (Vite + Tailwind v4 + React 18 + react-router v7)

## Conventions to Follow (when modifying)

- Functional components with hooks (no class components)
- `.jsx` extension for files containing JSX, `.js` for pure logic
- ES6 classes for models (`State`, `Board`, `Pawn`)
- Tailwind utility classes for styling (inline in JSX)
- State immutability via `copyState()` pattern
- Game logic centralized in hooks (`src/hooks/`)
- Player identification: `1` = blue (top-left start), `2` = orange (bottom-right start)
- Use `bun` as package manager (not npm/yarn)

## Known Issues

- AI computation blocks UI thread — no loading indicator, browser may freeze on larger boards
- `useEffect` in `useHalma` has missing dependencies in its dependency array (only `[turn]`)
- No input validation on Setting page (board size comes as string from `<select>`)

## Maintenance

**Update this file when:**

- Adding/removing/renaming files or directories
- Changing the tech stack or dependencies
- Modifying the build pipeline or deployment target
- Altering the AI algorithms or game rules
- Restructuring the component/hook/model hierarchy
