
import React, { useState, useEffect, useCallback } from 'react';
import { Grid, TileValue, Direction } from '../types';
import { GRID_SIZE, WIN_VALUE, INITIAL_TILES_COUNT } from '../constants';
import {
  createEmptyGrid,
  addRandomTile,
  deepCopyGrid,
  areGridsEqual,
  processRowLeft,
  transposeGrid,
  reverseGridRows,
  canMove,
  hasWon,
} from '../utils/gridUtils';
import Board from './Board';

// Helper function to move and merge tiles for the entire grid
const moveTiles = (currentGrid: Grid, direction: Direction): { newGrid: Grid, scoreAdded: number } => {
  let workingGrid = deepCopyGrid(currentGrid);
  let totalScoreAdded = 0;

  // Orient grid so all moves are effectively "left"
  if (direction === Direction.LEFT) {
    // NOP
  } else if (direction === Direction.RIGHT) {
    workingGrid = reverseGridRows(workingGrid);
  } else if (direction === Direction.UP) {
    workingGrid = transposeGrid(workingGrid);
  } else if (direction === Direction.DOWN) {
    workingGrid = transposeGrid(workingGrid);
    workingGrid = reverseGridRows(workingGrid); // Effectively rotate 90deg right, then treat as 'left' for rows
  }

  // Process each row
  for (let i = 0; i < GRID_SIZE; i++) {
    const { newRow, scoreAdded } = processRowLeft(workingGrid[i]);
    workingGrid[i] = newRow;
    totalScoreAdded += scoreAdded;
  }

  // Re-orient grid back to original
  if (direction === Direction.LEFT) {
    // NOP
  } else if (direction === Direction.RIGHT) {
    workingGrid = reverseGridRows(workingGrid);
  } else if (direction === Direction.UP) {
    workingGrid = transposeGrid(workingGrid);
  } else if (direction === Direction.DOWN) {
    workingGrid = reverseGridRows(workingGrid); // Undo row reversal
    workingGrid = transposeGrid(workingGrid); // Undo transpose
  }
  
  return { newGrid: workingGrid, scoreAdded: totalScoreAdded };
};


const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);


  const initializeGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    for (let i = 0; i < INITIAL_TILES_COUNT; i++) {
      newGrid = addRandomTile(newGrid);
    }
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleMove = useCallback((direction: Direction) => {
    if (gameOver || isWon) return;

    const { newGrid: movedGrid, scoreAdded } = moveTiles(grid, direction);

    if (!areGridsEqual(grid, movedGrid)) {
      const gridWithNewTile = addRandomTile(movedGrid);
      setGrid(gridWithNewTile);
      setScore(prevScore => prevScore + scoreAdded);

      if (hasWon(gridWithNewTile, WIN_VALUE)) {
        setIsWon(true);
      } else if (!canMove(gridWithNewTile)) {
        setGameOver(true);
      }
    }
  }, [grid, score, gameOver, isWon]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver && event.key !== 'Enter') return; // Allow Enter to restart if game over
      
      let moved = false;
      switch (event.key) {
        case 'ArrowUp':
          handleMove(Direction.UP);
          moved = true;
          break;
        case 'ArrowDown':
          handleMove(Direction.DOWN);
          moved = true;
          break;
        case 'ArrowLeft':
          handleMove(Direction.LEFT);
          moved = true;
          break;
        case 'ArrowRight':
          handleMove(Direction.RIGHT);
          moved = true;
          break;
        case 'Enter':
           if (gameOver || isWon) initializeGame();
           break;
      }
      if (moved) {
        event.preventDefault(); // Prevent window scrolling
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMove, gameOver, isWon, initializeGame]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || e.changedTouches.length === 0) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStart.x;
    const deltaY = touchEndY - touchStart.y;

    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) handleMove(Direction.RIGHT);
        else handleMove(Direction.LEFT);
      }
    } else { // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) handleMove(Direction.DOWN);
        else handleMove(Direction.UP);
      }
    }
    setTouchStart(null);
  };


  return (
    <div 
      className="flex flex-col items-center space-y-6 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0} // Make div focusable for keyboard events
    >
      <header className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md px-2">
        <h1 className="text-5xl font-bold text-orange-400 mb-2 sm:mb-0">2048</h1>
        <div className="flex space-x-4 items-center">
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-xs text-slate-300 uppercase">Score</div>
            <div className="text-2xl font-bold text-white">{score}</div>
          </div>
          <button
            onClick={initializeGame}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
          >
            New Game
          </button>
        </div>
      </header>
      
      <div className="relative">
        <Board grid={grid} />
        {(gameOver || isWon) && (
          <div className="absolute inset-0 bg-slate-800 bg-opacity-80 flex flex-col items-center justify-center rounded-lg">
            <h2 className="text-4xl font-bold mb-4">
              {isWon ? "You Win!" : "Game Over!"}
            </h2>
            <p className="text-xl mb-6 text-slate-200">
              {isWon ? `You reached ${WIN_VALUE}!` : `Your score: ${score}`}
            </p>
            <button
              onClick={initializeGame}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
       <footer className="text-center text-slate-400 mt-4 text-sm">
        <p>Use arrow keys or swipe to play.</p>
        <p>Combine tiles to reach the 2048 tile!</p>
      </footer>
    </div>
  );
};

export default Game2048;
    