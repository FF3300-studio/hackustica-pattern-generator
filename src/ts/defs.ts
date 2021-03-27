/**
 * Reference for this:
 * https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
 * https://thoughtbot.com/blog/the-trouble-with-typescript-enums
 * https://stackoverflow.com/questions/55020193/is-it-possible-to-create-a-typescript-type-from-an-array
 */

export const ColorModes = ["tile", "distribution"] as const;
export type ColorMode = typeof ColorModes[number];

export const Tiles = ["line", "wave", "peak"] as const;
export type Tile = typeof Tiles[number];

export const Directions = ["left", "right", "random"] as const;
export type Direction = typeof Directions[number];
