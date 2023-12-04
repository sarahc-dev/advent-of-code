const { open } = require("node:fs/promises");

// symbols = *=-+/%@#&$

(async () => {
    const file = await open("./data.txt");

    const map = [];

    for await (const line of file.readLines()) {
        map.push(line);
    }

    const isPartNumber = (row, col, digits) => {
        const isNotDotOrDigit = /[^.\d]/;
        let isPart = false;

        if (row > 0) {
            for (let x = col - 1; x <= col + digits; x++) {
                if (x >= 0 && x <= 139) {
                    if (isNotDotOrDigit.test(map[row - 1][x])) isPart = true;
                }
            }
        }
        if (row < map.length - 1) {
            for (let x = col - 1; x <= col + digits; x++) {
                if (x >= 0 && x <= 139) {
                    if (isNotDotOrDigit.test(map[row + 1][x])) isPart = true;
                }
            }
        }
        if (col > 0) {
            if (isNotDotOrDigit.test(map[row][col - 1])) isPart = true;
        }
        if (col + digits <= 139) {
            if (isNotDotOrDigit.test(map[row][col + digits])) isPart = true;
        }

        return isPart;
    };

    const regex = /\b(?=\d{1,3}\b)\d+\b/g;
    const validParts = [];

    map.forEach((line, lIndex) => {
        const matches = line.match(regex);

        if (matches) {
            let idx = 0;
            const parts = matches.filter(match => {
                let col = line.indexOf(match);

                if (col <= idx) {
                    col = line.indexOf(match, col + 1);
                }
                idx = col;

                return isPartNumber(lIndex, col, match.length);
            });
            console.log(validParts);
            validParts.push(parts);
        }
    });

    let answer = 0;
    validParts.flat().forEach(num => (answer += parseInt(num)));

    console.log(answer);
})();
