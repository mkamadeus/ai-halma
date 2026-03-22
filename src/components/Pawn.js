import React from "react";

const Pawn = (props) => {
  const { color, isSelected, size } = props;
  return (
    <div
      className={`rounded-full absolute shadow-md ${
        isSelected ? "animate-bounce" : ""
      }`}
      style={{
        backgroundColor: color,
        content: "",
        width: `${size}%`,
        height: `${size}%`,
        zIndex: 100,
      }}
    ></div>
  );
};

export default Pawn;
