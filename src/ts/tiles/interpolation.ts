import paper from "paper";

export function interpolate_values(v1: number, v2: number, f: number): number {
  return v1 + (v2 - v1) * f;
}

export function interpolate_points(
  p1: paper.Point,
  p2: paper.Point,
  f: number
): paper.Point {
  //
  return new paper.Point(
    interpolate_values(p1.x, p2.x, f),
    interpolate_values(p1.y, p2.y, f)
  );
}
