import React from "react";
import useHalma from "../hooks/useHalma";
import useSelection from "../hooks/useSelection";
import Pawn from "./Pawn";
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

  const calculateCellWidth = () => 100 / size;

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

  const getPawn = (r, c) => {
    const pawn = getPawnInPosition(r, c);
    if (pawn) {
      return (
        <Pawn
          color={pawn.color}
          isSelected={selected && r === selected[0] && c === selected[1]}
          size={"60"}
        />
      );
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
        {state.board.board.map((row, i) => {
          return (
            <React.Fragment key={`halma-row-${i}`}>
              {row.map((_, j) => {
                return (
                  <div
                    key={`halma-cell-${i}-${j}`}
                    className="relative"
                    style={{
                      width: `${calculateCellWidth()}%`,
                      paddingBottom: `${calculateCellWidth()}%`,
                    }}
                  >
                    <div
                      className="flex absolute top-0 left-0 right-0 bottom-0 m-auto justify-center items-center rounded hover:shadow-md transition duration-150 cursor-pointer"
                      style={{
                        width: "87%",
                        height: "87%",
                        backgroundColor: getCellBackground(i, j),
                      }}
                      onClick={(_) => {
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
                      }}
                    >
                      {getPawn(i, j)}
                      {!!selected ? (
                        state
                          .generateMoveset(selected[0], selected[1])
                          .filter((value) => value[0] === i && value[1] === j)
                          .length !== 0 ? (
                          <div
                            className="bg-red-400 rounded-full absolute animate-ping"
                            style={{ width: "30%", height: "30%" }}
                          />
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
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
