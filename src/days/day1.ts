import type { DayAnswer } from '../types';
import { readInput } from '../utils/readInput';

/**
 * Returns the sum of calories held by the top N elves in the list.
 * Defaults to the single top elf if no N value is specified.
 * @param topN Number of elves to pull the top caloric sums from
 * @returns {Promise<number>}
 */
const getTopElvesCaloricSum = async (topN: number = 1): Promise<number> => {
  const data: string = await readInput('day1.txt');
  const maxNSums: number[] = Array.from<number>({ length: topN }).fill(0);
  
  let currentSum = 0;
  for (const calorieCount of data.split("\n")) {
    const numericCalorieCount = +calorieCount;
    if (numericCalorieCount > 0) {
      currentSum += numericCalorieCount;
    } else {
      for (let i = 0; i < maxNSums.length; i++) {
        if (maxNSums[i] < currentSum) {
          // Add in the top sum in the correct position in the list
          maxNSums.splice(i, 0, currentSum);

          // Remove the lowest number from the N-tuple
          maxNSums.splice(-1, 1);
          break;
        }
      }
      currentSum = 0;
    }
  }

  return maxNSums.reduce((sum, num) => sum + num, 0);
};

export default {
  // Get the sum of the calories held by the elf with the most calories
  part1: () => getTopElvesCaloricSum(),
  // Get the sum of the calories held by the top 3 elves with the most calories
  part2: () => getTopElvesCaloricSum(3),
} as DayAnswer;
