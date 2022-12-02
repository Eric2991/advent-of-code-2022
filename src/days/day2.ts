import type { DayAnswer } from '../types';
import { readInput } from '../utils/readInput';

/**
 * Gets the score of the shape we intend to throw
 * @param shape Shape that we intend to throw
 * @returns {number}
 */
const getShapeScore = (shape: string): number => {
  if (shape === 'X') {
    return 1;
  } else if (shape === 'Y') {
    return 2;
  } else if (shape === 'Z') {
    return 3;
  } else {
    return 0;
  }
};

/**
 * Gets the shape we need to throw to match the expected outcome
 * @param opponent Opponent's hand they intend to throw
 * @param outcome The outcome selection that needs to happen
 * @returns {string}
 */
const getNeededResponse = (opponent: string, outcome: string): string => {
  switch (opponent) {
    case 'A':
      return outcome === 'X' ? 'Z' : outcome === 'Y' ? 'X' : 'Y';
    case 'B':
      return outcome === 'X' ? 'X' : outcome === 'Y' ? 'Y' : 'Z';
    case 'C':
      return outcome === 'X' ? 'Y' : outcome === 'Y' ? 'Z' : 'X';
    default:
      return '';
  }
};

/**
 * Gets the score of the round given the opponent's hand and ours
 * @param opponent Opponent's hand they intend to throw
 * @param self Shape that we intend to throw
 * @returns {number}
 */
const getOutcomeScore = (opponent: string, self: string): number => {
  switch (opponent) {
    case 'A': 
      return self === 'Z' ? 0 : self === 'X' ? 3 : 6;
    case 'B':
      return self === 'X' ? 0 : self === 'Y' ? 3 : 6;
    case 'C':
      return self === 'Y' ? 0 : self === 'Z' ? 3 : 6;
    default:
      return 0;
  }
};

/**
 * Returns a promise that resolves to the score we're predicting based off
 * the incomplete scoring guide obtained by one of the elves
 * @returns {Promise<number>}
 */
const getPredictedScore = async (): Promise<number> => {
  const data: string = await readInput('day2.txt');

  return data.split('\n').reduce((sum, pair) => {
    const [opponent, self] = pair.split(' ');
    return sum + getShapeScore(self) + getOutcomeScore(opponent, self);
  }, 0);
};

/**
 * Returns a promise that resolves to the total score based on the
 * complete scoring guide obtained by one of the elves
 * @returns {Promise<number>}
 */
const getActualScore = async (): Promise<number> => {
  const data: string = await readInput('day2.txt');

  return data.split('\n').reduce((sum, pair) => {
    const [opponent, outcome] = pair.split(' ');
    const self = getNeededResponse(opponent, outcome);
    return sum + getShapeScore(self) + getOutcomeScore(opponent, self);
  }, 0);
};

export default {
  // Get the total score based off the assumed scoring guide
  part1: () => getPredictedScore(),
  // Get the total score based off the accurate scoring guide
  part2: () => getActualScore(),
} as DayAnswer;
