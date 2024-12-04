const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const logLevel = 2;
const tolerance = 1;

const arrayWithoutPosition = (array, n) => {
  const newArray = [...array];
  newArray.splice(n, 1);

  return newArray;
};

const tryLine = (items, tolerated) => {
  let direction = 0;
  console.log("❓", items.join(" "));

  for (let j = 0; j < items.length - 1; j++) {
    const first = items[j];
    const second = items[j + 1];
    if (logLevel === 1) {
      console.log(`line ${i} checking ${first} ${second}`, {
        items,
        j,
        tolerated,
      });
    }
    // bad hack, but if we have an item we've tolerated, we'll have to bounce here:
    if (typeof second === "undefined") {
      if (logLevel === 1) {
        console.log("???");
      }
      continue;
    }

    const sign = Math.sign(first - second);
    if (sign === 0) {
      if (logLevel === 1) {
        console.log(`${i} is unstable: ${items[j]} ${items[j + 1]} are equal`);
      }
      if (tolerated === tolerance) {
        if (logLevel === 2) {
          console.log(`❌ ${items} (1)`);
        }
        return false;
      }
      return (
        tryLine(arrayWithoutPosition(items, j - 1), 1) ||
        tryLine(arrayWithoutPosition(items, j), 1) ||
        tryLine(arrayWithoutPosition(items, j + 1), 1)
      );
    }
    if (direction === 0) {
      direction = sign;
    } else {
      if (sign !== direction) {
        if (logLevel === 1) {
          console.log(
            `${i} is unstable: ${items[j]} ${
              items[j + 1]
            } reverses the direction`
          );
        }
        if (tolerated === tolerance) {
          if (logLevel === 2) {
            console.log(`❌ ${items} (2)`);
          }
          return false;
        }
        return (
          tryLine(arrayWithoutPosition(items, j - 1), 1) ||
          tryLine(arrayWithoutPosition(items, j), 1) ||
          tryLine(arrayWithoutPosition(items, j + 1), 1)
        );
      }
    }
    if (Math.abs(items[j] - items[j + 1]) > 3) {
      if (logLevel === 1) {
        console.log(`${i} is unstable: ${items[j]} ${items[j + 1]}`);
      }
      if (tolerated === tolerance) {
        if (logLevel === 2) {
          console.log(`❌ ${items} (3)`);
        }
        return false;
      }
      return (
        tryLine(arrayWithoutPosition(items, j - 1), 1) ||
        tryLine(arrayWithoutPosition(items, j), 1) ||
        tryLine(arrayWithoutPosition(items, j + 1), 1)
      );
    }
  }

  return true;
};

const solve = (tolerance) => {
  let safe = 0;

  lines: for (let i = 0; i < input.length; i++) {
    let items = input[i].split(" ").map(Number);
    if (logLevel === 2) {
      console.log(input[i]);
    }

    const success = tryLine(items, 0);

    if (success) {
      safe += 1;
      if (logLevel === 2) {
        console.log(`✅ ${input[i]}`);
      }
      if (logLevel === 1) {
        console.log(`${i} is counted, total now ${safe}`);
      }
    }
  }

  return safe;
};

// 414 is too low
console.log(solve(1));
