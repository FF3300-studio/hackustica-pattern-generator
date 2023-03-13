import lettersJSON from "../lib/letters.json";
import paper from "paper";

export function randomChoice<T>(arr: Array<T>): T {
  return arr[Math.floor(arr.length * Math.random())];
}

export async function svg(
  box: paper.Rectangle,
  svgPath: string
): Promise<paper.Item> {
  const path = await new Promise<paper.Item>((resolve) => {
    paper.project.importSVG(svgPath, {
      onLoad: (item: paper.Item) => {
        item.fillColor = new paper.Color("black");
        resolve(item);
      },
    });
  });
  path.fitBounds(box);
  return path;
}

export async function alfabetiAfricani(
  box: paper.Rectangle,
  alphabets: Array<string>
): Promise<paper.Item> {
  const alphabet = randomChoice<string>(alphabets);
  const letters = (lettersJSON as Record<string, string[]>)[alphabet];
  const letter = randomChoice<string>(letters);
  return await svg(box, letter);
}
