export const generateBoard = <T>(size: number, initialValue: T): T[][] => {
  const board: T[][] = [];
  for (let i = 0; i < size; i++) {
    const row: T[] = [];
    for (let j = 0; j < size; j++) {
      row.push(initialValue);
    }
    board.push(row);
  }

  return board;
};
