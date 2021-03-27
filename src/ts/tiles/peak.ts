import paper from "paper";
import { interpolate_points } from "./interpolation";

export function peak(
  p: paper.Point,
  w: number,
  h: number,
  d: number = 1,
  s: number = 0.56
): paper.Path {
  if (h < 2 * w) {
    throw new Error("Change width and height!");
  }

  // This is the distance between the first point and the first arc point
  const dst = h / 2 - w;

  // This is the middle point
  const pM = p.add(new paper.Point(0, h / 2));

  // These are the first two points
  const p0 = p;
  const p1 = p0.add(new paper.Point(0, dst));

  // This is the peak point
  const p2 = p.add(new paper.Point(d * w, h / 2));

  // These are the last two points
  const p3 = pM.add(new paper.Point(0, w));
  const p4 = p.add(new paper.Point(0, h));

  // First two anchors
  const p12 = interpolate_points(p1, pM, s);
  const p21 = interpolate_points(p2, pM, s);

  // Other two anchors
  const p23 = interpolate_points(p2, pM, s);
  const p32 = interpolate_points(p3, pM, s);

  //   Drawing
  const path = new paper.Path();
  path.moveTo(p0);
  path.lineTo(p1);
  path.cubicCurveTo(p12, p21, p2);
  path.cubicCurveTo(p23, p32, p3);
  path.lineTo(p4);
  return path;
}

export function tile_peak(
  r: paper.Rectangle,
  d: number = 1,
  s: number = 0.56
): paper.Path {
  // Calculating origin point
  const p = new paper.Point(r.x + r.width / 2, r.y);
  // Getting path
  const path = peak(p, r.width / 2, r.height, d);

  return path;
}
