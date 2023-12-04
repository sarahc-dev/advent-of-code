const { open } = require("node:fs/promises");

(async () => {
    const file = await open("./data.txt");

    const map = [];

    for await (const line of file.readLines()) {
        map.push(line.split(""));
    }

    const validParts = [];

    function checkIfValid(row, col) {
        const isNotDotOrDigit = /[^.\d]/;
        let isValid = false;

        if (map[row - 1] && map[row - 1][col - 1] && isNotDotOrDigit.test(map[row - 1][col - 1])) isValid = true;
        if (map[row - 1] && map[row - 1][col] && isNotDotOrDigit.test(map[row - 1][col])) isValid = true;
        if (map[row - 1] && map[row - 1][col + 1] && isNotDotOrDigit.test(map[row - 1][col + 1])) isValid = true;
        if (map[row][col - 1] && isNotDotOrDigit.test(map[row][col - 1])) isValid = true;
        if (map[row][col + 1] && isNotDotOrDigit.test(map[row][col + 1])) isValid = true;
        if (map[row + 1] && map[row + 1][col - 1] && isNotDotOrDigit.test(map[row + 1][col - 1])) isValid = true;
        if (map[row + 1] && map[row + 1][col] && isNotDotOrDigit.test(map[row + 1][col])) isValid = true;
        if (map[row + 1] && map[row + 1][col + 1] && isNotDotOrDigit.test(map[row + 1][col + 1])) isValid = true;
        return isValid;
    }

    map.forEach((line, row) => {
        const digitRegex = /\d/;
        let num = "";
        let isValid = false;
        line.forEach((char, col) => {
            if (digitRegex.test(char)) {
                num += char;
                if (checkIfValid(row, col)) isValid = true;

                if (col === line.length - 1) {
                    if (num !== "") {
                        if (isValid) validParts.push(num);
                        num = "";
                        isValid = false;
                    }
                }
            } else {
                if (num !== "") {
                    if (isValid) validParts.push(num);
                    num = "";
                    isValid = false;
                }
            }
        });
    });

    let answer = 0;
    validParts.forEach(part => (answer += parseInt(part)));
    // console.log(validParts);
    // console.log(answer);

    // part 2

    function checkForGears(row, col) {
        const regexDigit = /\d/;
        const adjNums = [];

        let hasDigit = "";
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (regexDigit.test(map[i][j])) {
                    hasDigit += "t";
                } else {
                    hasDigit += "f";
                }
            }
        }

        // check top
        const top = hasDigit.slice(0, 3);
        if (top !== "fff") {
            if (top === "ftf") adjNums.push(parseInt(map[row - 1][col]));
            if (top === "tff" || top === "ttf" || top === "tft") {
                let num = map[row - 1][col - 1];
                if (top[1] === "t") num += map[row - 1][col];
                if (regexDigit.test(map[row - 1][col - 2])) {
                    num = map[row - 1][col - 2] + num;
                    if (regexDigit.test(map[row - 1][col - 3])) {
                        num = map[row - 1][col - 3] + num;
                    }
                }
                adjNums.push(parseInt(num));
            }
            if (top === "ttt") {
                let num = map[row - 1][col - 1] + map[row - 1][col] + map[row - 1][col + 1];
                adjNums.push(parseInt(num));
            }
            if (top === "fft" || top === "ftt" || top === "tft") {
                let num = map[row - 1][col + 1];
                if (top[1] === "t") num = map[row - 1][col] + num;
                if (regexDigit.test(map[row - 1][col + 2])) {
                    num += map[row - 1][col + 2];
                    if (regexDigit.test(map[row - 1][col + 3])) {
                        num += map[row - 1][col + 3];
                    }
                }
                adjNums.push(parseInt(num));
            }
        }

        // check left
        if (hasDigit[3] === "t") {
            let num = map[row][col - 1];
            if (regexDigit.test(map[row][col - 2])) {
                num = map[row][col - 2] + num;
                if (regexDigit.test(map[row][col - 3])) {
                    num = map[row][col - 3] + num;
                }
            }
            adjNums.push(parseInt(num));
        }

        // check right
        if (hasDigit[5] === "t") {
            let num = map[row][col + 1];
            if (regexDigit.test(map[row][col + 2])) {
                num += map[row][col + 2];
                if (regexDigit.test(map[row][col + 3])) {
                    num += map[row][col + 3];
                }
            }
            adjNums.push(parseInt(num));
        }

        // check bottom
        const bottom = hasDigit.slice(6);
        if (bottom !== "fff") {
            if (bottom === "ftf") adjNums.push(parseInt(map[row + 1][col]));
            if (bottom === "tff" || bottom === "ttf" || bottom === "tft") {
                let num = map[row + 1][col - 1];
                if (bottom[1] === "t") num += map[row + 1][col];
                if (regexDigit.test(map[row + 1][col - 2])) {
                    num = map[row + 1][col - 2] + num;
                    if (regexDigit.test(map[row + 1][col - 3])) {
                        num = map[row + 1][col - 3] + num;
                    }
                }
                adjNums.push(parseInt(num));
            }
            if (bottom === "ttt") {
                let num = map[row + 1][col - 1] + map[row + 1][col] + map[row + 1][col + 1];
                adjNums.push(parseInt(num));
            }
            if (bottom === "fft" || bottom === "ftt" || bottom === "tft") {
                let num = map[row + 1][col + 1];
                if (bottom[1] === "t") num = map[row + 1][col] + num;
                if (regexDigit.test(map[row + 1][col + 2])) {
                    num += map[row + 1][col + 2];
                    if (regexDigit.test(map[row + 1][col + 3])) {
                        num += map[row + 1][col + 3];
                    }
                }
                adjNums.push(parseInt(num));
            }
        }

        // returns array of adjacent numbers
        // console.log(adjNums);
        return adjNums;
    }

    const gearRatios = [];
    map.forEach((line, row) => {
        // index where there is *
        const indexes = line.flatMap((char, i) => (char === "*" ? i : []));

        if (indexes.length > 0) {
            indexes.forEach(starIndex => {
                const result = checkForGears(row, starIndex);

                if (result.length === 2) {
                    const gearRatio = result[0] * result[1];
                    gearRatios.push(gearRatio);
                }
            });
        }
    });
    let answer2 = 0;
    gearRatios.forEach(num => (answer2 += num));
    console.log(answer2);
})();
