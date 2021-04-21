/**
 * Types
 */

/**
 * Reference for this:
 * https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
 * https://thoughtbot.com/blog/the-trouble-with-typescript-enums
 * https://stackoverflow.com/questions/55020193/is-it-possible-to-create-a-typescript-type-from-an-array
 */

export const Tiles = ["line", "wave", "peak"] as const;
export type Tile = typeof Tiles[number];

export const ColorModes = ["tile", "distribution"] as const;
export type ColorMode = typeof ColorModes[number];

export const ThicknessModes = ["image", "values"] as const;
export type ThicknessMode = typeof ThicknessModes[number];

/**
 * Configs
 */

export interface Config {
  canvas: CanvasConfig;
  grid: GridConfig;
  tiles: Record<Tile, TileConfig>;
  color: {
    tiles: ColorConfig;
    background: ColorConfig;
  };
  thickness: ThicknessConfig;
  gif: GIFConfig;
}

export interface CanvasConfig {
  width: number;
  height: number;
}

export interface GridConfig {
  rows: number;
  columns: number;
  cell_ratio: number;
  spacing: {
    row: number;
    column: number;
  };
  fill: boolean;
}

export interface TileConfig {
  density: number;
  squaring?: number;
}

export interface ColorConfig {
  mode: ColorMode;
  tile: Record<Tile, string>;
  distribution: Record<string, number>;
}

export interface ThicknessConfig {
  mode: ThicknessMode;
  values: Array<number>;
  image: {
    url: string;
    steps: number;
    min: number;
    max: number;
  };
}

export interface GIFConfig {
  duration: number;
  frameRate: number;
}

export interface WeightConfig {
  weight: number;
  id: string;
}
