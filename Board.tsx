
import React from 'react';
import { Grid } from '../types';
import Tile from './Tile';
import { GRID_SIZE } from '../constants';

interface BoardProps {
  grid: Grid;
}

const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <div className="bg-slate-600 p-3 sm:p-4 rounded-lg shadow-xl">
      <div
        className="grid gap-3 sm:gap-4"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-slate-700 rounded-md"
            >
              <Tile value={value} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
    