const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input3.txt")).toString();

const partOne = () => {
  const results = input.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g);
  let value = 0;

  results.forEach(([, a, b]) => (value += a * b));

  return value;
};

const partTwo = () => {
  const results = input.matchAll(
    /(?:do\(\)|don't\(\)|mul\(([0-9]{1,3}),([0-9]{1,3})\))/g
  );
  let value = 0;
  let enabled = true;

  results.forEach(([instruction, a, b]) => {
    if (instruction === "don't()") {
      enabled = false
    } else if (instruction === "do()") {
      enabled = true
    } else if (enabled) {
      value += a * b;
    }
  });

  return value;
};

console.log(partOne(), partTwo());
