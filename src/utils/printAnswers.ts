import type { DayAnswer } from '../types';

/** Prints the given day's answers in the console */
export default async (dayNumber: number, { part1, part2 }: DayAnswer) => {
  console.log(`\x1b[32m[Day ${dayNumber}]\x1b[0m`);

  const part1Start = process.hrtime();
  const part1Result = await part1();
  const part1Finish = process.hrtime(part1Start);
  console.log(`  Part 1: \x1b[33m${part1Result}\x1b[0m \x1b[2m(duration: ${part1Finish[1] / 1000000}ms)\x1b[0m`);

  if (part2 != null) {
    const part2Start = process.hrtime();
    const part2Result = await part2();
    const part2Finish = process.hrtime(part2Start);
    console.log(`  Part 2: \x1b[33m${part2Result}\x1b[0m \x1b[2m(duration: ${part2Finish[1] / 1000000}ms)\x1b[0m`);
  }
};