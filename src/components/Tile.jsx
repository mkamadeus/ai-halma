import React from "react";

const Tile = ({
  cellWidth,
  backgroundColor,
  pawn,
  isSelected,
  isMoveTarget,
  onClick,
}) => {
  return (
    <div
      className="relative"
      style={{
        width: `${cellWidth}%`,
        paddingBottom: `${cellWidth}%`,
      }}
    >
      <div
        className="flex absolute top-0 left-0 right-0 bottom-0 m-auto justify-center items-center rounded hover:shadow-md transition duration-150 cursor-pointer"
        style={{
          width: "87%",
          height: "87%",
          backgroundColor,
        }}
        onClick={onClick}
      >
        {pawn && (
          <div
            className={`rounded-full absolute shadow-md ${isSelected ? "animate-bounce" : ""}`}
            style={{
              backgroundColor: pawn.color,
              width: "65%",
              height: "65%",
            }}
          />
        )}

        {isMoveTarget && (
          <div
            className="bg-red-400 rounded-full absolute animate-ping"
            style={{ width: "30%", height: "30%" }}
          />
        )}
      </div>
    </div>
  );
};

export default Tile;
