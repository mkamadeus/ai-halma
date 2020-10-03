import React from "react";

const Pawn = (props) => {
  const { color, isSelected } = props;
  return (
    <div
      className={`rounded-full absolute w-12 h-12 shadow-md ${
        isSelected ? "animate-bounce" : ""
      }`}
      style={{ backgroundColor: color, content: "" }}
    ></div>
  );
};

export default Pawn;
