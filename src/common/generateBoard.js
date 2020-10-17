export const generateBoard = (size, initialValue) => {
  const board = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      if (initialValue === undefined) {
        row.push(null);
      } else {
        row.push(initialValue);
      }
    }
    board.push(row);
  }

  return board;
};
