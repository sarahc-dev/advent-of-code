const { open } = require("node:fs/promises");

function testValid(str, criteria) {
    let check = "";
    let criteriaPos = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "#") {
            check += "#";
        } else {
            if (check !== "") {
                if (check.length != criteria[criteriaPos]) return false;
                check = "";
                criteriaPos++;
            }
        }
    }

    if (criteria[criteriaPos] && check.length == criteria[criteriaPos]) criteriaPos++;
    return criteriaPos === criteria.length ? true : false;
}

function generateCombinations(elements, k) {
    const combinations = [];

    function generate(currentCombination, start) {
        if (currentCombination.length === k) {
            combinations.push([...currentCombination]);
            return;
        }

        for (let i = start; i < elements.length; i++) {
            currentCombination.push(elements[i]);
            generate(currentCombination, i + 1);
            currentCombination.pop();
        }
    }

    generate([], 0);
    return combinations;
}

function calculateNumArrangements(inp) {
    let springCondition = inp[0];
    const criteria = inp[1].split(",");
    let arrangements = 0;

    const indexes = [];
    springCondition.split("").forEach((i, index) => {
        if (i === "?") indexes.push(index);
    });

    const numHash = springCondition.replace(/[^#]/g, "").length;
    const toFind = criteria.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue), 0) - numHash;

    const permutations = generateCombinations(indexes, toFind);
    permutations.forEach(p => {
        const split = springCondition.split("");
        p.forEach(i => split.splice(i, 1, "#"));
        if (testValid(split, criteria)) {
            arrangements++;
        }
    });
    return arrangements === 0 ? 1 : arrangements;
}

(async () => {
    const file = await open("./data.txt");
    const data = [];

    for await (const line of file.readLines()) {
        data.push(line.split(" "));
    }

    let answer = 0;
    data.forEach(line => {
        answer += calculateNumArrangements(line);
    });
    console.log(answer);
})();
