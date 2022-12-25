import { readdir, writeFile } from "fs";
import { join } from "path";

/**
 * Generates the content of an Advent of Code day problem file written in typescript
 * @param {number} day Number representing the advent of code day
 * @returns {string}
 */
const generateDayFile = (
  day: number
): string => `import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartOne = async (): Promise<number> => {
  const buffer: string = await readInput("day${day}.txt");
  console.log("Delete me once you've started to work on the problem!")
  return -1;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartTwo = async (): Promise<number> => {
  const buffer: string = await readInput("day${day}.txt");
  console.log("Delete me once you've started to work on the problem!")
  return -1;
};

export default {
  // TODO
  part1: () => implementPartOne(),
  // TODO
  // part2: () => implementPartTwo(),
} as DayAnswer;
`;

readdir("src/days", async (err, files) => {
  // Handle directory scan error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  // Get last attempted day
  if (files.length > 0) {
    const sortedFiles = files.sort((a, b) => {
      const aDay: number = +a.match(/[0-9]+/g)[0];
      const bDay: number = +b.match(/[0-9]+/g)[0];

      return aDay < bDay ? -1 : aDay > bDay ? 1 : 0;
    });

    const dayRegexMatch = sortedFiles[sortedFiles.length - 1].match(/[0-9]+/g);
    const day: number =
      dayRegexMatch.length > 0 && !isNaN(+dayRegexMatch[0])
        ? +dayRegexMatch[0]
        : 0;

    // Write the day problem TS file and its respective txt file
    try {
      await Promise.all([
        writeFile(
          `${join(__dirname, "../src/days")}/day${day + 1}.ts`,
          generateDayFile(day + 1),
          (err) => {
            if (err) throw err;
          }
        ),
        writeFile(
          `${join(__dirname, "../static")}/day${day + 1}.txt`,
          "",
          (err) => {
            if (err) throw err;
          }
        ),
      ]);
    } catch (err) {
      throw err;
    }
  }
});
