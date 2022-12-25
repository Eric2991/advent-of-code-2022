import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

type MarkSet = { [x: number]: Set<number> };

const generateMarkSet = (
  lines: string[][][]
): [[number, number], [number, number], MarkSet] => {
  const foo: MarkSet = {};
  let minX = null,
    maxX = null,
    minY = null,
    maxY = null;

  for (const line of lines) {
    if (line.length === 1) {
      const [x, y] = line[0];
      foo[+x] = (foo[+x] ?? new Set()).add(+y);

      minX = minX !== null ? Math.min(minX, +x) : +x;
      maxX = maxX !== null ? Math.max(maxX, +x) : +x;
      minY = minY !== null ? Math.min(minY, +y) : +y;
      maxY = maxY !== null ? Math.max(maxY, +y) : +y;
    } else {
      for (let i = 0; i + 1 < line.length; i++) {
        const [x1, y1] = line[i];
        const [x2, y2] = line[i + 1];

        minX = minX !== null ? Math.min(minX, +x1, +x2) : Math.min(+x1, +x2);
        maxX = maxX !== null ? Math.max(maxX, +x1, +x2) : Math.max(+x1, +x2);
        minY = minY !== null ? Math.min(minY, +y1, +y2) : Math.min(+y1, +y2);
        maxY = maxY !== null ? Math.max(maxY, +y1, +y2) : Math.min(+y1, +y2);

        if (+x2 - +x1 !== 0) {
          // Progression is horizontal
          const lower = Math.min(+x1, +x2);
          const higher = Math.max(+x1, +x2);
          for (let j = lower; j <= higher; j++) {
            foo[j] = (foo[j] ?? new Set()).add(+y1);
          }
        } else if (+y2 - +y1 !== 0) {
          // Progression is vertical
          const lower = Math.min(+y1, +y2);
          const higher = Math.max(+y1, +y2);
          for (let j = lower; j <= higher; j++) {
            foo[+x1] = (foo[+x1] ?? new Set()).add(j);
          }
        }
      }
    }
  }

  return [[minX, maxX], [minY, maxY], foo];
};

const generateMap = (
  markSet: MarkSet,
  [minX, maxX]: [number, number],
  [minY, maxY]: [number, number]
): string[][] => {
  let map: string[][] = Array.from<string[]>({ length: maxY + 1 }).map(() =>
    Array.from<string>({ length: maxX - minX + 1 }).fill(".")
  );

  for (let row = 0; row <= maxY; row++) {
    for (let col = 0; col <= maxX - minX; col++) {
      const set = markSet[col + minX] ?? new Set();
      map[row][col] = set.has(row) ? "#" : ".";
    }
  }

  return map;
};

const printMap = (map: string[][]) => {
  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    const row = map[rowIndex];
    console.log(rowIndex, row.join(" "));
  }

  console.log("");
};

const dropSand = (map: string[][], minX: number) => {
  const startingPoint = 500 - minX;
  let [sandX, sandY] = [startingPoint, 0];
  let numberOfSandUnits = 0;

  printMap(map);

  while (
    sandY >= 0 &&
    sandY < map.length &&
    sandX >= 0 &&
    sandX < map[sandY].length
  ) {
    if (sandY + 1 >= map.length || map[sandY + 1][sandX] === ".") {
      if (sandY + 1 >= map.length) break;
      // First attempt to go straight down
      sandY += 1;
    } else if (
      sandY + 1 >= map.length ||
      sandX - 1 < 0 ||
      map[sandY + 1][sandX - 1] === "."
    ) {
      if (sandY + 1 >= map.length || sandX - 1 < 0) break;
      // Otherwise, check down-left
      sandX -= 1;
      sandY += 1;
    } else if (
      sandY + 1 >= map.length ||
      sandX + 1 >= map[sandY + 1].length ||
      map[sandY + 1][sandX + 1] === "."
    ) {
      if (sandY + 1 >= map.length || sandX + 1 >= map[sandY + 1].length) break;
      // Finally, check down-right
      sandX += 1;
      sandY += 1;
    } else {
      // We've hit a stopping point
      if (map[sandY][sandX] === "o") {
        break;
      }
      map[sandY][sandX] = "o";

      numberOfSandUnits++;
      sandX = startingPoint;
      sandY = 0;
    }
  }

  printMap(map);
  return numberOfSandUnits;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartOne = async (): Promise<number> => {
  const buffer: string = await readInput("day14.txt");
  const lines: string[][][] = buffer
    .split("\n")
    .map((line) => line.split(" -> ").map((mark) => mark.split(",")));

  const [xBounds, yBounds, markSet] = generateMarkSet(lines);
  const map = generateMap(markSet, xBounds, yBounds);

  return dropSand(map, xBounds[0]);
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartTwo = async (): Promise<number> => {
  const buffer: string = await readInput("day14.txt");
  console.log("Delete me once you've started to work on the problem!");
  return -1;
};

export default {
  // TODO
  part1: () => implementPartOne(),
  // TODO
  // part2: () => implementPartTwo(),
} as DayAnswer;
