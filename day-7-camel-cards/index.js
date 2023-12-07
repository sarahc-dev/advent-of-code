const { open } = require("node:fs/promises");

const values = {
    5: 6,
    41: 5,
    32: 4,
    311: 3,
    221: 2,
    2111: 1,
    11111: 0,
};

const singleCardValue = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    1: 1,
};

function getHandValue(str) {
    const hand = {};
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        hand[char] = (hand[char] || 0) + 1;
    }
    const handStr = Object.values(hand)
        .sort((a, b) => b - a)
        .join("");

    return values[handStr];
}

function getLowerHand(hand1, hand2) {
    for (let i = 0; i < hand1.length; i++) {
        if (singleCardValue[hand1[i]] < singleCardValue[hand2[i]]) return 1;
        if (singleCardValue[hand1[i]] > singleCardValue[hand2[i]]) return 2;
    }
}

(async () => {
    const file = await open("./data.txt");
    const hands = [];

    for await (const line of file.readLines()) {
        const handArr = line.split(" ");
        const handValue = getHandValue(handArr[0]);
        handArr.push(handValue);

        if (hands.length === 0) {
            hands.push(handArr);
            continue;
        }

        let index = hands.length; // last by default
        for (let i = 0; i < hands.length; i++) {
            // iterate over hand and get index
            if (handValue < hands[i][2]) {
                index = i;
                break;
            }

            if (handValue === hands[i][2]) {
                // need to calc order - if lower than i - index = 1
                const lowerHand = getLowerHand(handArr[0], hands[i][0]);
                if (lowerHand === 1) {
                    index = i;
                    break;
                }
            }
        }
        hands.splice(index, 0, handArr);
    }

    let answer = 0;
    hands.forEach((hand, index) => {
        const winnings = (index + 1) * parseInt(hand[1]);
        answer += winnings;
    });
    console.log(answer);
})();
