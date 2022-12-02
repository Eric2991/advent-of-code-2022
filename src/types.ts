export type DayAnswer = {
  /** first part of the day's problem */
  part1: () => Promise<number>,
  /** second part of the day's problem */
  part2?: () => Promise<number>
};