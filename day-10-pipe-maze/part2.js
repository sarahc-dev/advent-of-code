const { open } = require("node:fs/promises");
const grid = [];

const nextPipes = {
    "|": [0, 2],
    "-": [1, 3],
    L: [0, 1],
    J: [0, 3],
    7: [2, 3],
    F: [1, 2],
};

const getTop = (currRow, currCol) => {
    if (grid[currRow - 1]) {
        return [[currRow - 1, currCol], 2];
    }
};

const getRight = (currRow, currCol) => {
    if (grid[currRow][currCol + 1]) {
        return [[currRow, currCol + 1], 3];
    }
};

const getBottom = (currRow, currCol) => {
    if (grid[currRow + 1]) {
        return [[currRow + 1, currCol], 0];
    }
};

const getLeft = (currRow, currCol) => {
    if (grid[currRow][currCol - 1]) {
        return [[currRow, currCol - 1], 1];
    }
};

const findFirstPipe = startingPos => {
    const top = getTop(startingPos[0], startingPos[1]); // [[1, 0], 2]
    if (top) {
        const topPipe = grid[top[0][0]][top[0][1]]; // .
        if (nextPipes[topPipe] && nextPipes[topPipe].includes(2)) {
            return top;
        }
    }
    const right = getRight(startingPos[0], startingPos[1]); // [[2, 1], 3]
    if (right) {
        const rightPipe = grid[right[0][0]][right[0][1]];
        if (nextPipes[rightPipe] && nextPipes[rightPipe].includes(3)) {
            return right;
        }
    }

    const bottom = getBottom(startingPos[0], startingPos[1]); // [[3, 0], 0]
    if (bottom) {
        const bottomPipe = grid[bottom[0][0]][bottom[0][1]];
        if (nextPipes[bottomPipe] && nextPipes[bottomPipe].includes(0)) {
            return bottom;
        }
    }
};

const findNextPipe = currentPos => {
    const currentPipe = grid[currentPos[0][0]][currentPos[0][1]];

    const directions = nextPipes[currentPipe].filter(d => d !== currentPos[1]);

    switch (directions[0]) {
        case 0:
            return getTop(currentPos[0][0], currentPos[0][1]);
        case 1:
            return getRight(currentPos[0][0], currentPos[0][1]);
        case 2:
            return getBottom(currentPos[0][0], currentPos[0][1]);
        case 3:
            return getLeft(currentPos[0][0], currentPos[0][1]);
    }
};

(async () => {
    const file = await open("./data.txt");

    let startingPos;

    let i = 0;
    for await (const line of file.readLines()) {
        if (!startingPos && line.indexOf("S") !== -1) startingPos = [i, line.indexOf("S")];
        grid.push(line.split(""));
        i++;
    }

    let currentPos = findFirstPipe(startingPos);

    // Get all tiles in the loop, and sort by row

    // create an array of arrays with an [] for each row
    const loop = Array.from({ length: grid.length }, () => []);
    // add starting pos & first pipe
    loop[startingPos[0]].push(startingPos[1]);
    loop[currentPos[0][0]].push(currentPos[0][1]);

    while (!currentPos[0].every((el, index) => el === startingPos[index])) {
        currentPos = findNextPipe(currentPos);
        loop[currentPos[0][0]].push(currentPos[0][1]);
    }

    // Loop = array of arrays where index is the row and each array is list of columns

    let enclosedCount = 0;
    // for each row - skipping 1st and last
    for (let i = 1; i < grid.length - 1; i++) {
        // Keep track of pipe pairs
        let pair = [];
        // iterate over each column
        for (let j = 0; j < grid[i].length; j++) {
            // is it in loop?
            if (loop[i].includes(j)) {
                const pipeType = grid[i][j]; // |
                // FJL7|-S
                // Continuation L7, FJ
                // S?

                // "-" not included in pairs
                if (pipeType === "-") continue;
                if (pair.length === 0) {
                    pair.push(pipeType);
                } else if (pair.length === 1) {
                    if ((pair[0] === "L" && pipeType === "7") || (pair[0] === "F" && pipeType === "J")) {
                        pair[0] = pair[0] += pipeType;
                    } else {
                        pair.push(pipeType);
                    }
                } else if (pair.length === 2) {
                    if ((pair[1] === "L" && pipeType === "7") || (pair[1] === "F" && pipeType === "J")) {
                        pair[1] = pair[1] += pipeType;
                    } else {
                        // start new pair
                        pair = [pipeType];
                    }
                }
            }
            // not in loop
            else {
                // if pair.length = 0 or pair.length === 2 - do nothing?
                if (pair.length === 1) {
                    // pair = ["J"] . is not in loop
                    enclosedCount++;
                }
            }
        }
    }
    console.log(enclosedCount);
})();
