import { writable, Writable } from "svelte/store";
import type { Config } from "./ts/defs";

export const PatternStore: Writable<Config> = writable({
  //
  canvas: {
    width: 600,
    height: 450,
  },
  //
  grid: {
    rows: 50,
    columns: 50,
    cell_ratio: 1,
    spacing: {
      row: 0,
      column: 0,
    },
    fill: false,
  },
  //
  thickness: {
    imageUrl: undefined,
  },
  //
  alphabets: [],
});

export const TextStore = writable({
  tiles: {
    line: "Forma",
    wave: "Materia",
    peak: "Suono",
  },
  color_modes: {
    tile: "Un colore per forma",
    distribution: "Distribuzione di colore indipendente dalla forma",
    gradient: "Sfumatura",
  },
  thickness_modes: {
    image: "Immagine (ASCII)",
    values: "Valori",
  },
  gradient_positions: {
    topLeft: "⬉",
    topRight: "⬈",
    bottomLeft: "⬋",
    bottomRight: "⬊",
    leftCenter: "←",
    topCenter: "↑",
    rightCenter: "→",
    bottomCenter: "↓",
    center: "•",
  },
});
