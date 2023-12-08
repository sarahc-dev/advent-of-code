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

    let stepCount = 0;
    let foundZZZ = false;

    let i = 0;
    let position = "AAA";
    while (!foundZZZ) {
        const direction = directions[i] === "L" ? 0 : 1;
        const result = map.get(position);

        if (result[direction] === "ZZZ") {
            stepCount++;
            foundZZZ = true;
        } else {
            stepCount++;
            position = result[direction];
        }

        // if get to end of array go back to zero
        i = i === directions.length - 1 ? 0 : (i += 1);
    }

    console.log(stepCount);
})();
