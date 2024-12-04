const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.join(__dirname, "/input.txt"))
  .toString()
  .split("\n");

const partOne = () => {
  listOne = [];
  listTwo = [];
  input.forEach((line) => {
    const [a, b] = line.split("   ");
    listOne.push(Number(a));
    listTwo.push(Number(b));
  });

  listOne.sort((a, b) => a - b);
  listTwo.sort((a, b) => a - b);

  let total = 0;
  for (let i = 0; i < listOne.length; i++) {
    total += Math.abs(listOne[i] - listTwo[i]);
  }

  return total;
};

const partTwo = () => {
  listOne = [];
  listTwo = {};
  input.forEach((line) => {
    const [a, b] = line.split("   ");
    listOne.push(Number(a));

    const second = Number(b);
    if (!listTwo[second]) {
      listTwo[second] = 0;
    }
    listTwo[second] = listTwo[second] + 1;
  });

  listOne.sort((a, b) => a - b);

  let total = 0;
  for (let i = 0; i < listOne.length; i++) {
    total += listOne[i] * (listTwo[listOne[i]] || 0);
  }

  return total;
};

console.log(partTwo());
