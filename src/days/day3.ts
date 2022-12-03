import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

/**
 * Returns the priority of the item type we are assessing
 * @param {string | null} char The item type
 * @returns {number}
 */
const getPriorityValue = (char: string | null): number => {
  if (char == null) {
    return 0;
  } else {
    return /[a-z]/.test(char)
      ? char.charCodeAt(0) - 96 // Returns 1-26 for a-z
      : char.charCodeAt(0) - 38; // Returns 27-52 for A-Z
  }
};

/**
 * Returns the sum of priorities of all item types that
 * are found in both compartments of every rucksack
 * @returns {Promise<number>}
 */
const getPrioritySum = async (): Promise<number> => {
  const data: string = await readInput("day3.txt");

  return data.split("\n").reduce((sum, rucksack) => {
    if (rucksack.length > 0) {
      const [firstCompartment, secondCompartment] = [
        rucksack.slice(0, rucksack.length / 2),
        rucksack.slice(rucksack.length / 2),
      ];
      const matchingCharacters = firstCompartment.match(
        new RegExp(`[${secondCompartment}]`)
      );
      const match =
        matchingCharacters.length > 0 ? matchingCharacters[0] : null;
      return sum + getPriorityValue(match);
    }

    // account for empty lines
    return sum;
  }, 0);
};

/**
 * Returns the sum of priorities of all item types that
 * are found in all rucksacks of each n-elf group
 * @param {number} numElves The number of elves in a group
 * @returns {Promise<number>}
 */
const getGroupPrioritySum = async (numElves: number): Promise<number> => {
  const data: string = await readInput("day3.txt");

  let group: string[] = [];
  return data.split("\n").reduce((sum, rucksack) => {
    if (rucksack.length > 0) {
      // Check if we've collected at least n-1 elves' rucksacks so we can
      // treat the current elf we are iterating on as the nth elf
      if (group.length === numElves - 1) {
        const matchingCharacters: string[] =
          // Get the sets of characters that are present amongst the n elves' rucksacks
          group
            .map((elfRucksack, i) => {
              // Compare against the next elf's rucksack. If we're at the last
              // elf in the group, compare agains the current elf's rucksack
              // (the true last elf in the group)
              const rucksackToCompareAgainst =
                i === group.length - 1 ? rucksack : group[i + 1];
              return new Set(
                elfRucksack.match(
                  new RegExp(`[${rucksackToCompareAgainst}]`, "g")
                )
              );
            })
            // Reduce to a list of characters that are present amongst all the sets (should be of length 1)
            .reduce(
              (matchingChars: string[], set: Set<string>) =>
                matchingChars == null
                  ? Array.from(set)
                  : matchingChars.reduce(
                      (result, char) =>
                        set.has(char) ? [...result, char] : result,
                      []
                    ),
              null
            );

        // Get the matching character from the list of matching characters (should always be length 1)
        // Default to null if no matching characters found
        const match =
          matchingCharacters.length > 0 ? matchingCharacters[0] : null;

        // reset group
        group = [];
        return sum + getPriorityValue(match);
      } else {
        group.push(rucksack);
      }
    }

    // account for empty lines
    return sum;
  }, 0);
};

export default {
  // Get the sum of the priorities of item types found in both compartments of a rucksack
  part1: () => getPrioritySum(),
  // Get the sum of the priorities of item types found in all rucksacks of each three-elf group
  part2: () => getGroupPrioritySum(3),
} as DayAnswer;
