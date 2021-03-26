import paper from "paper";

export function tile_line(r: paper.Rectangle): paper.Path {
  // Calculating origin point
  const p = new paper.Point(r.x + r.width / 2, r.y);
  // Getting path
  const path = new paper.Path.Line(p, p.add(new paper.Point(0, r.height)));

  return path;
}
