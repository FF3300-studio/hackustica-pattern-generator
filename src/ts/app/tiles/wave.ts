import paper from "paper";
import { interpolate_points } from "./interpolation";

export function wave(
  p: paper.Point,
  w: number,
  h: number,
  s: number
): paper.Path {
  // Wave anchors
  const p0 = p;
  const p1 = p0.add(new paper.Point(w, h / 2));
  const p2 = p0.add(new paper.Point(0, h));

  // Calculating first anchors
  const p01 = p0.add(new paper.Point(0, (+h / 2) * s));
  const p10 = p1.add(new paper.Point(0, (-h / 2) * s));

  // Calculating second anchors
  const p12 = p1.add(new paper.Point(0, (+h / 2) * s));
  const p21 = p2.add(new paper.Point(0, (-h / 2) * s));

  // Drawing
  const path = new paper.Path();
  path.moveTo(p0);
  path.cubicCurveTo(p01, p10, p1);
  path.cubicCurveTo(p12, p21, p2);

  return path;
}

export function tile_wave(
  r: paper.Rectangle,
  d: number = 1,
  s: number = 0.5
): paper.Path {
  // Calculating origin point
  const p = new paper.Point(r.x + r.width / 2, r.y);
  // Getting path
  const path = wave(p, (d * r.width) / 4, r.height, s);

  return path;
}
