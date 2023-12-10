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
        return [[currRow - 1, currCol], 2]; // [[coords of top pipe], prev position]
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
    const top = getTop(startingPos[0], startingPos[1]);
    const topPipe = grid[top[0][0]][top[0][1]];
    if (nextPipes[topPipe] && nextPipes[topPipe].includes(2)) {
        return top;
    }
    const right = getRight(startingPos[0], startingPos[1]);
    const rightPipe = grid[right[0][0]][right[0][1]];
    if (nextPipes[rightPipe] && nextPipes[rightPipe].includes(3)) {
        return right;
    }
    const bottom = getBottom(startingPos[0], startingPos[1]);
    const bottomPipe = grid[bottom[0][0]][bottom[0][1]];
    if (nextPipes[bottomPipe] && nextPipes[bottomPipe].includes(0)) {
        return bottom;
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
    let length = 1;

    while (!currentPos[0].every((el, index) => el === startingPos[index])) {
        currentPos = findNextPipe(currentPos);
        length++;
    }

    // console.log(startingPos);
    // console.log(grid);
    console.log(length / 2);
})();
