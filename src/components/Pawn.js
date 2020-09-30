import React from "react";

const Pawn = (props) => {
  const { color } = props;
  return (
    <div
      className="rounded-full absolute w-12 h-12"
      style={{ backgroundColor: color, content: "" }}
    ></div>
  );
};

export default Pawn;
