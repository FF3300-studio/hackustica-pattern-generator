export type ColorMode = "tile" | "distribution";
export type Tile = "line" | "peak" | "wave";
export type Direction = -1 | 1 | "random";

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
  colors: Record<string, string>;
  color: {
    tiles: {
      mode: ColorMode;
      tile_config: Record<Tile, string>;
      distribution_config: Record<string, number>;
    };
    background: {
      mode: ColorMode;
      tile_config: Record<Tile, string>;
      distribution_config: Record<string, number>;
    };
  };
  thicknesses: Array<number>;
}
