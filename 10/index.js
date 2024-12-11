const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const positionRegistry = {};
const nines = new Set();
const zeroes = new Set();

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

class Position {
  constructor(height, x, y) {
    this.height = height;
    this.x = x;
    this.y = y;

    this.ninesThatCanReachThisSpot = new Set();
    this.waysToGetHere = new Set();

    positionRegistry[`${x},${y}`] = this;

    if (height === 9) {
      nines.add(this);
      this.ninesThatCanReachThisSpot.add(this);
    }
    if (height === 0) {
      zeroes.add(this);
    }
  }

  getAdjacentValuesThatAreValidDecents() {
    if (this.height === 0) {
      return [];
    }

    const results = [];
    for (const [goX, goY] of directions) {
      const adjacent = positionRegistry[`${this.x + goX},${this.y + goY}`];
      if (!adjacent) {
        continue;
      }

      if (this.height - adjacent.height !== 1) {
        continue;
      }

      adjacent.ninesThatCanReachThisSpot =
        adjacent.ninesThatCanReachThisSpot.union(
          this.ninesThatCanReachThisSpot
        );

      adjacent.waysToGetHere.add(this);

      results.push(adjacent);
    }

    return results;
  }
}

const solve = () => {
  input.split("\n").forEach((line, y) => {
    line.split("").forEach((char, x) => {
      new Position(Number(char), x, y);
    });
  });

  for (let checkNine of [...nines]) {
    const toCheck = [checkNine];
    let check = toCheck.shift();
    const seenThisTime = new Set([check]);
    while (check) {
      check
        .getAdjacentValuesThatAreValidDecents()
        .filter((item) => !seenThisTime.has(item))
        .forEach((candidate) => {
          seenThisTime.add(candidate);
          toCheck.push(candidate);
        });

      check = toCheck.shift();
    }
  }

  let partTwo = 0;

  [...zeroes].forEach((zero) => {
    const toCheck = [...zero.waysToGetHere];
    if (!toCheck.length) {
      return;
    }

    let total = toCheck.length;
    let check = toCheck.shift();
    while (check) {
      const adjacents = check.waysToGetHere;
      if (adjacents.size) {
        total += adjacents.size - 1;
        toCheck.push(...adjacents);
      }

      check = toCheck.shift();
    }

    partTwo += total;
  });

  return {
    partOne: [...zeroes].reduce(
      (previous, next) => previous + next.ninesThatCanReachThisSpot.size,
      0
    ),
    partTwo,
  };
};

console.log(solve());
