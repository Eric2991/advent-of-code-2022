import type { DayAnswer } from "../types";
import { readInput } from "../utils/readInput";

///////////////////////////////////////////////
// Types
///////////////////////////////////////////////

type File = {
  /** Name of the file */
  name: string;
  /** Size of the file */
  size: number;
};

/** Mapping between names of directories to their respective Directory object */
type DirectoryMapping = { [directoryName: string]: Directory };

type Directory = {
  /** List of files present in the directory */
  files: File[];
  /** Directories nested under the current directory */
  directories: DirectoryMapping;
  /** Optional link to the parent directory, if a parent exists */
  parent?: Directory;
};

///////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////

/**
 * Computes the sum of file sizes given a list of files
 * @param {File[]} files List of files to compute
 * @returns {number}
 */
const getSumOfFiles = (files: File[]): number => {
  let result = 0;
  for (const { size } of files) {
    result += size;
  }
  return result;
};

const buildFileSystem = (data: string): DirectoryMapping => {
  const lines = data.split("\n");
  const result: DirectoryMapping = { "/": { files: [], directories: {} } };

  let currentDirectory: Directory = result["/"];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line[0] === "$") {
      // Parse commands
      const [, command, args] = line.match(/\$ ([a-zA-Z0-9]+)\s*(\S*)?/);
      switch (command) {
        case "cd": {
          switch (args) {
            case "/": {
              currentDirectory = result["/"];
              break;
            }
            case "..": {
              currentDirectory = currentDirectory.parent;
              break;
            }
            default: {
              currentDirectory = currentDirectory.directories[args];
              break;
            }
          }
        }
        case "ls": {
          // Parse through all files and directories present in the list command
          // until we come to the end of the buffer or another command
          while (
            lines[i + 1] != null &&
            lines[i + 1][0] !== "$" &&
            i < lines.length
          ) {
            const listFileLine = lines[++i];
            const [firstArg, secondArg] = listFileLine.split(" ");

            if (firstArg === "dir") {
              // Create the directory object if one does not already exist with the given name in the current directory
              if (currentDirectory.directories[secondArg] == null) {
                currentDirectory.directories[secondArg] = {
                  files: [],
                  directories: {},
                  parent: currentDirectory,
                };
              }
            } else {
              // Listing a file and its size
              currentDirectory.files.push({ name: secondArg, size: +firstArg });
            }
          }
          break;
        }
        default:
          break;
      }
    }
  }

  return result;
};

/**
 * Gets the size of the file system. Can optionally restrict directories from being included in the sum given a numeric size limit
 * @param {DirectoryMapping} fileSystem File system to compute
 * @param {number} [maxDirectorySize] Optional numeric limit on the size of directories we want to include as part of the sum
 * @returns {number}
 */
const getFileSystemSize = (
  fileSystem: DirectoryMapping,
  maxDirectorySize?: number
): number => {
  let totalSize = 0;
  const traverse = (
    fileSystem: DirectoryMapping,
    maxDirectorySize?: number
  ): number => {
    let result = 0;
    const directories: Directory[] = Object.values(fileSystem);
    for (const directory of directories) {
      const sumOfFiles = getSumOfFiles(directory.files);
      const sumOfChildDirectories = traverse(
        directory.directories,
        maxDirectorySize
      );
      const total = sumOfFiles + sumOfChildDirectories;

      if (maxDirectorySize != null && total <= maxDirectorySize) {
        totalSize += total;
      } else if (maxDirectorySize == null) {
        totalSize += sumOfFiles;
      }

      result += total;
    }

    return result;
  };

  traverse(fileSystem, maxDirectorySize);
  return totalSize;
};

/**
 * Gets the size of the smallest directory to delete to provide enough space required to run a system update
 * @param fileSystem File system to compute
 * @param totalAvailableSpace Total available space for a given hard drive
 * @param minimumSpaceRequired Minimum space required to run a system update
 * @returns {number}
 */
const getSizeOfDirectoryToDelete = (
  fileSystem: DirectoryMapping,
  totalAvailableSpace: number,
  minimumSpaceRequired: number
): number => {
  const usedSpace = getFileSystemSize(fileSystem);
  let minimumSize = totalAvailableSpace;
  const traverse = (
    fileSystem: DirectoryMapping,
    totalAvailableSpace: number,
    minimumSpaceRequired: number
  ): number => {
    let result = 0;
    const directories: Directory[] = Object.values(fileSystem);
    for (const directory of directories) {
      const sumOfFiles = getSumOfFiles(directory.files);
      const sumOfChildDirectories = traverse(
        directory.directories,
        totalAvailableSpace,
        minimumSpaceRequired
      );
      const total = sumOfFiles + sumOfChildDirectories;

      if (
        totalAvailableSpace - usedSpace + total >= minimumSpaceRequired &&
        total < minimumSize
      ) {
        minimumSize = total;
      }

      result += total;
    }

    return result;
  };

  traverse(fileSystem, totalAvailableSpace, minimumSpaceRequired);
  return minimumSize;
};

///////////////////////////////////////////////
// Main functions
///////////////////////////////////////////////

const getSumOfDirectoriesWithMaxSize = async (): Promise<number> => {
  const data: string = await readInput("day7.txt");
  const fileSystem: DirectoryMapping = buildFileSystem(data);
  // Cap the directories included in the sum to a size of 100000
  return getFileSystemSize(fileSystem, 100000);
};

const getSizeOfDirectoryToDeleteForUpdate = async (): Promise<number> => {
  const data: string = await readInput("day7.txt");
  const fileSystem: DirectoryMapping = buildFileSystem(data);
  // Set the available space on the hard drive at 70000000 and
  // the minimum space required to run the system update at 30000000
  return getSizeOfDirectoryToDelete(fileSystem, 70000000, 30000000);
};

export default {
  // Get the sum of the directory sizes whose total size is at most 100000
  part1: () => getSumOfDirectoriesWithMaxSize(),
  // Get the total size of the smallest directory that can be deleted to free up enough space to run the system update
  part2: () => getSizeOfDirectoryToDeleteForUpdate(),
} as DayAnswer;
