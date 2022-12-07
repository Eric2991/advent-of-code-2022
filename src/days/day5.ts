import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

const crateRegEx = /\[/;
const crateNameRegEx = /[A-Z]/;
const whitespaceRegEx = /^\s*$/;
const instructionRegEx = /move ([0-9]+) from ([0-9]+) to ([0-9]+)/;

/**
 * Returns a string representing the top crate on each stack, with order of stacks preserved
 * @param crates 2-dimensional list representing stacks of crates
 * @returns {string}
 */
const getTopOfStacks = (crates: string[][]): string => {
  let result = "";
  for (const stack of crates) {
    result += stack[stack.length - 1];
  }
  return result;
};

/**
 * Generates a 2-dimensional list representing stacks of crates in the order which they were represented
 * in the raw data, as well as the numeric index for which to continue processing the raw input data
 * @param data Raw data representing stacks of crates
 * @returns {[string[][], number]}
 */
const generateCrates = (data: string[]): [string[][], number] => {
  const numberOfCrates = (data[0].length + 1) / 4;
  let crates: string[][] = Array.from<string[]>({
    length: numberOfCrates,
  }).fill([]);

  let iterator = 0;
  while (crateRegEx.test(data[iterator])) {
    for (let i = 1; i < data[iterator].length; i += 4) {
      const crate: string = data[iterator][i];
      if (crateNameRegEx.test(crate)) {
        crates[Math.floor(i / 4)] = [crate, ...crates[Math.floor(i / 4)]];
      }
    }

    iterator++;
  }

  // Go to the starting index of the instructions
  iterator++;
  if (!whitespaceRegEx.test(data[iterator])) {
    throw new Error("Should be at the empty line");
  } else {
    iterator++;
  }

  return [crates, iterator];
};

type Options = {
  /** Enables the crane to move multiple crates at once */
  multi?: boolean;
};

/**
 * Returns a string representing the top crate on each stack after performing all instructions
 * @param options Options to tweak the crane
 * @returns {Promise<string>}
 */
const getTopOfRearrangedCrates = async (options?: Options): Promise<string> => {
  const data: string = await readInput("day5.txt");
  const lines: string[] = data.split("\n");
  let [crates, iterator] = generateCrates(lines);

  while (iterator < lines.length) {
    const instruction = lines[iterator];
    if (instruction.length > 0) {
      const [, numberToMove, from, to] = instruction.match(instructionRegEx);

      if (options?.multi) {
        let cratesToBePushed: string[] = [];
        for (let i = 0; i < +numberToMove; i++) {
          cratesToBePushed.push(crates[+from - 1].pop());
        }

        const numberOfCratesToBePushed = cratesToBePushed.length;
        for (let i = 0; i < numberOfCratesToBePushed; i++) {
          crates[+to - 1].push(cratesToBePushed.pop());
        }
      } else {
        for (let i = 0; i < +numberToMove; i++) {
          crates[+to - 1].push(crates[+from - 1].pop());
        }
      }
    }

    iterator++;
  }

  return getTopOfStacks(crates);
};

export default {
  // Get tops of each stack after moving crates one at a time
  part1: () => getTopOfRearrangedCrates(),
  // Gets tops of each stack after moving crates multiple at a time
  part2: () => getTopOfRearrangedCrates({ multi: true }),
} as DayAnswer;
