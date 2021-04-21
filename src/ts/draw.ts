import { get } from "svelte/store";
import { PatternStore } from "../stores";

import paper from "paper";

import {
  makeCanvas,
  getGrid,
  getTiles,
  getColors,
  drawTile,
  getThickness,
  drawGradient,
} from "./drawOps";

export async function draw() {
  // Getting store with data
  const config = get(PatternStore);

  // Creating canvas
  const canvas = makeCanvas(config);

  // Setup paperjs
  (paper as any).setup(canvas);

  /**
   * Drawing cells
   */

  // Getting pattern data
  const grid = getGrid(config);
  const cells = grid.getCells();
  const tiles = getTiles(config);
  const colors_background = getColors(config.color.background, tiles);
  const colors_tile = getColors(config.color.tiles, tiles);
  const thicknesses = await getThickness(config, grid);

  // Doing gradient if asked
  if (colors_background == undefined) {
    drawGradient(config.color.background.gradient, grid);
  }

  // Drawing pattern
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const cell = cells[i];
    const cell_rect = new paper.Rectangle(cell);
    const color_tile = colors_tile[i];

    // Background
    if (colors_background != undefined) {
      const color_background = colors_background[i];
      let bg_path = new paper.Path.Rectangle(cell_rect);
      (bg_path as any).fillColor = color_background;
    }

    // Drawing tile accordingly
    let tile_path = drawTile(tile, cell_rect, config);
    (tile_path as any).strokeColor = color_tile;
    tile_path.strokeWidth = thicknesses[i] * cell.width;
  }

  /**
   * Running paper
   */

  (paper.view as any).draw();
}

// It's super important to have some delay!
// Some changes might not be captured because of the update speed of Svelte
export function handleDraw() {
  setTimeout(function () {
    draw();
  }, 10);
}
