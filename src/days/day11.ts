import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

type Monkey = {
  items: number[];
  operation: (old: number) => number;
  decide: (worryLevel: number) => number;
  divisibility: number;
};

type InspectionCounts = { [monkeyId: number]: number };

const ItemsLabel = "Starting items";
const OperationLabel = "Operation";
const TestLabel = "Test";
const TrueResultLabel = "If true";
const FalseResultLabel = "If false";

const getMonkeys = (buffer: string): Monkey[] =>
  buffer.split("\n\n").map((monkey) =>
    monkey
      .split("\n")
      .slice(1)
      .map((info) => info.trim())
      .reduce(
        (result, info, i, arr) => {
          const [label, value] = info.split(":").map((part) => part.trim());

          switch (label) {
            case ItemsLabel:
              return { ...result, items: value.split(", ").map((val) => +val) };
            case OperationLabel: {
              const expression = value.split("new = ")[1];
              return {
                ...result,
                operation: (old: number) =>
                  eval(expression.replace("old", String(old))),
              };
            }
            case TestLabel: {
              const testDivisibility = +value.match(/[0-9]+/g)[0];
              const trueMonkey = +arr
                .find((info) => {
                  const [label] = info.split(":").map((part) => part.trim());
                  return label === TrueResultLabel;
                })
                .match(/[0-9]+/g)[0];
              const falseMonkey = +arr
                .find((info) => {
                  const [label] = info.split(":").map((part) => part.trim());
                  return label === FalseResultLabel;
                })
                .match(/[0-9]+/g)[0];

              return {
                ...result,
                decide: (old: number) =>
                  old % testDivisibility === 0 ? trueMonkey : falseMonkey,
                divisibility: testDivisibility,
              };
            }
            default:
              return result;
          }
        },
        {
          items: [],
          operation: () => -1,
          decide: () => -1,
          divisibility: -1,
        }
      )
  );

const sortActiveMonkeys = (inspectionCounts: InspectionCounts): number[] =>
  Object.values(inspectionCounts).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));

const defaultModuloRelief = (monkeys: Monkey[]): number => {
  let result = 1;

  for (const { divisibility } of monkeys) {
    result *= divisibility;
  }

  return result;
};

const getInspectionCounts = (
  monkeys: Monkey[],
  maxRound: number,
  operationCallback?: (item: number) => number
): InspectionCounts => {
  const inspectionCounts: InspectionCounts = {};
  const defaultRelief: number = defaultModuloRelief(monkeys);

  // Iterate through each monkey until they have
  // no more items they're holding for each round
  for (let round = 0; round < maxRound; round++) {
    for (let monkeyId = 0; monkeyId < monkeys.length; monkeyId++) {
      const { items, operation, decide } = monkeys[monkeyId];

      if (items.length > 0) {
        // Increase the number of inspections the monkey did
        inspectionCounts[monkeyId] =
          (inspectionCounts[monkeyId] ?? 0) + items.length;
      }

      // Iterate through all items that the monkey has
      while (items.length > 0) {
        // Get worry level for item post-operation
        const initialWorryLevel = operation(items.shift());
        const worryLevel =
          operationCallback != null
            ? operationCallback(initialWorryLevel)
            : initialWorryLevel % defaultRelief;

        // Decide which monkey to throw to
        const monkeyToThrowTo = decide(worryLevel);

        // Throw the item to the decided monkey at the end of their list
        monkeys[monkeyToThrowTo].items.push(worryLevel);
      }
    }
  }

  return inspectionCounts;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartOne = async (maxRound: number): Promise<number> => {
  const buffer: string = await readInput("day11.txt");
  const monkeys: Monkey[] = getMonkeys(buffer);
  const inspectionCounts: InspectionCounts = getInspectionCounts(
    monkeys,
    maxRound,
    (item) => Math.floor(item / 3)
  );

  const [mostActive, secondMostActive] = sortActiveMonkeys(inspectionCounts);
  return mostActive * secondMostActive;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartTwo = async (maxRound: number): Promise<number> => {
  const buffer: string = await readInput("day11.txt");
  const monkeys: Monkey[] = getMonkeys(buffer);
  const inspectionCounts: InspectionCounts = getInspectionCounts(
    monkeys,
    maxRound
  );

  const [mostActive, secondMostActive] = sortActiveMonkeys(inspectionCounts);
  return mostActive * secondMostActive;
};

export default {
  // TODO
  part1: () => implementPartOne(20),
  // TODO
  part2: () => implementPartTwo(10000),
} as DayAnswer;
