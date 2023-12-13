const { open } = require("node:fs/promises");

// prevent it only finding first one - need to find first one that's different

function checkVertical(map, original = null) {
    // flip the board and check horizontal? Flip clockwise
    let flipped = Array.from({ length: map[0].length }, () => []);
    map.forEach(row => {
        // row = #.##..##.
        for (let i = 0; i < row.length; i++) {
            flipped[i].unshift(row[i]);
        }
    });
    flipped = flipped.map(row => row.join(""));
    return checkHorizontal(flipped, original);
}

function checkHorizontal(map, original = null) {
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
            if (i + 1 !== original) {
                rowsAbove = i + 1;
                break;
            }
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

    function changeChar(line, index) {
        const arr = line.split("");
        arr[index] = arr[index] === "." ? "#" : ".";
        return arr.join("");
    }

    data.forEach(test => {
        const original = [null, null]; // [horizontal, vertical]
        const horizontal = checkHorizontal(test);
        if (horizontal) {
            original[0] = horizontal;
        } else {
            const vertical = checkVertical(test);
            original[1] = vertical;
        }

        let foundNew = [null, null];
        for (let i = 0; i < test.length; i++) {
            let f = false;
            for (let j = 0; j < test[0].length; j++) {
                test[i] = changeChar(test[i], j);
                const horizontal = checkHorizontal(test, original[0]); // check against orig here
                if (horizontal) {
                    // if found horizontal and not original
                    // if (horizontal !== original[0]) {
                    f = true;
                    foundNew[0] = horizontal;
                    break;
                    // }
                } else {
                    const vertical = checkVertical(test, original[1]);
                    if (vertical) {
                        f = true;
                        foundNew[1] = vertical;
                        break;
                    }
                }
                // change back
                test[i] = changeChar(test[i], j);
            }
            if (f) break;
        }

        // No new one found add orig?
        if (!foundNew[0] && !foundNew[1]) {
            if (original[0]) {
                answer += original[0] * 100;
            } else {
                answer += original[1];
            }
        } else if (foundNew[0]) {
            answer += foundNew[0] * 100;
        } else if (foundNew[1]) {
            answer += foundNew[1];
        }
    });

    console.log(answer);
})();
