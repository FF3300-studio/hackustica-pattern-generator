import type { Tile, Direction, ColorMode } from "../app/defs";

export const tiles_text: Record<Tile, string> = {
  line: "Linea",
  wave: "Onda",
  peak: "Picco",
};

export const colorModes_text: Record<ColorMode, string> = {
  tile: "Un colore per forma",
  distribution: "Distribuzione di colore indipendente dalla forma",
};
