import React, { useMemo, useCallback } from "react";
import useHalma from "../hooks/useHalma";
import type { WinnerInfo } from "../hooks/useHalma";
import useSelection from "../hooks/useSelection";
import Tile from "./Tile";
import type { TileVariant } from "./Tile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlayerOwner, PlayerConfig } from "../types";
import { DIFFICULTY_LABELS } from "../types";

const playerLabel = (config: PlayerConfig): string => {
  if (config.type === "human") return "Human";
  return `AI – ${DIFFICULTY_LABELS[config.difficulty]}`;
};

const ThinkingSpinner: React.FC = () => (
  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground">
    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
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
  </span>
);

interface GameStatusProps {
  turn: PlayerOwner;
  playerBlue: PlayerConfig;
  playerOrange: PlayerConfig;
  seconds: number;
  score: number;
  aiThinking: boolean;
  boardSize: number;
}

const GameStatus = React.memo<GameStatusProps>(
  ({
    turn,
    playerBlue,
    playerOrange,
    seconds,
    score,
    aiThinking,
    boardSize: _boardSize,
  }) => {
    const normalizedScore = turn === 1 ? score : -score;
    const bluePercent = 50 + 50 * Math.tanh(normalizedScore / 200);
    return (
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-2 sm:px-4 py-1.5 sm:py-3 mb-1.5 sm:mb-3 gap-2 sm:gap-3 flex-wrap">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 shrink-0 rounded-full bg-pawn-blue" />
            <span
              className={cn(
                "text-xs sm:text-sm font-medium",
                turn === 1 ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Blue
            </span>
            {turn === 1 ? (
              <Badge className="bg-pawn-blue text-white border-transparent text-[10px] sm:text-[11px] px-1 sm:px-1.5 py-0">
                {playerLabel(playerBlue)}
              </Badge>
            ) : (
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {playerLabel(playerBlue)}
              </span>
            )}
          </div>
          {aiThinking && turn === 1 && <ThinkingSpinner />}
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-base sm:text-lg font-semibold tabular-nums leading-tight">
            {seconds}s
          </span>
          <div className="w-20 sm:w-28 h-3 sm:h-4 rounded-full bg-pawn-orange overflow-hidden">
            <div
              className="h-full rounded-full bg-pawn-blue transition-all duration-500 ease-out"
              style={{ width: `${bluePercent}%` }}
            />
          </div>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground tabular-nums">
            {normalizedScore > 0 ? "+" : ""}
            {normalizedScore.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1 min-w-0">
          <div className="flex items-center gap-2">
            {turn === 2 ? (
              <Badge className="bg-pawn-orange text-white border-transparent text-[10px] sm:text-[11px] px-1 sm:px-1.5 py-0">
                {playerLabel(playerOrange)}
              </Badge>
            ) : (
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {playerLabel(playerOrange)}
              </span>
            )}
            <span
              className={cn(
                "text-xs sm:text-sm font-medium",
                turn === 2 ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Orange
            </span>
            <span className="inline-block w-2.5 h-2.5 shrink-0 rounded-full bg-pawn-orange" />
          </div>
          {aiThinking && turn === 2 && <ThinkingSpinner />}
        </div>
      </div>
    );
  },
);

interface WinDialogProps {
  winner: WinnerInfo | null;
  onNewGame: () => void;
}

const WinDialog = React.memo<WinDialogProps>(({ winner, onNewGame }) => {
  const isBlue = winner?.player === 1;
  const winnerName = isBlue ? "Blue" : "Orange";

  return (
    <Dialog open={!!winner}>
      <DialogContent
        className="sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-lg">
            <span
              className={cn(
                "inline-block w-3 h-3 rounded-full",
                isBlue ? "bg-pawn-blue" : "bg-pawn-orange",
              )}
            />
            {winnerName} wins!
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 text-sm py-2">
          <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-pawn-blue" />
              Blue
            </span>
            <span className="font-medium tabular-nums">{winner?.timer1}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-pawn-orange" />
              Orange
            </span>
            <span className="font-medium tabular-nums">{winner?.timer2}</span>
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={onNewGame}>
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

interface HalmaBoardProps {
  size: number;
  timer: number;
  playerBlue: PlayerConfig;
  playerOrange: PlayerConfig;
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
  } = useHalma(size, timer, playerBlue, playerOrange);

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
        let variant: TileVariant = "default";
        if (selected && i === selected[0] && j === selected[1]) {
          variant = "selected";
        } else if (
          !!state.prevPosition &&
          !!state.currentMove &&
          ((state.prevPosition[0] === i && state.prevPosition[1] === j) ||
            (state.currentMove[0] === i && state.currentMove[1] === j))
        ) {
          variant = "lastMove";
        } else if (state.board.isStartingTile(i, j, 1)) {
          variant = "blueZone";
        } else if (state.board.isStartingTile(i, j, 2)) {
          variant = "orangeZone";
        }

        const pawn = state.getPawnInPosition(i, j);

        return (
          <Tile
            key={`tile-${i}-${j}`}
            row={i}
            col={j}
            cellWidth={cellWidth}
            variant={variant}
            pawn={pawn}
            isSelected={!!selected && i === selected[0] && j === selected[1]}
            isMoveTarget={moveTargets.has(`${i},${j}`)}
            disabled={aiThinking}
            onClick={handleTileClick}
          />
        );
      }),
    );
  }, [state, selected, moveTargets, cellWidth, handleTileClick, aiThinking]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="shrink-0">
        <GameStatus
          turn={turn}
          playerBlue={playerBlue}
          playerOrange={playerOrange}
          seconds={seconds}
          score={score}
          aiThinking={aiThinking}
          boardSize={size}
        />
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="aspect-square max-h-full max-w-full w-full flex flex-row flex-wrap relative">
          {tileGrid}
        </div>
      </div>

      <WinDialog winner={winner} onNewGame={onNewGame} />
    </div>
  );
};

export default HalmaBoard;
