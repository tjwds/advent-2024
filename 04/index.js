const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const letters = "XMAS";

const testForXmas = (dict, letterKey, directionX, x, directionY, y) => {
  const letter = letters[letterKey];

  if (!letter) {
    return true;
  }

  if (dict[`${x + directionX},${y + directionY}`] !== letter) {
    return false;
  }

  return testForXmas(
    dict,
    letterKey + 1,
    directionX,
    x + directionX,
    directionY,
    y + directionY
  );
};

/*
M.S
.A.
M.S
*/
const crossmassDirections = [
  (dict, x, y) => dict[`${x - 1},${y - 1}`],
  (dict, x, y) => dict[`${x - 1},${y + 1}`],
  (dict, x, y) => dict[`${x + 1},${y - 1}`],
  (dict, x, y) => dict[`${x + 1},${y + 1}`],
];

const testForCrossmass = (dict, x, y) => {
  const items = crossmassDirections.map((entry) => entry(dict, x, y));
  const letters = { M: 0, S: 0 };
  for (let i = 0; i < items.length; i++) {
    const letter = items[i];

    letters[letter] = letters[letter] + 1;
  }

  if (letters.M !== 2 || letters.S !== 2) {
    return false;
  }

  // check to make sure they're not across from each other
  if (items[0] !== items[1] && items[0] !== items[2]) {
    return false;
  }

  return true;
};

const solve = () => {
  let partOneTotal = 0;
  let partTwoTotal = 0;

  const dict = {};

  input.split("\n").forEach((line, y) =>
    line.split("").forEach((char, x) => {
      dict[`${x},${y}`] = char;
    })
  );

  Object.entries(dict).forEach(([key, value]) => {
    const [x, y] = key.split(",").map(Number);

    if (value === "X") {
      for (let i = 0; i < directions.length; i++) {
        const [directionX, directionY] = directions[i];

        if (testForXmas(dict, 1, directionX, x, directionY, y)) {
          partOneTotal += 1;
        }
      }
    } else if (value === "A") {
      if (testForCrossmass(dict, x, y)) {
        partTwoTotal += 1;
      }
    }
  });

  return { partOneTotal, partTwoTotal };
};

console.log(solve());
