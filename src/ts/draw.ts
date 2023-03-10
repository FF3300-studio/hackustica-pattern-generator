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
  const thicknesses = await getThickness(config, grid);

  // Drawing pattern
  for (let i = 0; i < tiles.length; i++) {
    const cell = cells[i];
    const cell_rect = new paper.Rectangle(cell);

    // Drawing tile accordingly
    const tile_path = new paper.Path.Rectangle(cell_rect);
    tile_path.fillColor = new paper.Color("black");
    tile_path.scale(thicknesses[i], cell_rect.center);
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
