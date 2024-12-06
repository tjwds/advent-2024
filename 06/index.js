const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const getTotalPositionsVisited = (map, startPosition) => {
  const positionsVisited = new Set();
  positionsVisited.add(startPosition);

  const positionsVisitedWithDirection = new Set();

  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  let currentDirection = 0;
  let location = startPosition.split(",").map(Number);

  while (true) {
    const realDirection = currentDirection % 4;
    const nextDirectionType = directions[realDirection];
    const nextLocation = [
      location[0] + nextDirectionType[0],
      location[1] + nextDirectionType[1],
    ];
    const nextPosition = `${nextLocation[0]},${nextLocation[1]}`;

    const nextChar = map[nextPosition];
    if (nextChar === "#") {
      currentDirection += 1;
      continue;
    }

    // we're off the map!
    if (!nextChar) {
      break;
    }

    location = nextLocation;
    positionsVisited.add(nextPosition);

    if (positionsVisitedWithDirection.has(`${nextPosition},${realDirection}`)) {
      return Infinity;
    }
    console.log(`${nextPosition},${realDirection}`);
    positionsVisitedWithDirection.add(`${nextPosition},${realDirection}`);
  }

  return positionsVisited;
};

const solve = () => {
  const map = {};
  let startPosition;

  input.split("\n").forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === "^") {
        location = [x, y];
        map[`${x},${y}`] = ".";
        startPosition = `${x},${y}`;
        return;
      }
      map[`${x},${y}`] = char;
    });
  });

  const positionsVisited = getTotalPositionsVisited(map, startPosition);

  const partOne = positionsVisited.size;

  let successfulObstructions = 0;
  // hi michael
  for (let visitedPosition of positionsVisited) {
    console.log(`Trying ${visitedPosition}`);
    if (
      getTotalPositionsVisited(
        { ...map, [visitedPosition]: "#" },
        startPosition
      ) === Infinity
    ) {
      successfulObstructions += 1;
    }
  }

  // HACK: one of these is the starting position
  return { partOne, partTwo: successfulObstructions - 1 };
};

console.log(solve());
