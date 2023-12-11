const { open } = require("node:fs/promises");
const image = [];

(async () => {
    const file = await open("./data.txt");

    for await (const line of file.readLines()) {
        image.push(line.split(""));
        // Expand rows
        if (!line.includes("#")) {
            image.push(line.split(""));
        }
    }

    // Expand columns
    const colWithNoGalaxy = [];
    image[0].forEach((_, index) => {
        let noGalaxy = true;
        for (let i = 0; i < image.length; i++) {
            if (image[i][index] === "#") noGalaxy = false;
        }
        if (noGalaxy) colWithNoGalaxy.push(index);
    });
    // insert columns
    colWithNoGalaxy.reverse();
    image.forEach(row => {
        colWithNoGalaxy.forEach(col => {
            row.splice(col, 0, ".");
        });
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

    // calculate distances for each pair
    const distances = [];
    pairs.forEach(pair => {
        const distance = Math.abs(pair[1][0] - pair[0][0]) + Math.abs(pair[1][1] - pair[0][1]);
        distances.push(distance);
    });

    // add up all distances
    const sum = distances.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(sum);
})();
