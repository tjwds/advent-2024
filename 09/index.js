const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();
const chars = input.split("");

const solve = () => {
  const spaces = [];

  let workingIndex = 0;
  let workingFileId = 0;
  const indexToEmptySpace = {};
  const fileIdToLength = {};
  const fileIdToIndex = {};

  for (let i = 0; i < chars.length; i++) {
    const num = Number(chars[i]);
    if (!(i % 2)) {
      // ugh, Array.splice doesn't really support arrays with holes
      for (let j = 0; j < num; j++) {
        spaces[workingIndex + j] = workingFileId;
      }
      fileIdToLength[workingFileId] = num;
      fileIdToIndex[workingFileId] = workingIndex;
      workingFileId += 1;
    } else {
      indexToEmptySpace[workingIndex] = num;
    }
    workingIndex += num;
  }

  for (let i = 0; i < spaces.length; i++) {
    if (typeof spaces[i] === "undefined") {
      let candidate = spaces.pop();
      while (typeof candidate === "undefined") {
        candidate = spaces.pop();
      }
      spaces[i] = candidate;
    }
  }

  // for each file id in decreasing order,
  fileIdLoop: for (let i = workingFileId; i >= 0; i--) {
    const fileLength = fileIdToLength[i];
    const currentLocation = fileIdToIndex[i];
    // find the first place, left to right, where this fits
    for (let j = 0; j < currentLocation; j++) {
      const emptySpace = indexToEmptySpace[j];
      if (!emptySpace || emptySpace < fileLength) {
        continue;
      }

      // set its index in fileIdToIndex to there instead
      fileIdToIndex[i] = j;
      // make sure indexToEmptySpace is now right as well
      indexToEmptySpace[j + fileLength] = indexToEmptySpace[j] - fileLength;
      indexToEmptySpace[j] = 0;

      continue fileIdLoop;
    }
  }

  return {
    partOne: spaces.reduce(
      (previous, current, index) => previous + current * index,
      0
    ),
    // recompose the array from what we know (fileIdToLength, fileIdToIndex)
    partTwo: Object.entries(fileIdToIndex).reduce(
      (previous, [fileId, fileIdIndex]) => {
        let next = previous;
        let fileNumber = Number(fileId);

        // again, could figure this out with real math, but I'm too lazy
        for (
          let i = fileIdIndex;
          i < fileIdToLength[fileId] + fileIdIndex;
          i++
        ) {
          next += fileNumber * i;
        }

        return next;
      },
      0
    ),
  };
};

console.log(solve());
