const { open } = require("node:fs/promises");

(async () => {
    const file = await open("./data.txt");

    const scratchcards = [];

    for await (const line of file.readLines()) {
        const splitId = line.split(":");
        const id = splitId[0].replace(/\D/g, "");
        const splitWinning = splitId[1].trim().split(" | ");
        const winningNums = splitWinning[0].replace(/\s+/g, " ").split(" ");
        const yourNums = splitWinning[1].replace(/\s+/g, " ").split(" ");

        scratchcards.push({
            id: id,
            winningNums: winningNums,
            yourNums: yourNums,
        });
    }

    let answer = 0;
    scratchcards.forEach(card => {
        const winningMatch = card["yourNums"].filter(num => card["winningNums"].includes(num));

        let score = 0;
        if (winningMatch.length > 0) {
            score = winningMatch.slice(1).reduce(accumulator => accumulator * 2, 1);
        }

        answer += score;
    });
    console.log(answer);
})();
