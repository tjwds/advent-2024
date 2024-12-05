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
      const rule = rules[item];
      seenItems.add(item);
      if (!rule) {
        continue;
      }

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
    const originalLength = toFix.length;
    const good = [];
    // for item in toFix;
    rowLevel: for (let j = 0; j < originalLength; j++) {
      // check to see if this one can't come after the ones that came before it
      const check = toFix.shift();
      const rule = rules[check] || [];
      for (let k = 0; k < good.length; k++) {
        const candidate = good[k];
        if (rule.includes(candidate)) {
          // if it can't, put the one before it back into the pool _at the front_
          const bad = good.pop();
          toFix.unshift(bad);
          toFix.unshift(check);

          // ...and check again
          j -= 2; // bluh
          continue rowLevel;
        }
      }
      // okay, all good
      good.push(check);
    }
    // if we somehow made it here, we've made a good entry!
    partTwo += good[(good.length - 1) / 2];
  }

  return { partOne: total, partTwo };
};

console.log(solve());
