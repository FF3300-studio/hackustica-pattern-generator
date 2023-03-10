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
  tiles: {
    line: { density: 1 },
    wave: { density: 1, squaring: 0.5 },
    peak: { density: 1, squaring: 0.65 },
  },
  //
  color: {
    //
    tiles: {
      mode: "tile",
      tile: {
        line: "#3366ff",
        wave: "#66ff99",
        peak: "#ff6666",
      },
      distribution: {
        "#3366ff": 1,
        "#66ff99": 1,
        "#ff6666": 1,
        "#ffffff": 0,
        "#000000": 0,
      },
    },
    //
    background: {
      mode: "distribution",
      tile: {
        line: "#3366ff",
        wave: "#66ff99",
        peak: "#ff6666",
      },
      distribution: {
        "#3366ff": 0,
        "#66ff99": 0,
        "#ff6666": 0,
        "#ffffff": 1,
        "#000000": 0,
      },
      gradient: {
        first: {
          color: "#66ff99",
          position: "topLeft",
        },
        second: {
          color: "#3366ff",
          position: "bottomRight",
        },
      },
    },
  },
  //
  thickness: {
    imageUrl: undefined,
  },
  //
  gif: {
    duration: 4,
    frameRate: 1,
  },
});

export const DefaultColorsStore = writable([
  "#3366ff",
  "#66ff99",
  "#ff6666",
  "#ffffff",
  "#000000",
]);

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
