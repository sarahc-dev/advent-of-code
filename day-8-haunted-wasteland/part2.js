const { open } = require("node:fs/promises");

(async () => {
    const file = await open("./data.txt");
    let directions;
    const map = new Map();

    let index = 0;
    for await (const line of file.readLines()) {
        if (index === 0) {
            directions = line.split("");
        } else if (index > 1) {
            const splitArr = line.split(" = ");
            const transform = splitArr[1].replace(/[()]/g, "").split(", ");
            map.set(splitArr[0], [transform[0], transform[1]]);
        }
        index++;
    }

    const startingKeys = Array.from(map.keys()).filter(key => key[2] === "A");

    function calculateSteps(position) {
        let stepCount = 0;
        let foundZ = false;

        let i = 0;
        while (!foundZ) {
            const direction = directions[i] === "L" ? 0 : 1;
            const result = map.get(position);

            if (result[direction][2] === "Z") {
                stepCount++;
                foundZ = true;
            } else {
                stepCount++;
                position = result[direction];
            }

            // if get to end of array go back to zero
            i = i === directions.length - 1 ? 0 : (i += 1);
        }

        return stepCount;
    }

    const stepsForEachKey = startingKeys.map(key => calculateSteps(key));

    // Find LCM
    const gcd = (a, b) => (a ? gcd(b % a, a) : b);

    const lcm = (a, b) => (a * b) / gcd(a, b);

    const result = stepsForEachKey.reduce(lcm);
    console.log(result);
})();

// Lowest common multiple of paths from A-Z
// so dont follow at the same time, but follow each and find the lcm
