const { open } = require("node:fs/promises");
const image = [];

(async () => {
    const file = await open("./data.txt");

    const rowsWithNoGalaxy = [];
    let i = 0;
    for await (const line of file.readLines()) {
        image.push(line.split(""));

        if (!line.includes("#")) {
            rowsWithNoGalaxy.push(i);
        }
        i++;
    }

    const colWithNoGalaxy = [];
    image[0].forEach((_, index) => {
        let noGalaxy = true;
        for (let i = 0; i < image.length; i++) {
            if (image[i][index] === "#") noGalaxy = false;
        }
        if (noGalaxy) colWithNoGalaxy.push(index);
    });

    // get list of galaxies
    const galaxies = [];
    image.forEach((row, rIndex) => {
        row.forEach((col, cIndex) => {
            if (col === "#") galaxies.push([rIndex, cIndex]);
        });
    });

    // generate pairs
    function genPair(inp) {
        const result = [];
        for (let i = 0; i < inp.length; i++) {
            for (let j = i; j < inp.length; j++) {
                if (inp[i] !== inp[j]) {
                    result.push([inp[i], inp[j]]);
                }
            }
        }
        return result;
    }

    const pairs = genPair(galaxies);

    // Need to add a million rows and cols for each row/col with no galaxy

    const distances = [];
    pairs.forEach(pair => {
        let result = 0;
        result += Math.abs(pair[1][0] - pair[0][0]);
        result += Math.abs(pair[1][1] - pair[0][1]);

        colWithNoGalaxy.forEach(col => {
            // if the col is between the pair
            if ((col > pair[0][1] && col < pair[1][1]) || (col > pair[1][1] && col < pair[0][1])) {
                result += 999999;
                // for part 1 - result += 1;
            }
        });

        rowsWithNoGalaxy.forEach(row => {
            if (row > pair[0][0] && row < pair[1][0]) {
                result += 999999;
                // for part 1 - result += 1;
            }
        });
        distances.push(result);
    });

    // add up all distances
    const sum = distances.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(sum);
})();
