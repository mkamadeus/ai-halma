import React from "react";
import useHalma from "../hooks/useHalma";
import useSelection from "../hooks/useSelection";
import Pawn from "./Pawn";

const HalmaBoard = (props) => {
  const { size } = props;
  const [selected, setSelectedTile, setTargetTile] = useSelection();
  const { state, getPawnInPosition } = useHalma(size);
  console.log("hehe", state);

  const getPawn = () => {};

  return (
    <div className="flex flex-col p-1">
      {state.board.board.map((row, i) => {
        return (
          <div className="flex" key={`halma-row-${i}`}>
            {row.map((pawn, j) => {
              return (
                <div
                  key={`halma-cell-${i}-${j}`}
                  className={`flex relative justify-center items-center w-24 h-24 ${
                    selected && i === selected[0] && j === selected[1]
                      ? "bg-gray-400 shadow-lg"
                      : "bg-gray-200"
                  } rounded m-1 hover:shadow-md transition duration-150`}
                  onClick={(event) => {
                    // if (pawn && pawn.owner === turn) {
                    //   setSelectedTile(i, j);
                    //   generateMoveset(i, j);
                    // } else if (selected && !pawn && isMoveValid(i, j)) {
                    //   setTargetTile(i, j, movePawn);
                    //   emptyMoves();
                    // }
                  }}
                >
                  {state.board.board[i][j] !== 0 ? (
                    <Pawn
                      color={"#FFF"}
                      isSelected={
                        selected && i === selected[0] && j === selected[1]
                      }
                    />
                  ) : (
                    ""
                  )}
                  {/* {moves.filter((value) => value[0] === i && value[1] === j)
                    .length !== 0 ? (
                    <div
                      className="w-4 h-4 bg-red-400 rounded-full absolute animate-ping"
                      style={{ content: "" }}
                    />
                  ) : (
                    ""
                  )} */}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default HalmaBoard;
