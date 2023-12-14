const { open } = require("node:fs/promises");

let data = [];

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

function tilt() {
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
}

function rotateClockwise() {
    let flipped = Array.from({ length: data[0].length }, () => []);
    for (let i = data[0].length - 1; i >= 0; i--) {
        data[i].forEach((item, index) => {
            flipped[index].push(item);
        });
    }
    data = flipped;
}

(async () => {
    const file = await open("./data.txt");

    for await (const line of file.readLines()) {
        data.push(line.split(""));
    }

    function cycle() {
        // North, west, south, east

        // North
        tilt();

        // West
        rotateClockwise();
        tilt();
        // South
        rotateClockwise();
        tilt();
        // East
        rotateClockwise();
        tilt();
        // rotate clockwise = back facing north
        rotateClockwise();
    }

    // run x number of cycles
    for (let i = 0; i <= 999; i++) {
        cycle();
    }

    // const start = data;

    // let same = false;
    // let count = 0;
    // while (!same) {
    //     // test for same
    //     cycle();
    //     let test = true;
    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].join("") !== start[i].join("")) {
    //             test = false;
    //             break;
    //         }
    //     }
    //     same = test;
    //     count++;
    // }

    // console.log(count);

    //console.log(data.map(row => row.join("")));

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
