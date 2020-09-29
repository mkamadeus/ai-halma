import { useState, useEffect } from "react";

const generateBoard = (size) => {
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(null);
    }
    board.push(row);
  }

  return board;
};

const useHalma = () => {
  const [board, setBoard] = useState(generateBoard());
};
