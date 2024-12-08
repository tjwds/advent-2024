const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();
const lines = input.split("\n");

const yLen = lines.length;
const xLen = lines[0].split("").length;

// I cheated and looked these up!
function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function reduceFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

const solve = () => {
  const antennae = {};

  lines.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char === ".") {
        return;
      }

      if (!antennae[char]) {
        antennae[char] = [];
      }

      antennae[char].push(`${x},${y}`);
    });
  });

  const uniqueAntinodes = new Set();
  const resonantFrequencies = new Set();

  const isValidLocation = (x, y) => {
    if (x < 0 || y < 0) {
      return false;
    }

    if (x >= xLen || y >= yLen) {
      return false;
    }

    return true;
  };

  Object.values(antennae).forEach((coords) => {
    if (coords.length < 2) {
      return;
    }

    for (let i = 0; i < coords.length - 1; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [startX, startY] = coords[i].split(",").map(Number);
        const [endX, endY] = coords[j].split(",").map(Number);

        const distX = endX - startX;
        const distY = endY - startY;

        const throughX = endX + distX;
        const backX = startX - distX;

        const throughY = endY + distY;
        const backY = startY - distY;

        if (isValidLocation(throughX, throughY)) {
          uniqueAntinodes.add(`${throughX},${throughY}`);
        }
        if (isValidLocation(backX, backY)) {
          uniqueAntinodes.add(`${backX},${backY}`);
        }

        let [leastDistX, leastDistY] = reduceFraction(distX, distY);

        let testX = startX;
        let testY = startY;

        while (true) {
          if (!isValidLocation(testX, testY)) {
            break;
          }

          resonantFrequencies.add(`${testX},${testY}`);

          testX += leastDistX;
          testY += leastDistY;
        }

        // now let's go the other way

        leastDistX *= -1;
        leastDistY *= -1;

        testX = startX;
        testY = startY;

        while (true) {
          if (!isValidLocation(testX, testY)) {
            break;
          }

          resonantFrequencies.add(`${testX},${testY}`);

          testX += leastDistX;
          testY += leastDistY;
        }
      }
    }
  });

  return { partOne: uniqueAntinodes.size, partTwo: resonantFrequencies.size };
};

console.log(solve());
