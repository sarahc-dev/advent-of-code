const { open } = require("node:fs/promises");

(async () => {
    const file = await open("./data.txt");
    const data = [];

    for await (const line of file.readLines()) {
        data.push(line);
    }

    let seeds;
    const formatData = {};

    let name;
    let store = [];

    data.forEach((line, index) => {
        if (index === 0) {
            const split = line.split(": ");
            seeds = split[1].split(" ");
        } else {
            if (line === "") {
                if (name) formatData[name] = store;
                name = "";
                store = [];
            }
            // if first char is not a digit
            else if (/^\D/.test(line)) {
                name = line.slice(0, -1);
            } else {
                store.push(line.split(" "));
            }
        }
    });
    formatData[name] = store;

    // CONVERT TO NUM
    seeds = seeds.map(seed => parseInt(seed));
    for (const property in formatData) {
        formatData[property] = formatData[property].map(arr => {
            return arr.map(a => parseInt(a));
        });
    }

    function getLocation(seed) {
        let result = seed;

        for (const property in formatData) {
            const map = formatData[property];

            for (let i = 0; i < map.length; i++) {
                let lowerRange = map[i][1];
                let higherRange = map[i][1] + map[i][2];
                let isBetweenRange = result >= lowerRange && result <= higherRange;

                if (isBetweenRange) {
                    const difference = map[i][0] - map[i][1];
                    result += difference;
                    break;
                }
            }
        }

        return result;
    }

    let min = Infinity;

    let start;
    seeds.forEach((seed, index) => {
        if (index % 2 === 0) {
            start = seed;
        } else {
            for (let i = start; i < start + seed; i++) {
                const result = getLocation(i);
                if (result < min) min = result;
            }
        }
    });
    console.log(min);
})();
