import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

const AddXCycles = 1;

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartOne = async (): Promise<number> => {
  const buffer: string = await readInput("day10.txt");
  const instructions: string[] = buffer.split("\n");
  let cycle: number = 1,
    instructionIndex = 0,
    instructionStartIndex = null,
    x = 1,
    cycleSum = 0,
    signalStengthCycle = 20;

  while (instructionIndex < instructions.length) {
    const [instruction, value] = instructions[instructionIndex].split(" ");

    cycle++;

    switch (instruction) {
      case "noop": {
        instructionIndex++;
        break;
      }
      case "addx": {
        if (instructionStartIndex === null) {
          instructionStartIndex = cycle;
        } else if (cycle - instructionStartIndex === AddXCycles) {
          instructionStartIndex = null;
          x += +value;
          instructionIndex++;
        }

        break;
      }
    }

    if (cycle === signalStengthCycle) {
      cycleSum += cycle * x;
      signalStengthCycle += 40;
    }
  }

  return cycleSum;
};

const RowSize = 40;

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartTwo = async (): Promise<string> => {
  const buffer: string = await readInput("day10.txt");
  const instructions: string[] = buffer.split("\n");
  let cycle: number = 1,
    instructionIndex = 0,
    instructionStartIndex = null,
    x = 1,
    crtDrawing = "\n",
    row = 0;

  while (instructionIndex < instructions.length) {
    const [instruction, value] = instructions[instructionIndex].split(" ");
    const position = x + row * RowSize;

    crtDrawing += cycle >= position && cycle <= position + 2 ? "#" : ".";
    if (cycle % RowSize === 0) {
      crtDrawing += "\n";
      row++;
    }

    cycle++;

    switch (instruction) {
      case "noop": {
        instructionIndex++;
        break;
      }
      case "addx": {
        if (instructionStartIndex === null) {
          instructionStartIndex = cycle;
        } else if (cycle - instructionStartIndex === AddXCycles) {
          instructionStartIndex = null;
          x += +value;
          instructionIndex++;
        }

        break;
      }
    }
  }

  return crtDrawing;
};

export default {
  // TODO
  part1: () => implementPartOne(),
  // TODO
  part2: () => implementPartTwo(),
} as DayAnswer;
