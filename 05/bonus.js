const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "/input.txt")).toString();

const solve = () => {
  let total = 0;
  let partTwo = 0;

  const [ruleText, printText] = input.split("\n\n");

  const rules = {};
  ruleText.split("\n").forEach((itemText) => {
    const [before, after] = itemText.split("|").map(Number);

    if (!rules[before]) {
      rules[before] = [];
    }

    rules[before].push(after);
  });

  const incorrectlyOrdered = [];
  const lines = printText.split("\n");
  line: for (let i = 0; i < lines.length; i++) {
    const items = lines[i].split(",").map(Number);

    if (!(items.length % 2)) {
      throw new Error("Length of items is even");
    }

    const seenItems = new Set();

    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      seenItems.add(item);
      const rule = rules[item] || [];

      for (let k = 0; k < rule.length; k++) {
        const check = rule[k];
        if (seenItems.has(check)) {
          incorrectlyOrdered.push(items);
          continue line;
        }
      }
    }

    total += items[(items.length - 1) / 2];
  }

  for (let i = 0; i < incorrectlyOrdered.length; i++) {
    const toFix = incorrectlyOrdered[i];
    toFix.sort((a, b) => {
      if ((rules[a] || []).includes(b)) {
        return -1;
      }
      if ((rules[b] || []).includes(a)) {
        return 1;
      }
      return 0;
    });

    partTwo += toFix[(toFix.length - 1) / 2];
  }

  return { partOne: total, partTwo };
};

console.log(solve());
