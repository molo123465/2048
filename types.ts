
export type TileValue = number; // 0 for empty, 2, 4, 8, ...
export type Grid = TileValue[][];

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Position {
  row: number;
  col: number;
}

export interface TileStyle {
  background: string;
  text: string;
  fontSize?: string;
}

    