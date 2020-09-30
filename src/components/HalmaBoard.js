import React from "react";
import useHalma from "../hooks/useHalma";
import useSelection from "../hooks/useSelection";
import Pawn from "./Pawn";

const HalmaBoard = (props) => {
  const { size } = props;
  const [board, changeTurn, movePawn, minimax, localSearch] = useHalma(size);
  const [selected, setSelectedTile, setTargetTile] = useSelection();
  return (
    <div className="flex flex-col p-1">
      {board.map((row, i) => {
        return (
          <div className="flex p">
            {row.map((pawn, j) => {
              return (
                <div
                  className={`flex relative justify-center items-center w-24 h-24 ${
                    selected && i === selected[0] && j === selected[1]
                      ? "bg-gray-400 shadow-lg"
                      : "bg-gray-200"
                  } rounded m-1 hover:shadow-md`}
                  onClick={(event) => {
                    if (!selected || pawn) {
                      setSelectedTile(i, j);
                    } else {
                      setTargetTile(i, j, movePawn);
                    }
                    console.log(i, j);
                  }}
                >
                  {pawn ? <Pawn color={pawn.color} /> : ""}
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
