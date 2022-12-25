import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

const getStartingCoordinates = (grid: string[][]): [number, number] => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const mark = grid[row][col];
      if (mark === "S") return [row, col];
    }
  }

  return [-1, -1];
};

const getCoordinatesKey = (row: number, col: number): string => `${row},${col}`;

const canVisit = (
  row: number,
  col: number,
  grid: string[][],
  previousHeight: string,
  visited: Set<string>
): boolean => {
  const key = getCoordinatesKey(row, col);

  // Check for visited status or out of bounds
  const wasVisited = visited.has(key);
  const isInBounds =
    row >= 0 && col >= 0 && row < grid.length && col < grid[row].length;

  if (!wasVisited && isInBounds) {
    // Check we're not attempting to move to the starting position
    const visitingStartingPosition = grid[row][col] === "S";

    // Check we're not attempting to get to the end goal from a non-z character
    const visitingEndFromNonZ =
      grid[row][col] === "E" && previousHeight !== "z";

    // Check that the height difference is less than or equal to 1
    const heightDiff =
      grid[row][col].charCodeAt(0) - previousHeight.charCodeAt(0);

    return !visitingStartingPosition && !visitingEndFromNonZ && heightDiff <= 1;
  }

  return false;
};

const getShortestPath = (grid: string[][]): number => {
  const [startingRow, startingCol] = getStartingCoordinates(grid);

  // Set starting elevation to 'a'
  grid[startingRow][startingCol] = "a";

  let depth = 0;
  let queue: [[number, number], string | undefined][] = [
    [[startingRow, startingCol], "a"],
  ];
  const visited: Set<string> = new Set();

  while (queue.length > 0) {
    const queueCopy = [...queue];
    queue = [];

    for (const [[row, col], previousHeight] of queueCopy) {
      const key = getCoordinatesKey(row, col);
      const canVisitPosition = canVisit(
        row,
        col,
        grid,
        previousHeight,
        visited
      );

      if (canVisitPosition) {
        const currentHeight = grid[row][col];
        if (currentHeight === "E") {
          grid[row][col] = "z";
          return depth;
        }

        // Mark as visited
        visited.add(key);

        // Push surrounding positions onto the queue
        queue.push([[row - 1, col], currentHeight]); // Up
        queue.push([[row + 1, col], currentHeight]); // Down
        queue.push([[row, col - 1], currentHeight]); // Left
        queue.push([[row, col + 1], currentHeight]); // Right
      }
    }

    depth++;
  }

  return depth;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartOne = async (): Promise<number> => {
  const buffer: string = await readInput("day12.txt");
  const grid: string[][] = buffer.split("\n").map((track) => track.split(""));
  return getShortestPath(grid);
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartTwo = async (): Promise<number> => {
  const buffer: string = await readInput("day12.txt");
  console.log("Delete me once you've started to work on the problem!");
  return -1;
};

export default {
  // TODO
  part1: () => implementPartOne(),
  // TODO
  // part2: () => implementPartTwo(),
} as DayAnswer;
