import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

const Directions: Array<"U" | "D" | "R" | "L"> = ["U", "D", "R", "L"];
const DirectionIndexMap = Object.freeze({
  U: { primaryIndex: 1, secondaryIndex: 0, vector: -1 },
  D: { primaryIndex: 1, secondaryIndex: 0, vector: 1 },
  R: { primaryIndex: 0, secondaryIndex: 1, vector: 1 },
  L: { primaryIndex: 0, secondaryIndex: 1, vector: -1 },
});

/**
 * TODO
 * @returns {Promise<number>}
 */
const calculateNumberOfUniqueTailPositions = async (
  numberOfKnots: number = 2
): Promise<number> => {
  const buffer: string = await readInput("day9.txt");
  const instructions = buffer.split("\n");
  const tailVisits: Set<string> = new Set();

  let knotPointers: [number, number][] = Array.from<[number, number]>({
    length: numberOfKnots,
  }).reduce((result) => [...result, [0, 0]], []);

  const move = (direction: "U" | "D" | "R" | "L", distance: number) => {
    const { primaryIndex, secondaryIndex, vector } =
      DirectionIndexMap[direction];
    for (let i = 0; i < distance; i++) {
      for (let knot = 0; knot + 1 < numberOfKnots; knot++) {
        const prevEndPointer = knotPointers[knot - 1];
        const headPointer = knotPointers[knot];
        const tailPointer = knotPointers[knot + 1];

        if (
          prevEndPointer == null ||
          (vector === -1
            ? headPointer[primaryIndex] - 1 > prevEndPointer[primaryIndex]
            : headPointer[primaryIndex] + 1 < prevEndPointer[primaryIndex])
        ) {
          if (
            tailPointer[secondaryIndex] === headPointer[secondaryIndex] &&
            Math.abs(
              headPointer[primaryIndex] + vector - tailPointer[primaryIndex]
            ) > 1
          ) {
            tailPointer[primaryIndex] += vector;
          } else if (
            tailPointer[secondaryIndex] < headPointer[secondaryIndex] &&
            headPointer[secondaryIndex] - tailPointer[secondaryIndex] >= 1
          ) {
            if (
              (vector === -1
                ? tailPointer[primaryIndex] > headPointer[primaryIndex]
                : tailPointer[primaryIndex] < headPointer[primaryIndex]) &&
              Math.abs(tailPointer[primaryIndex] - headPointer[primaryIndex]) >=
                1
            ) {
              tailPointer[primaryIndex] += vector;
              tailPointer[secondaryIndex] += 1;
            }
          } else if (
            tailPointer[secondaryIndex] - headPointer[secondaryIndex] >=
            1
          ) {
            if (
              (vector === -1
                ? tailPointer[primaryIndex] > headPointer[primaryIndex]
                : tailPointer[primaryIndex] < headPointer[primaryIndex]) &&
              Math.abs(tailPointer[primaryIndex] - headPointer[primaryIndex]) >=
                1
            ) {
              tailPointer[primaryIndex] += vector;
              tailPointer[secondaryIndex] -= 1;
            }
          }

          headPointer[primaryIndex] += vector;
        }

        // numberOfKnots === 10 &&
        //   console.log(
        //     direction,
        //     knot,
        //     `(${i + 1} / ${distance}):`,
        //     headPointer,
        //     tailPointer
        //   );
      }

      // numberOfKnots === 10 && console.log("");
      tailVisits.add(
        `${knotPointers[numberOfKnots - 1][0]},${
          knotPointers[numberOfKnots - 1][1]
        }`
      );
    }
  };

  for (const instruction of instructions) {
    const [rawDirection, units] = instruction.split(" ");
    const direction = Directions.find((d) => d === rawDirection);
    const distance: number = +units;
    direction != null && move(direction, distance);
  }

  return tailVisits.size;
};

export default {
  // TODO
  part1: () => calculateNumberOfUniqueTailPositions(),
  // TODO
  part2: () => calculateNumberOfUniqueTailPositions(10),
} as DayAnswer;
