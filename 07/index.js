const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

// I really feel like I'm going to regret the naïve approach in part two, but we'll see.

const matchList = (list, total, useConcat) => {
  if (list.length === 1) {
    if (list[0] === total) {
      return true;
    }
    return false;
  }

  // could do a cool mapping function, but I don't wanna
  const newListAdd = [list[0] + list[1], ...list.slice(2)];
  if (newListAdd[0] <= total) {
    if (matchList(newListAdd, total, useConcat)) {
      return true;
    }
  }

  const newListMultiply = [list[0] * list[1], ...list.slice(2)];
  if (newListMultiply[0] <= total) {
    if (matchList(newListMultiply, total, useConcat)) {
      return true;
    }
  }

  if (useConcat) {
    const newListConcat = [Number(`${list[0]}${list[1]}`), ...list.slice(2)];
    if (newListConcat[0] <= total) {
      if (matchList(newListConcat, total, useConcat)) {
        return true;
      }
    }
  }

  return false;
};

const solve = () => {
  let partOne = 0;
  let partTwo = 0;

  const lines = input.split("\n");

  for (let line of lines) {
    let [total, entriesString] = line.split(": ");
    total = Number(total);
    const entries = entriesString.split(" ").map(Number);

    if (matchList(entries, total)) {
      partOne += total;
    }

    if (matchList(entries, total, true)) {
      partTwo += total;
    }
  }

  return { partOne, partTwo };
};

console.log(solve());
