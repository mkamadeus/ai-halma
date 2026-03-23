import React, { useMemo, useCallback } from "react";
import useHalma from "../hooks/useHalma";
import type { WinnerInfo } from "../hooks/useHalma";
import useSelection from "../hooks/useSelection";
import Tile from "./Tile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PlayerOwner, PlayerType } from "../types";

const playerLabel = (type: PlayerType): string => {
  if (type === "minimax") return "AI – Minimax";
  if (type === "minimaxLocal") return "AI – Local Search";
  return "Human";
};

interface GameStatusProps {
  turn: PlayerOwner;
  playerBlue: PlayerType;
  playerOrange: PlayerType;
  seconds: number;
  score: number;
}

const GameStatus = React.memo<GameStatusProps>(
  ({ turn, playerBlue, playerOrange, seconds, score }) => {
    return (
      <div className="flex items-center justify-between pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${turn === 1 ? "ring-2 ring-blue-400 bg-blue-50 text-blue-700" : "text-muted-foreground"}`}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "#3b82f6" }}
            />
            Blue – {playerLabel(playerBlue)}
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${turn === 2 ? "ring-2 ring-orange-400 bg-orange-50 text-orange-700" : "text-muted-foreground"}`}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "#f97316" }}
            />
            Orange – {playerLabel(playerOrange)}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{seconds}s remaining</span>
          <span>Score: {score.toFixed(2)}</span>
        </div>
      </div>
    );
  },
);

const ThinkingOverlay = React.memo(() => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 rounded">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      Thinking…
    </div>
  </div>
));

interface WinDialogProps {
  winner: WinnerInfo | null;
  onNewGame: () => void;
}

const WinDialog = React.memo<WinDialogProps>(({ winner, onNewGame }) => (
  <Dialog open={!!winner}>
    <DialogContent
      className="sm:max-w-md"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>Player {winner?.player} wins!</DialogTitle>
        <DialogDescription>
          Player 1: {winner?.timer1} | Player 2: {winner?.timer2}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onNewGame}>New Game</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

interface HalmaBoardProps {
  size: number;
  timer: number;
  playerBlue: PlayerType;
  playerOrange: PlayerType;
  onNewGame: () => void;
}

const HalmaBoard: React.FC<HalmaBoardProps> = (props) => {
  const { size, timer, playerBlue, playerOrange, onNewGame } = props;
  const [selected, setSelectedTile, setTargetTile] = useSelection();
  const {
    state,
    getPawnInPosition,
    turn,
    changeTurn,
    movePawn,
    seconds,
    score,
    winner,
    aiThinking,
  } = useHalma(size, 3, timer, playerBlue, playerOrange);

  const cellWidth = 100 / size;

  const moveTargets = useMemo(() => {
    if (!selected) return new Set<string>();
    const moves = state.generateMoveset(selected[0], selected[1]);
    if (!moves) return new Set<string>();
    return new Set(moves.map(([r, c]) => `${r},${c}`));
  }, [selected, state]);

  const handleTileClick = useCallback(
    (i: number, j: number) => {
      if (aiThinking) return;
      const pawn = getPawnInPosition(i, j);
      try {
        if (pawn && pawn.owner === turn) {
          setSelectedTile(i, j);
        } else if (selected && !pawn) {
          setTargetTile(i, j, movePawn);
          changeTurn();
        }
      } catch (err) {
        console.log((err as Error).message);
      }
    },
    [
      aiThinking,
      getPawnInPosition,
      turn,
      selected,
      setSelectedTile,
      setTargetTile,
      movePawn,
      changeTurn,
    ],
  );

  const tileGrid = useMemo(() => {
    return state.board.board.map((row, i) =>
      row.map((_, j) => {
        let bg: string;
        if (selected && i === selected[0] && j === selected[1]) {
          bg = "#9ca3af";
        } else if (
          !!state.prevPosition &&
          !!state.currentMove &&
          ((state.prevPosition[0] === i && state.prevPosition[1] === j) ||
            (state.currentMove[0] === i && state.currentMove[1] === j))
        ) {
          bg = "#fde047";
        } else if (state.board.isStartingTile(i, j, 1)) {
          bg = "#bfdbfe";
        } else if (state.board.isStartingTile(i, j, 2)) {
          bg = "#fed7aa";
        } else {
          bg = "#e5e7eb";
        }

        const pawn = state.getPawnInPosition(i, j);

        return (
          <Tile
            key={`tile-${i}-${j}`}
            row={i}
            col={j}
            cellWidth={cellWidth}
            backgroundColor={bg}
            pawn={pawn}
            isSelected={!!selected && i === selected[0] && j === selected[1]}
            isMoveTarget={moveTargets.has(`${i},${j}`)}
            onClick={handleTileClick}
          />
        );
      }),
    );
  }, [state, selected, moveTargets, cellWidth, handleTileClick]);

  return (
    <>
      <GameStatus
        turn={turn}
        playerBlue={playerBlue}
        playerOrange={playerOrange}
        seconds={seconds}
        score={score}
      />

      <div className="flex flex-row flex-wrap w-full relative">
        {aiThinking && <ThinkingOverlay />}
        {tileGrid}
      </div>

      <WinDialog winner={winner} onNewGame={onNewGame} />
    </>
  );
};

export default HalmaBoard;
