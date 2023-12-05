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

    const totalScratchcards = [];
    let id = 1;
    const length = scratchcards.length;

    while (id <= length) {
        // filter for card with id
        const cards = scratchcards.filter(card => card["id"] == id);
        // push result to totalScratchcards you have
        totalScratchcards.push(cards);

        // check for winners on that card id = []
        const winners = cards[0]["yourNums"].filter(num => cards[0]["winningNums"].includes(num));
        console.log(winners);

        if (winners.length > 0) {
            cards.forEach(card => {
                // push correct cards per how many winners
                winners.forEach((winner, index) => {
                    const cardToPush = scratchcards.find(card => card["id"] == index + 1 + id);
                    if (cardToPush) scratchcards.push(cardToPush);
                });
            });
        }
        id++;
    }

    const answer = totalScratchcards.flat().length;
    console.log(answer);
})();
