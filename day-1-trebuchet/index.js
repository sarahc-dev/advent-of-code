const data = require("./data");

// Part 1
let answer1 = 0;
data.forEach(line => {
    const digitsOnly = line.replace(/\D/g, "");
    const firstDigit = digitsOnly.charAt(0);
    const lastDigit = digitsOnly.charAt(digitsOnly.length - 1);
    const calibrationVal = `${firstDigit}${lastDigit}`;
    answer1 += parseInt(calibrationVal);
});
console.log(answer1); // 54597

// Part 2
const example = ["two1nine", "eightwothree", "abcone2threexyz", "xtwone3four", "4nineeightseven2", "zoneight234", "7pqrstsixteen"];

const values = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
};

let answer2 = 0;
data.forEach(line => {
    let firstDigit = null;
    let x = 0;
    while (!firstDigit) {
        if (line[x].match(/\d/g)) {
            firstDigit = line[x];
            break;
        }

        for (let val in values) {
            if (line.slice(0, x + 1).includes(val)) {
                firstDigit = values[val];
                break;
            }
        }
        x++;
    }
    //console.log(firstDigit);

    let lastDigit = null;
    let y = line.length - 1;
    while (!lastDigit) {
        if (line[y].match(/\d/g)) {
            lastDigit = line[y];
            break;
        }

        for (let val in values) {
            if (line.slice(y).includes(val)) {
                lastDigit = values[val];
                break;
            }
        }
        y--;
    }
    // console.log(lastDigit);
    const calibrationVal = `${firstDigit}${lastDigit}`;
    answer2 += parseInt(calibrationVal);
});

console.log(answer2); // 54504
