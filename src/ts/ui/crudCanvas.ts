export function deleteCanvas(id: string): void {
  const canvas_old: HTMLElement = document.getElementById(id);
  if (canvas_old) {
    canvas_old.remove();
  }
}

export function createCanvas(
  id: string,
  parent: HTMLElement,
  width: number,
  height: number
): HTMLCanvasElement {
  // Creating canvas
  const canvas = <HTMLCanvasElement>document.createElement("CANVAS");
  canvas.id = id;
  canvas.width = width;
  canvas.height = height;

  // Appending canvas
  parent.appendChild(canvas);

  return canvas;
}
