const { open } = require("node:fs/promises");

function createSequenceOfDiff(arr) {
    const sequence = [];
    for (let i = 1; i < arr.length; i++) {
        sequence.push(arr[i] - arr[i - 1]);
    }
    return sequence;
}

function getNextNum(seq) {
    if (seq.every(num => num === 0)) {
        return 0;
    }
    return seq[seq.length - 1] + getNextNum(createSequenceOfDiff(seq));
}

function getPrevNum(seq) {
    if (seq.every(num => num === 0)) {
        return 0;
    }
    return seq[0] - getPrevNum(createSequenceOfDiff(seq));
}

(async () => {
    const file = await open("./data.txt");
    const data = [];

    for await (const line of file.readLines()) {
        data.push(line.split(" ").map(num => parseInt(num)));
    }

    // Part 1
    let answer = 0;
    data.forEach(line => {
        const value = getNextNum(line);
        answer += value;
    });
    console.log(answer);

    // Part 2
    let answer2 = 0;
    data.forEach(line => {
        const value = getPrevNum(line);
        answer2 += value;
    });
    console.log(answer2);
})();
