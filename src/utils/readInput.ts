import { createReadStream } from "fs";
import { resolve } from 'path';

/**
 * Reads in a UTF-8 encoded file via a stream and returns a Promise
 * that resolves with the stream's contents once the stream is closed
 * @param fileName Name of the input text file that should be read from the static/ directory
 * @returns {Promise<string>}
 */
export function readInput(fileName: string): Promise<string> {
  return new Promise((resolvePromise) => {
    let result: string = '';
    const stream = createReadStream(resolve('static', fileName), { encoding: "utf8" });
    stream.on("data", (data) => {
      result += data;
      stream.destroy();
    });
    stream.on("close", () => {
      resolvePromise(result);
    });
  });
}
