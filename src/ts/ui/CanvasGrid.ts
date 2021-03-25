class Frame {
  width: number;
  height: number;
  ratio: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.ratio = this._calcRatio();
  }

  _calcRatio(): number {
    return this.width / this.height;
  }
}

class Grid {
  rows: number;
  columns: number;
  cell_ratio: number;
  spacing: {
    column: number;
    row: number;
  };
  frame: Frame;

  constructor(
    rows: number,
    columns: number,
    cell_ratio: number,
    spacing = { column: 0, row: 0 }
  ) {
    this.rows = rows;
    this.columns = columns;
    this.cell_ratio = cell_ratio;
    this.spacing = spacing;
    this.frame = new Frame(this._calcWidth(), this._calcHeight());
  }

  _calcHeight(): number {
    /**
     * number of cells in a column   * cell height +
     * number of gaps between colums * cell height * gap height
     */
    return this.rows * 1 + (this.rows - 1) * 1 * this.spacing.row;
  }

  _calcWidth(): number {
    /**
     * number of cell in row        * cell width +
     * number of gaps between rows  * cell width * gap width
     */
    return (
      this.columns * this.cell_ratio +
      (this.columns - 1) * this.cell_ratio * this.spacing.column
    );
  }
}

export default class CanvasGrid {
  canvas: Frame;
  grid: Grid;
  cell: {
    width: number;
    height: number;
  };
  origin: {
    x: number;
    y: number;
  };

  constructor(canvas: Frame, grid: Grid) {
    this.canvas = canvas;
    this.grid = grid;
    this.cell = this.calcCellSize();
  }

  isGridHorizontal(): boolean {
    return this.canvas.ratio < this.grid.frame.ratio;
  }

  calcCellSize(): { width: number; height: number } {
    let cell_width: number;
    let cell_height: number;

    if (this.isGridHorizontal()) {
      cell_width = this.canvas.width / this.grid.frame.width;
      cell_height = cell_width / this.grid.cell_ratio;
    }
    //
    else {
      cell_height = this.canvas.height / this.grid.frame.height;
      cell_width = cell_height * this.grid.cell_ratio;
    }

    return { width: cell_width, height: cell_height };
  }

  calcGridWidth(): number {
    return this.cell.height * this.grid.frame.width;
  }

  calcGridHeight(): number {
    return this.cell.height * this.grid.frame.height;
  }

  calcOriginX(): number {
    return (this.canvas.width - this.calcGridWidth()) / 2;
  }

  calcOriginY(): number {
    return (this.canvas.height - this.calcGridHeight()) / 2;
  }
}
