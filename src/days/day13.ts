import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

type Packet = number | Packet[];

const isInOrder = (
  leftPacket: Packet[],
  rightPacket: Packet[]
): boolean | undefined => {
  // Check that right list is equal to or larger in size than the left
  for (let i = 0; i < leftPacket.length; i++) {
    const left = leftPacket[i];
    const right = rightPacket[i];

    if (right === undefined) return false;

    // Check if both are numbers
    if (typeof left === "number" && typeof right === "number") {
      if (left < right) return true;
      if (left > right) return false;
    } else {
      const leftCastAsList = Array.isArray(left) ? left : [left];
      const rightCastAsList = Array.isArray(right) ? right : [right];
      const result = isInOrder(leftCastAsList, rightCastAsList);

      if (result !== undefined) return result;
    }
  }

  // Ran through all of left list
  return undefined;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartOne = async (): Promise<number> => {
  const buffer: string = await readInput("day13.txt");
  const packets: string[][] = buffer
    .split("\n\n")
    .map((packet) => packet.split("\n"));
  let packetsInOrderSum = 0;

  for (let packetId = 0; packetId < packets.length; packetId++) {
    const [leftRaw, rightRaw] = packets[packetId];
    const left: Packet[] = eval(leftRaw);
    const right: Packet[] = eval(rightRaw);

    const result = isInOrder(left, right);

    if (result !== false) packetsInOrderSum += packetId + 1;
  }

  return packetsInOrderSum;
};

/**
 * TODO
 * @returns {Promise<number>}
 */
const implementPartTwo = async (): Promise<number> => {
  const buffer: string = await readInput("day13.txt");
  console.log("Delete me once you've started to work on the problem!");
  return -1;
};

export default {
  // TODO
  part1: () => implementPartOne(),
  // TODO
  // part2: () => implementPartTwo(),
} as DayAnswer;
