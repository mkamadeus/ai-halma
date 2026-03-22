import React, { useMemo } from "react";
import useHalma from "../hooks/useHalma";
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

const HalmaBoard = (props) => {
  const { size, timer, playerBlue, playerOrange, onNewGame } = props;
  const [selected, setSelectedTile, setTargetTile] = useSelection();
  const {
    state,
    getPawnInPosition,
    turn,
    changeTurn,
    movePawn,
    seconds,
    heuristicFunction,
    winner,
  } = useHalma(size, 3, timer, playerBlue, playerOrange);

  const cellWidth = 100 / size;

  const moveTargets = useMemo(() => {
    if (!selected) return new Set();
    const moves = state.generateMoveset(selected[0], selected[1]);
    return new Set(moves.map(([r, c]) => `${r},${c}`));
  }, [selected, state]);

  const getCellBackground = (i, j) => {
    if (selected && i === selected[0] && j === selected[1]) {
      return "#9ca3af";
    }
    if (
      !!state.prevPosition &&
      !!state.currentMove &&
      ((state.prevPosition[0] === i && state.prevPosition[1] === j) ||
        (state.currentMove[0] === i && state.currentMove[1] === j))
    ) {
      return "#fde047";
    }
    if (state.board.isStartingTile(i, j, 1)) {
      return "#bfdbfe";
    }
    if (state.board.isStartingTile(i, j, 2)) {
      return "#fed7aa";
    }
    return "#e5e7eb";
  };

  const handleTileClick = (i, j) => {
    const pawn = getPawnInPosition(i, j);
    try {
      if (pawn && pawn.owner === turn) {
        setSelectedTile(i, j);
      } else if (selected && !pawn) {
        setTargetTile(i, j, movePawn);
        changeTurn();
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const turnColor = turn === 1 ? "#3b82f6" : "#f97316";

  return (
    <>
      <div className="flex items-center justify-between pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: turnColor }}
          />
          <span className="text-lg font-semibold text-foreground">
            Player {turn}&apos;s Turn
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{seconds}s remaining</span>
          <span>Score: {heuristicFunction(state, turn).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-row flex-wrap w-full">
        {state.board.board.map((row, i) =>
          row.map((_, j) => (
            <Tile
              key={`tile-${i}-${j}`}
              cellWidth={cellWidth}
              backgroundColor={getCellBackground(i, j)}
              pawn={getPawnInPosition(i, j)}
              isSelected={!!selected && i === selected[0] && j === selected[1]}
              isMoveTarget={moveTargets.has(`${i},${j}`)}
              onClick={() => handleTileClick(i, j)}
            />
          )),
        )}
      </div>

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
    </>
  );
};

export default HalmaBoard;
