/**
 * Imports
 */

// All the definitions
import type { Config } from "./defs";

// Tiles
import { tile_wave, tile_peak, tile_line } from "./tiles";

// Randomness functions
import rwc from "random-weighted-choice";
import { choice } from "pandemonium";

// Geometry
import { Point, Size, Rectangle, Grid } from "@bbtgnn/canvasgrid";

// Paper
import paper from "paper";

// Canvas ops
import { deleteCanvas, createCanvas } from "./crudCanvas";

// Util
import { nanoid } from "nanoid";

/**
 * Canvas
 */

export function makeCanvas(config: Config): HTMLCanvasElement {
  // Canvas ID
  const canvas_id = "hackanvas";
  const canvas_parent_id = "output";

  // Deleting canvas if there's one
  deleteCanvas(canvas_id);

  // Creating a new one
  return createCanvas(
    canvas_id,
    document.getElementById(canvas_parent_id),
    config.canvas.width,
    config.canvas.height
  );
}

/**
 * Grid
 */

export function getCanvasRect(config: Config): Rectangle {
  return new Rectangle(
    new Point(0, 0),
    new Size(config.canvas.width, config.canvas.height)
  );
}

export function getUnitGrid(config: Config): Grid {
  return new Grid(
    config.grid.rows,
    config.grid.columns,
    new Size(config.grid.cell_ratio, 1),
    {
      column: config.grid.spacing.column * config.grid.cell_ratio,
      row: config.grid.spacing.row,
    }
  );
}

export function getGridRect(
  canvasRect: Rectangle,
  unitGrid: Grid,
  fill: boolean
): Rectangle {
  //
  if (fill) {
    return canvasRect.fillRectangleCenter(unitGrid.ratio);
  }
  //
  else {
    return canvasRect.fitRectangleCenter(unitGrid.ratio);
  }
}

export function getGrid(config: Config): Grid {
  const canvasRect = getCanvasRect(config);
  const unitGrid = getUnitGrid(config);
  const gridRect = getGridRect(canvasRect, unitGrid, config.grid.fill);
  const grid = unitGrid.fillHeight(gridRect.height);
  grid.setOrigin(gridRect.origin);
  return grid;
}

/**
 * Thickness
 */

export async function getThicknessImageMode(
  config: Config,
  grid: Grid
): Promise<Array<number>> {
  // Creating image
  const img = await makeImage(config.thickness.imageUrl);
  // Placing it in paperjs
  const img_raster = await placeImage(img, grid.rectangle);
  // Rasterizing it
  const colors = rasterizeByGrid(img_raster, grid);
  // Converting to 0-1
  const values = colorsToValues(colors);
  // Cleaning up
  img.remove();
  img_raster.remove();
  //
  return values;
}

export async function getThickness(
  config: Config,
  grid: Grid
): Promise<Array<number>> {
  //
  if (config.thickness.imageUrl != undefined) {
    return await getThicknessImageMode(config, grid);
  } else {
    throw new Error("Image not loaded!");
  }
}

/**
 * Image ops
 */

export async function makeImage(data: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = data;
    img.id = nanoid(5);
    img.style.display = "none";
    img.onload = () => resolve(img);
  });
}

export async function placeImage(
  img: HTMLImageElement,
  rect: Rectangle
): Promise<paper.Raster> {
  return new Promise((resolve, reject) => {
    // Creating image
    const image = new paper.Raster(img);
    // Fitting image to rectangle
    const image_ratio = image.width / image.height;
    const image_rect = rect.fillRectangleCenter(image_ratio);
    // Setting boundaries and origin
    image.visible = false;
    image.size = new paper.Size(image_rect);
    image.position = new paper.Point(rect.center);
    image.onLoad = () => resolve(image);
  });
}

export function rasterizeByGrid(
  image: paper.Raster,
  grid: Grid
): Array<paper.Color> {
  // Empty array will store colors
  const colors: Array<paper.Color> = [];

  // Iterating over grid cells
  for (let cell of grid.getCells()) {
    const rect = new paper.Rectangle(cell);
    const color = image.getAverageColor(rect);
    colors.push(color);
  }

  return colors;
}

export function colorsToValues(colors: Array<paper.Color>): Array<number> {
  const values: Array<number> = [];
  for (const color of colors) {
    values.push(1 - color.gray);
  }
  return values;
}

export function quantizeValues(
  values: Array<number>,
  bins: number,
  min: number,
  max: number
): Array<number> {
  const step = (max - min) / bins;
  //
  const bounds = [];
  for (let i = 0; i < bins; i++) {
    bounds.push(min + step * i);
  }
  bounds.push(max);
  //
  return values.map((value) => {
    for (let i = 0; i < bounds.length - 1; i++) {
      const lower_bound = bounds[i];
      const upper_bound = bounds[i + 1];
      if (value >= lower_bound && value <= upper_bound) {
        return upper_bound == max ? upper_bound : lower_bound;
      }
    }
  });
}

export function mapValue(
  v: number,
  old_min: number,
  old_max: number,
  new_min: number,
  new_max: number
): number {
  return ((v - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min;
}

export function mapValues(
  list: Array<number>,
  old_min: number,
  old_max: number,
  new_min: number,
  new_max: number
): Array<number> {
  return list.map((value) =>
    mapValue(value, old_min, old_max, new_min, new_max)
  );
}
