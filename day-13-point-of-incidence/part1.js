const { open } = require("node:fs/promises");

function checkVertical(map) {
    // flip the board and check horizontal? Flip clockwise
    let flipped = Array.from({ length: map[0].length }, () => []);
    map.forEach(row => {
        for (let i = 0; i < row.length; i++) {
            flipped[i].unshift(row[i]);
        }
    });
    flipped = flipped.map(row => row.join(""));
    return checkHorizontal(flipped);
}

function checkHorizontal(map) {
    let rowsAbove;
    for (let i = 0; i < map.length - 1; i++) {
        let upper = i;
        let lower = i + 1;
        let isReflection = true;
        while (map[upper] && map[lower] && isReflection) {
            if (map[upper] !== map[lower]) {
                isReflection = false;
            }
            upper++;
            lower--;
        }
        if (isReflection) {
            rowsAbove = i + 1;
            break;
        }
    }
    return rowsAbove;
}

(async () => {
    const file = await open("./data.txt");
    const data = [];
    let map = [];
    for await (const line of file.readLines()) {
        if (line === "") {
            data.push(map);
            map = [];
        } else {
            map.push(line);
        }
    }
    data.push(map);

    let answer = 0;

    data.forEach(map => {
        const horizontal = checkHorizontal(map);

        if (horizontal) {
            answer += horizontal * 100;
        } else {
            const vertical = checkVertical(map);
            answer += vertical;
        }
    });

    console.log(answer);
})();
