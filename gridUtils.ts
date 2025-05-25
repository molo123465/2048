
import { GRID_SIZE } from '../constants';
import { Grid, TileValue, Position } from '../types';

export const createEmptyGrid = (): Grid => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

export const getRandomEmptyCell = (grid: Grid): Position | null => {
  const emptyCells: Position[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const addRandomTile = (grid: Grid): Grid => {
  const newGrid = deepCopyGrid(grid);
  const emptyCell = getRandomEmptyCell(newGrid);
  if (emptyCell) {
    newGrid[emptyCell.row][emptyCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
  return newGrid;
};

export const deepCopyGrid = (grid: Grid): Grid => {
  return grid.map(row => [...row]);
};

export const areGridsEqual = (grid1: Grid, grid2: Grid): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid1[r][c] !== grid2[r][c]) {
        return false;
      }
    }
  }
  return true;
};

// Core Row Processing Logic (for moving left)
export const processRowLeft = (row: TileValue[]): { newRow: TileValue[], scoreAdded: number } => {
  let scoreAdded = 0;
  // 1. Filter out zeros
  const filteredRow = row.filter(tile => tile !== 0);
  const resultRow: TileValue[] = [];

  // 2. Merge tiles
  for (let i = 0; i < filteredRow.length; i++) {
    if (i + 1 < filteredRow.length && filteredRow[i] === filteredRow[i + 1]) {
      const mergedValue = filteredRow[i] * 2;
      resultRow.push(mergedValue);
      scoreAdded += mergedValue;
      i++; // Skip the next tile as it's merged
    } else {
      resultRow.push(filteredRow[i]);
    }
  }

  // 3. Pad with zeros
  while (resultRow.length < GRID_SIZE) {
    resultRow.push(0);
  }
  return { newRow: resultRow, scoreAdded };
};

export const transposeGrid = (grid: Grid): Grid => {
  const newGrid = createEmptyGrid();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[c][r] = grid[r][c];
    }
  }
  return newGrid;
};

export const reverseGridRows = (grid: Grid): Grid => {
  return grid.map(row => [...row].reverse());
};


export const canMove = (grid: Grid): boolean => {
  // Check for empty cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
    }
  }

  // Check for possible merges
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = grid[r][c];
      // Check right
      if (c + 1 < GRID_SIZE && current === grid[r][c + 1]) return true;
      // Check down
      if (r + 1 < GRID_SIZE && current === grid[r + 1][c]) return true;
    }
  }
  return false;
};

export const hasWon = (grid: Grid, winValue: number): boolean => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === winValue) return true;
    }
  }
  return false;
};
    