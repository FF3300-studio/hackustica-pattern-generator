import type { Tile, Direction, ColorMode } from "../app/index";

export interface ColorConfig {
  mode: ColorMode;
  tile: Record<Tile, string>;
  distribution: Record<string, number>;
}

export interface InputConfig {
  canvas: {
    width: number;
    height: number;
  };
  grid: {
    rows: number;
    columns: number;
    cell_ratio: number;
    cell_spacing: {
      x: number;
      y: number;
    };
  };
  tiles: Record<
    Tile,
    { density: number; squaring?: number; direction?: Direction }
  >;
  color: {
    tiles: ColorConfig;
    background: ColorConfig;
  };
  thicknesses: Array<number>;
}
