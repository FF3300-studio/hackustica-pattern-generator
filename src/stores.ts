import { writable } from "svelte/store";

export const PatternStore = writable({
  canvas: {
    width: 500,
    height: 700,
  },
  grid: {
    rows: 10,
    columns: 10,
    cell_ratio: 0.75,
    spacing: {
      row: 0,
      column: 0,
    },
  },
  tiles: {
    line: { density: 1 },
    wave: { density: 1, squaring: 0.5, direction: "random" },
    peak: { density: 1, squaring: 0.65, direction: "random" },
  },
  color: {
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
    },
  },
  thicknesses: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35],
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
    line: "Linea",
    wave: "Onda",
    peak: "Picco",
  },
  color_modes: {
    tile: "Un colore per forma",
    distribution: "Distribuzione di colore indipendente dalla forma",
  },
});
