import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

/**
 * Returns a boolean indicating if the primary numeric pair encapsulates the target pair
 * @param primary Numeric pair to compare against
 * @param target Numeric pair to compare with the primary pair
 * @param complete Optional boolean flag to check if the primary pair fully encapsulates the target
 * @returns {boolean}
 */
const containsPair = (
  primary: number[],
  target: number[],
  complete: boolean = false
): boolean => {
  if (primary[0] <= target[0]) {
    return (
      primary[primary.length - 1] >= target[complete ? target.length - 1 : 0]
    );
  }

  return false;
};

/**
 * Gets the number of assignment pairs that fully encapsulate the other
 * @returns {Promise<number>}
 */
const getFullyContainedAssignmentPairs = async (): Promise<number> => {
  const data: string = await readInput("day4.txt");
  let result = 0;

  for (const pair of data.split("\n")) {
    if (pair.length > 0) {
      const [first, second] = pair.split(",");
      const firstPair = first.split("-").map(Number);
      const secondPair = second.split("-").map(Number);
      const match =
        containsPair(firstPair, secondPair, true) ||
        containsPair(secondPair, firstPair, true);

      result += match ? 1 : 0;
    }
  }

  return result;
};

/**
 * Gets the number of assignment pairs that partially encapsulate the other
 * @returns {Promise<number>}
 */
const getPartiallyContainedAssignmentPairs = async (): Promise<number> => {
  const data: string = await readInput("day4.txt");
  let result = 0;

  for (const pair of data.split("\n")) {
    if (pair.length > 0) {
      const [first, second] = pair.split(",");
      const firstPair = first.split("-").map(Number);
      const secondPair = second.split("-").map(Number);
      const match =
        containsPair(firstPair, secondPair) ||
        containsPair(secondPair, firstPair);

      result += match ? 1 : 0;
    }
  }

  return result;
};

export default {
  // Get the number of assignment pairs that fully contain the other
  part1: () => getFullyContainedAssignmentPairs(),
  // Get the number of assignment pairs that partially contain the other
  part2: () => getPartiallyContainedAssignmentPairs(),
} as DayAnswer;
