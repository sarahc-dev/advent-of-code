const { open } = require("node:fs/promises");

const data = [];

function moveRocks(start, col, count) {
    for (let i = start; i < data.length; i++) {
        if (data[i][col] === "O") {
            if (count > 0) {
                count--;
            } else {
                // change to "."
                data[i][col] = ".";
            }
        } else if (data[i][col] === ".") {
            if (count > 0) {
                // change to "0"
                data[i][col] = "O";
                count--;
            }
        } else if (data[i][col] === "#") {
            break;
        }
    }
}

(async () => {
    const file = await open("./data.txt");

    for await (const line of file.readLines()) {
        data.push(line.split(""));
    }

    // for each column
    for (let i = 0; i < data[0].length; i++) {
        // count 0s up to hash
        let count = 0;
        let start = 0;

        for (let j = 0; j < data.length; j++) {
            if (data[j][i] === "O") {
                count++;
            } else if (data[j][i] === "#") {
                moveRocks(start, i, count);
                start = j + 1;
                count = 0;
            }
        }
        moveRocks(start, i, count);
    }

    // Sum the load
    let answer = 0;
    data.forEach((row, index) => {
        // 10 - index
        row.forEach(col => {
            if (col === "O") {
                answer += data.length - index;
            }
        });
    });
    console.log(answer);
})();
