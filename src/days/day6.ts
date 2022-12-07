import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

/**
 * Returns the minimum number of characters to process the start of
 * a marker section given the length of the section
 * @param lengthOfSection Length of section in marker
 * @returns {Promise<number>}
 */
const getMinNumberOfCharactersToProcessStartOfMarker = async (
  lengthOfSection: number
): Promise<number> => {
  const buffer: string = await readInput("day6.txt");
  for (let i = 0; i < buffer.length; i++) {
    if (i - (lengthOfSection - 1) >= 0) {
      const distinctCharacters: Set<string> = new Set();
      for (let j = i - (lengthOfSection - 1); j <= i; j++) {
        if (!distinctCharacters.has(buffer[j])) {
          distinctCharacters.add(buffer[j]);
        } else {
          break;
        }
      }

      if (distinctCharacters.size === lengthOfSection) {
        return i + 1;
      }
    }
  }
  return -1;
};

export default {
  // Get the minimum number of character needed to be processed
  // before the first start-of-packet marker is detected
  part1: () => getMinNumberOfCharactersToProcessStartOfMarker(4),
  // Get the minimum number of character needed to be processed
  // before the first start-of-message marker is detected
  part2: () => getMinNumberOfCharactersToProcessStartOfMarker(14),
} as DayAnswer;
