import type { InputConfig } from "../ui/configs";
import { deleteCanvas, createCanvas } from "../ui/crudCanvas";
import { Point, Size, Rectangle, UnitGrid } from "../modules/canvasgrid";
import { tile_wave } from "./tiles/wave";
import { tile_peak } from "./tiles/peak";
import { tile_line } from "./tiles/line";
import { choice } from "pandemonium";
import rwc from "random-weighted-choice";
import { Tiles, Tile } from "./defs";
import paper from "paper";

export function draw(config: InputConfig): void {
  // Canvas ID
  const canvas_id = "hackanvas";
  const canvas_parent_id = "output";

  // Deleting canvas if there's one
  deleteCanvas(canvas_id);

  // Creating a new one
  const canvas = createCanvas(
    canvas_id,
    document.getElementById(canvas_parent_id),
    config.canvas.width,
    config.canvas.height
  );

  // Setup paperjs
  (paper as any).setup(canvas);

  // Creating canvas rectangle
  const canvas_rect = new Rectangle(
    new Point(0, 0),
    new Size(config.canvas.width, config.canvas.height)
  );

  // Drawing rectangle
  const canvas_rect_p = new paper.Path.Rectangle(canvas_rect);
  (canvas_rect_p as any).strokeColor = "red";

  // Creating grid
  const grid = new UnitGrid(
    config.grid.rows,
    config.grid.columns,
    config.grid.cell_ratio,
    { column: config.grid.cell_spacing.x, row: config.grid.cell_spacing.y }
  );

  // Fitting grid rectangle
  const grid_rect = canvas_rect.fitRectangleCenter(grid.ratio);

  // Drawing fitted rectangle
  const grid_rect_p = new paper.Path.Rectangle(grid_rect);
  (grid_rect_p as any).strokeColor = "teal";

  // Drawing grid

  for (let cell of grid.getCells(
    grid.getCellHeightFromGridHeight(grid_rect.height),
    grid_rect.origin
  )) {
    const cell_rect = new paper.Rectangle(cell);

    // --- Tile choice --- //

    // Building table of choices
    const tile_table: Array<{ weight: number; id: Tile }> = [
      { weight: config.tiles.line.density, id: Tiles[0] },
      { weight: config.tiles.wave.density, id: Tiles[1] },
      { weight: config.tiles.peak.density, id: Tiles[2] },
    ];

    // Selecting tile
    const tile_choice: Tile = rwc(tile_table);

    // --- Background color --- //

    // Drawing the background!
    const cell_path = new paper.Path.Rectangle(cell);

    // Building table of choices
    const bg_color_table: Array<{ weight: number; id: string }> = [];
    for (let color of Object.keys(config.color.background.distribution)) {
      bg_color_table.push({
        weight: config.color.background.distribution[color],
        id: color,
      });
    }

    // Setting color
    let bg_color;
    //
    if (config.color.background.mode == "tile") {
      bg_color = config.color.background.tile[tile_choice];
    }
    //
    else if (config.color.background.mode == "distribution") {
      bg_color = rwc(bg_color_table);
    }
    (cell_path as any).fillColor = bg_color;

    // --- Drawing tile --- //

    // Drawing accordingly
    let tile: paper.Path;
    if (tile_choice == "line") {
      tile = tile_line(cell_rect);
    } else if (tile_choice == "wave") {
      tile = tile_wave(cell_rect, choice([-1, 1]), config.tiles.wave.squaring);
    } else if (tile_choice == "peak") {
      tile = tile_peak(cell_rect, choice([-1, 1]), config.tiles.peak.squaring);
    }

    // --- Tile thickness --- //

    // Setting thickness
    tile.strokeWidth = choice(config.thicknesses) * cell.width;

    // --- Tile color --- //

    // Building table of choices
    const stroke_color_table: Array<{ weight: number; id: string }> = [];
    for (let color of Object.keys(config.color.tiles.distribution)) {
      stroke_color_table.push({
        weight: config.color.tiles.distribution[color],
        id: color,
      });
    }

    // Setting color
    let stroke_color;
    //
    if (config.color.tiles.mode == "tile") {
      stroke_color = config.color.tiles.tile[tile_choice];
    }
    //
    else if (config.color.tiles.mode == "distribution") {
      stroke_color = rwc(stroke_color_table);
    }
    (tile as any).strokeColor = stroke_color;
  }

  (paper.view as any).draw();
}
