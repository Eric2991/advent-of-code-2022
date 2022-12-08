import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

/**
 * Transforms raw puzzle input into a 2-dimensional array
 * representing a grid of trees represented by their numeric height
 * @param buffer Raw puzzle input, unformatted
 * @returns {number[][]}
 */
const convertToTreeGrid = (buffer: string): number[][] => {
  const lines: string[] = buffer.split("\n");
  const result: number[][] = [];
  for (const line of lines) {
    if (line.length > 0) {
      const treeRow: number[] = line.split("").map(Number);
      result.push(treeRow);
    }
  }
  return result;
};

/**
 * Returns the number of perimeter trees summed with the number of
 * trees visible within the grid, given that the trees are not blocked
 * @returns {Promise<number>}
 */
const getNumberOfVisibleTrees = async (): Promise<number> => {
  const buffer: string = await readInput("day8.txt");
  const treeGrid: number[][] = convertToTreeGrid(buffer);

  // Count the trees on the outer grid
  const treesAlongVerticalSides = (treeGrid.length - 1) * 2;
  const treesAlongHorizontalSides = (treeGrid[0].length - 1) * 2;
  let result = treesAlongVerticalSides + treesAlongHorizontalSides;

  // Iterate through the inner trees
  for (let row = 1; row < treeGrid.length - 1; row++) {
    const treeRow: number[] = treeGrid[row];
    for (let col = 1; col < treeRow.length - 1; col++) {
      const tree: number = treeRow[col];
      let isVisibleAbove = true,
        isVisibleBelow = true,
        isVisibleLeft = true,
        isVisibleRight = true;

      // Check above
      for (
        let aboveIter = row - 1;
        isVisibleAbove && aboveIter >= 0;
        aboveIter--
      ) {
        if (treeGrid[aboveIter][col] >= tree) isVisibleAbove = false;
      }

      // Check below
      for (
        let belowIter = row + 1;
        isVisibleBelow && belowIter < treeGrid.length;
        belowIter++
      ) {
        if (treeGrid[belowIter][col] >= tree) isVisibleBelow = false;
      }

      // Check left
      for (let leftIter = col - 1; isVisibleLeft && leftIter >= 0; leftIter--) {
        if (treeRow[leftIter] >= tree) isVisibleLeft = false;
      }

      // Check right
      for (
        let rightIter = col + 1;
        isVisibleRight && rightIter < treeRow.length;
        rightIter++
      ) {
        if (treeRow[rightIter] >= tree) isVisibleRight = false;
      }

      if (isVisibleAbove || isVisibleBelow || isVisibleLeft || isVisibleRight)
        result++;
    }
  }

  return result;
};

/**
 * Returns the highest possible scenic score for a tree
 * @returns {Promise<number>}
 */
const getHighestPossibleScenicScore = async (): Promise<number> => {
  const buffer: string = await readInput("day8.txt");
  const treeGrid: number[][] = convertToTreeGrid(buffer);
  let result = 0;

  // Iterate through the inner grid, since all perimeter trees have a zero scenic score
  for (let row = 1; row < treeGrid.length - 1; row++) {
    const treeRow: number[] = treeGrid[row];
    for (let col = 1; col < treeRow.length - 1; col++) {
      const tree: number = treeRow[col];
      let visibilityAbove = 0,
        visibilityBelow = 0,
        visibilityLeft = 0,
        visibilityRight = 0;

      // Check above
      for (let aboveIter = row - 1; aboveIter >= 0; aboveIter--) {
        visibilityAbove++;
        if (treeGrid[aboveIter][col] >= tree) break;
      }

      // Check below
      for (let belowIter = row + 1; belowIter < treeGrid.length; belowIter++) {
        visibilityBelow++;
        if (treeGrid[belowIter][col] >= tree) break;
      }

      // Check left
      for (let leftIter = col - 1; leftIter >= 0; leftIter--) {
        visibilityLeft++;
        if (treeRow[leftIter] >= tree) break;
      }

      // Check right
      for (let rightIter = col + 1; rightIter < treeRow.length; rightIter++) {
        visibilityRight++;
        if (treeRow[rightIter] >= tree) break;
      }

      const scenicScore =
        visibilityAbove * visibilityBelow * visibilityLeft * visibilityRight;
      if (scenicScore > result) {
        result = scenicScore;
      }
    }
  }

  return result;
};

export default {
  // Get the number of trees visible from outside the grid
  part1: () => getNumberOfVisibleTrees(),
  // Get the highest scenic score possible for any tree in the grid
  part2: () => getHighestPossibleScenicScore(),
} as DayAnswer;
