const { open } = require("node:fs/promises");

const asciiPrintableChars = {};

for (let i = 32; i <= 126; i++) {
    asciiPrintableChars[String.fromCharCode(i)] = i;
}

function HASHAlgorithm(str, currentValue) {
    const ASCIICode = asciiPrintableChars[str];
    return ((currentValue + ASCIICode) * 17) % 256;
}

(async () => {
    const file = await open("./data.txt");

    let sequence;

    for await (const line of file.readLines()) {
        sequence = line.split(",");
    }

    let sum = 0;
    sequence.forEach(step => {
        let currentValue = 0;
        step.split("").forEach(value => {
            currentValue = HASHAlgorithm(value, currentValue);
        });
        sum += currentValue;
    });
    // answer 1
    // console.log(sum);

    const boxes = {};
    // 0: [["rn", 1], ["cm", 2]]

    sequence.forEach(step => {
        let currentValue = 0;
        const stepArr = step.split("");
        for (let i = 0; i < stepArr.length; i++) {
            if (stepArr[i] !== "=" && stepArr[i] !== "-") {
                currentValue = HASHAlgorithm(stepArr[i], currentValue);
            } else if (stepArr[i] === "=") {
                // if box exists
                if (boxes[currentValue]) {
                    const isSameLabel = label => label[0] === stepArr.slice(0, i).join("");
                    const indexOfSameLabel = boxes[currentValue].findIndex(isSameLabel);
                    // if lens with same label
                    if (indexOfSameLabel !== -1) {
                        // replace with new lens in the same position
                        boxes[currentValue].splice(indexOfSameLabel, 1, [stepArr.slice(0, i).join(""), stepArr.slice(i + 1).join("")]);
                        break;
                    }
                    // no lens with same label
                    else {
                        boxes[currentValue].push([stepArr.slice(0, i).join(""), stepArr.slice(i + 1).join("")]);
                        break;
                    }
                }
                // if box doesn't exist
                else {
                    boxes[currentValue] = [[stepArr.slice(0, i).join(""), stepArr.slice(i + 1).join("")]];
                    break;
                }
            } else if (stepArr[i] === "-") {
                // go to relevant box and remove lens with given label if exists
                // move remaining lenses forward
                if (boxes[currentValue]) {
                    boxes[currentValue] = boxes[currentValue].filter(lens => lens[0] !== stepArr.slice(0, i).join(""));
                    break;
                }
            }
        }
    });
    // console.log(boxes);

    // add up focusing power
    let answer = 0;
    for (const box in boxes) {
        if (boxes[box].length > 0) {
            boxes[box].forEach((lens, index) => {
                answer += (parseInt(box) + 1) * (index + 1) * parseInt(lens[1]);
            });
        }
    }
    // answer 2
    console.log(answer);
})();
