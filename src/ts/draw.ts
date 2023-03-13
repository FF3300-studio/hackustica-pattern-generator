import { get } from "svelte/store";
import { PatternStore } from "../stores";

import paper from "paper";

import { makeCanvas, getGrid, getThickness } from "./drawOps";
import { alfabetiAfricani } from "./drawSVG";

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
  const thicknesses = await getThickness(config, grid);

  // Drawing pattern
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const cell_rect = new paper.Rectangle(cell);

    // Drawing tile accordingly
    const tile_path = await alfabetiAfricani(cell_rect, config.alphabets);
    tile_path.fillColor = new paper.Color("black");
    tile_path.scale(thicknesses[i], cell_rect.center);
  }

  /**
   * Running paper
   */

  (paper.view as any).draw();
}
