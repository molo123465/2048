
import React from 'react';
import { TileValue } from '../types';
import { TILE_COLORS } from '../constants';

interface TileProps {
  value: TileValue;
}

const Tile: React.FC<TileProps> = ({ value }) => {
  const style = TILE_COLORS[value] || TILE_COLORS[0]; // Default to empty style if value not found
  const baseClasses = "w-full h-full flex items-center justify-center rounded-md font-bold transition-all duration-100 ease-in-out";
  
  // Adjust font size for smaller tiles (e.g. on smaller screens, if tile size is dynamic)
  // For now, we use fixed sizes from TILE_COLORS
  const dynamicFontSize = style.fontSize || 'text-5xl'; // Default font size if not specified

  return (
    <div className={`${baseClasses} ${style.background} ${style.text} ${dynamicFontSize}`}>
      {value > 0 ? value : ''}
    </div>
  );
};

export default Tile;
    