const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const solve = (numBlinks) => {
  const stones = input.split(" ").map(Number);

  const stoneToNext = {};

  const addNexts = (stone) => {
    const stoneDigits = String(stone);

    if (stone === 0) {
      stoneToNext[stone] = [1];
    } else if (!(stoneDigits.length % 2)) {
      stoneToNext[stone] = [
        Number(stoneDigits.slice(0, stoneDigits.length / 2)),
        Number(stoneDigits.slice(stoneDigits.length / 2)),
      ];
    } else {
      stoneToNext[stone] = [stone * 2024];
    }

    return stoneToNext[stone];
  };

  let stoneToNumber = {};
  for (let stone of stones) {
    if (!stoneToNumber[stone]) {
      stoneToNumber[stone] = 0;
    }
    stoneToNumber[stone] = 1;
  }

  for (let i = 0; i < numBlinks; i++) {
    const newStoneToNumber = {};
    for (const [stone, number] of Object.entries(stoneToNumber)) {
      let nexts = stoneToNext[stone];
      if (!nexts) {
        nexts = addNexts(Number(stone));
      }
      for (const next of nexts) {
        if (!newStoneToNumber[next]) {
          newStoneToNumber[next] = 0;
        }
        newStoneToNumber[next] = newStoneToNumber[next] + number;
      }
    }

    stoneToNumber = newStoneToNumber;
  }

  return Object.values(stoneToNumber).reduce(
    (previous, next) => previous + next
  );
};

console.log({ partOne: solve(25), partTwo: solve(75) });
