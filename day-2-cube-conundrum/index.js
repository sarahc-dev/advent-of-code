const { open } = require("node:fs/promises");

// only need to save highest of each color
// {1: {red: 5, green: 6, blue: 8}}

(async () => {
    const file = await open("./data.txt");
    const map = new Map();

    for await (const line of file.readLines()) {
        const splitGame = line.split(":");
        const id = splitGame[0].replace(/\D/g, "");

        const highest = { red: 0, green: 0, blue: 0 };

        const cubesRevealed = splitGame[1].trim().split("; ");

        cubesRevealed.forEach(cubes => {
            cubes.split(", ").forEach(color => {
                for (let c in highest) {
                    if (color.includes(c)) {
                        const count = parseInt(color.replace(/\D/g, ""));
                        if (count > highest[c]) highest[c] = count;
                    }
                }
            });
        });
        map.set(id, highest);
    }

    let part1Answer = 0;
    map.forEach((value, key) => {
        if (value["red"] <= 12 && value["green"] <= 13 && value["blue"] <= 14) {
            part1Answer += parseInt(key);
        }
    });
    console.log(part1Answer);

    let part2Answer = 0;
    map.forEach((value, key) => {
        const power = parseInt(value["red"]) * parseInt(value["green"]) * parseInt(value["blue"]);
        part2Answer += power;
    });
    console.log(part2Answer);
})();
