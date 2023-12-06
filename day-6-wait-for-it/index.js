const { open } = require("node:fs/promises");

(async () => {
    const file = await open("./data.txt");
    const data = [];

    for await (const line of file.readLines()) {
        data.push(line);
    }
    const times = data[0]
        .split(":")[1]
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map(num => parseInt(num));
    const distances = data[1]
        .split(":")[1]
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map(num => parseInt(num));

    let answer;
    times.forEach((time, index) => {
        let waysToWin = 0;

        for (let i = 1; i <= time; i++) {
            const ms = time - i;
            const distance = i * ms;
            if (distance > distances[index]) waysToWin++;
        }

        if (answer) {
            answer *= waysToWin;
        } else {
            answer = waysToWin;
        }
    });

    console.log(answer);
})();
